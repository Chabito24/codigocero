// Escucha el evento que indica que el DOM ya fue cargado y es seguro manipularlo
document.addEventListener('DOMContentLoaded', function(){ // Espera a que el HTML esté parseado antes de ejecutar JS que toca el DOM
    navegacionFija() // Activa la lógica para fijar/desfijar el header según el scroll
    crearGaleria() // Al estar listo el DOM, llama a la función que construye la galería
    resaltarEnlace() // Inicia el observador para resaltar el enlace activo del menú según la sección visible
    scrollNav() // Habilita el desplazamiento suave al hacer click en los enlaces del menú
}) // Cierra el callback del evento DOMContentLoaded

function navegacionFija() { // Define la función que controla si el header se vuelve fijo
    const header = document.querySelector('.header') //selector de clase header
    const sobreFestival = document.querySelector('.sobre-festival') //selector

    document.addEventListener('scroll', function() { // Escucha el scroll de la página para evaluar la posición
        if(sobreFestival.getBoundingClientRect().bottom < 1) { // Si la parte inferior de .sobre-festival salió de la ventana (arriba)
            header.classList.add('fixed') // Añade la clase que fija el header
        }else { // En caso contrario
            header.classList.remove('fixed') // Quita la clase para que el header no esté fijo
        }
    }) // Cierra el listener de scroll
        
} // Cierra la función navegacionFija


function crearGaleria() { // Define la función que genera dinámicamente las imágenes de la galería
    const cantidadImagenes = 16 // Cantidad total de imágenes a insertar
    const galeria = document.querySelector('.galeria-imagenes') // Selecciona el contenedor donde se insertarán las imágenes (clase .galeria-imagenes)

    // Bucle para crear y agregar varias imágenes a la galería
    for(let i = 1; i <= cantidadImagenes; i++) { // Inicializa i=1; ⚠️ OJO: la condición "1 <= 16" es SIEMPRE verdadera (bucle infinito). Debería ser "i <= 16".
        const imagen = document.createElement('IMG') // Crea un elemento <img> (las etiquetas HTML no son sensibles a mayúsculas/minúsculas)
        imagen.src = `src/img/gallery/full/${i}.jpg` // Define la ruta de la imagen usando plantillas: 1.jpg, 2.jpg, ... 16.jpg
        imagen.alt = 'Imagen Galeria' // Texto alternativo para accesibilidad y cuando la imagen no se puede mostrar

        //Event Handler - es el proceso de detectar y responder a una interaccion del usuario en este caso a un clik
        imagen.onclick = function() { // Asigna una función que se ejecuta al hacer click en la imagen
            mostrarImagen(i) // Llama a mostrarImagen pasando el índice para saber qué archivo abrir
        } // Cierra la función asignada al evento onclick
        
        galeria.appendChild(imagen) // Inserta la imagen como hijo del contenedor de la galería
    } // Cierra el for

} // Cierra la función crearGaleria

function mostrarImagen(i) { // Función que crea y muestra el modal con la imagen ampliada

    const imagen = document.createElement('IMG') // Crea una etiqueta <img> para el modal
    imagen.src = `src/img/gallery/full/${i}.jpg` // Apunta a la misma imagen pero para mostrarla en grande
    imagen.alt = 'Imagen Galeria' // Texto alternativo para la imagen

    //Generar Modal
    const modal = document.createElement('DIV') // Crea el contenedor del modal
    modal.classList.add('modal') // Agrega la clase para estilos de modal
    modal.onclick = cerrarModal //no requiere funcion por que no le estamos pasando un parametro como a mostrarImagen, esto debido a que cuando muestro la imagen el parametro es I ya que tiene que saber cual es la imagen a a cual le estoy dando click pero para cerrar el modal es irrelevante, igual se le puede pasar el function sin asignarle el arguumento de "i" ya que no es necesario

    //Botón de cerrar
    const cerrarModalBtn = document.createElement('BUTTON') //crea elemento etiqueta HTML
    cerrarModalBtn.textContent = 'X' //contenido
    cerrarModalBtn.classList.add('btn-cerrar') //crea clase
    cerrarModalBtn.onclick = cerrarModal //cierra el modal

        modal.appendChild(imagen) //generamos a imagen que se esta tomando en la funcion anterior de function mostrarImagen(i)y la agregamos al modal
        modal.appendChild(cerrarModalBtn) // Inserta el botón de cerrar dentro del modal

    //Agregar al HTML
    const body = document.querySelector('body') // Selecciona la etiqueta <body> para manipularla
    body.classList.add('overflow-hidden') // Evita el scroll del body mientras el modal esté abierto
    body.appendChild(modal) //inyecta un div al HTML al dar click en la imagen
} // Cierra la función mostrarImagen

function cerrarModal() { // Función que cierra (y remueve) el modal
    const modal = document.querySelector('.modal') // Busca el modal actual en el DOM
    modal.classList.add('fade-out') // Activa animación de salida si existe en CSS
    setTimeout(()=> { // Programa la ejecución de un bloque después de 500 ms
        modal?.remove() //valida si eiste el modal y en ese caso eliminalo
        const body = document.querySelector('body') // Vuelve a seleccionar el body tras eliminar el modal
        body.classList.remove('overflow-hidden') // Restaura el scroll del body
    },500); //retrsa este codigo 500 milisegudos lo que es lo mismo que medio segundo
    } // Cierra la función cerrarModal
    
function resaltarEnlace() { // Función que resalta en el menú el enlace de la sección visible
    document.addEventListener('scroll', function() { // Escucha el scroll para calcular la sección activa
        const sections = document.querySelectorAll('section'); // Obtiene todas las secciones del documento
        const navLinks = document.querySelectorAll('.navegacion-principal a'); // Obtiene todos los enlaces del menú principal

        let actual = ''; // Guarda el id de la sección actualmente activa
        sections.forEach( section =>{ // Itera por cada sección para determinar cuál está en viewport
            const sectionTop = section.offsetTop // Distancia desde el top del documento hasta la sección
            const sectionHeight = section.clientHeight // Alto de la sección
            if(window.scrollY >= (sectionTop - sectionHeight / 3)){ // Si el scroll pasó un umbral de la sección, la marca como actual
                actual = section.id // Guarda el id de la sección visible
            }
        }) //iteramos sobre todas las secciones detectando cual es la que esta mas visible

        navLinks.forEach(link => { // Recorre todos los enlaces de navegación
            link.classList.remove('active') // Quita la clase active de todos para reiniciar estado
            if(link.getAttribute('href') === '#' + actual ){ // Si el href del link coincide con la sección activa
                link.classList.add('active') // Activa visualmente ese enlace
            }
        }) // Cierra el forEach de navLinks
    }) // Cierra el listener de scroll
} // Cierra la función resaltarEnlace

function scrollNav() { // Función que aplica desplazamiento suave al hacer click en los enlaces del menú
    const navLinks = document.querySelectorAll('.navegacion-principal a') // Selecciona todos los enlaces dentro de la navegación principal

    navLinks.forEach( link => { // Itera sobre cada enlace para registrar el evento de click
        link.addEventListener('click', e => { // Escucha clicks en el enlace
            e.preventDefault() // Evita el salto inmediato por el ancla
            const sectionScroll = e.currentTarget.getAttribute('href') // Lee el selector destino (ej. "#galeria")
            const section = document.querySelector(sectionScroll) // Busca el elemento de destino por su id
            section.scrollIntoView({behavior:'smooth'}) // Desplaza la página suavemente hasta la sección
        }) // Cierra el callback del click
    }) // Cierra el forEach de enlaces
}//asigna el efecto cuando damos click a los enlaces//# sourceMappingURL=app.js.map
