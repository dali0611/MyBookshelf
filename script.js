const botonAgregar = document.getElementById("agregarLibro");
const botonEntrar = document.getElementById("entrarBiblioteca");
const botonInicio = document.getElementById("volverInicio");

const frasesLiterarias = [
    "Hay historias que terminan en la última página, pero permanecen mucho después.",
    "Entre páginas encontramos mundos que nunca supimos que necesitábamos.",
    "A veces, un libro llega justo cuando necesitamos una historia.",
    "Cada libro guarda un universo esperando ser descubierto.",
    "Hay personajes que se sienten más reales que los recuerdos.",
    "Una biblioteca es un hogar construido con historias."
];

function cambiarFrase() {
    const frase = frasesLiterarias[
        Math.floor(Math.random() * frasesLiterarias.length)
    ];

    document.getElementById("fraseLiteraria").textContent = frase;
}

cambiarFrase();

botonEntrar.addEventListener("click", function() {
    document.getElementById("paginaInicio").style.display = "none";
    document.querySelector("main").style.display = "block";
});

botonInicio.addEventListener("click", function() {
    document.getElementById("paginaInicio").style.display = "flex";
    document.querySelector("main").style.display = "none";
    cambiarFrase();
});
let misLibros = JSON.parse(
    localStorage.getItem("myBookshelfLibros") || "[]"
);

let categoriaActual = "Todos";
let textoBusqueda = "";
function actualizarEstadisticas() {

    document.getElementById("totalLibros").textContent =
        misLibros.length;

    document.getElementById("librosTerminados").textContent =
        misLibros.filter(libro => libro.estado === "Terminado").length;

    document.getElementById("librosLeyendo").textContent =
        misLibros.filter(libro => libro.estado === "Leyendo").length;

    document.getElementById("librosPendientes").textContent =
        misLibros.filter(libro => libro.estado === "Pendiente").length;

    document.getElementById("totalFavoritos").textContent =
        misLibros.filter(libro => libro.favorito).length;
}
function guardarLibros() {
    localStorage.setItem(
        "myBookshelfLibros",
        JSON.stringify(misLibros)
    );
    actualizarEstadisticas();
}

function mostrarLibros() {
    const biblioteca = document.querySelector(".libros");
    biblioteca.innerHTML = "";

    misLibros.forEach(function(libro) {

        const tarjeta = document.createElement("div");
        tarjeta.className = "libro";

        // Favoritos
        const favorito = document.createElement("button");
        favorito.className = "favorito";
        favorito.textContent = libro.favorito ? "♥" : "♡";

        if (libro.favorito) {
            favorito.classList.add("activo");
        }

        favorito.addEventListener("click", function() {
            libro.favorito = !libro.favorito;
            guardarLibros();
            actualizarEstadisticas();
            mostrarLibros();
        });
        // Eliminar libro
const botonEliminar = document.createElement("button");
botonEliminar.textContent = "🗑";
botonEliminar.className = "eliminar-libro";

botonEliminar.addEventListener("click", function() {

    const confirmar = confirm(
        "¿Seguro que deseas eliminar este libro?"
    );

    if (confirmar) {
        misLibros = misLibros.filter(function(item) {
            return item.id !== libro.id;
        });

        guardarLibros();
        mostrarLibros();
    }
});

        // Portada
        if (libro.portada) {
            const imagen = document.createElement("img");
            imagen.src = libro.portada;
            imagen.alt = "Portada de " + libro.titulo;
            tarjeta.appendChild(imagen);
        } else {
            const sinPortada = document.createElement("div");
            sinPortada.className = "sin-portada";
            sinPortada.textContent = "📖 Sin portada";
            tarjeta.appendChild(sinPortada);
        }

        // Información
        const titulo = document.createElement("h3");
titulo.textContent = libro.titulo;
titulo.classList.add("titulo-libro");

titulo.addEventListener("click", function() {
    abrirFicha(libro);
});

        const autor = document.createElement("p");
        autor.textContent = "Autor: " + libro.autor;
        
// Progreso de lectura
const progreso = document.createElement("div");
progreso.className = "progreso-lectura";

const paginas = document.createElement("p");
paginas.textContent =
    `${libro.paginasLeidas || 0} de ${libro.totalPaginas || 0} páginas`;

const barraFondo = document.createElement("div");
barraFondo.className = "barra-fondo";

const barra = document.createElement("div");
barra.className = "barra-progreso";

const porcentaje = libro.totalPaginas > 0
    ? Math.min(100, Math.round(
        (libro.paginasLeidas / libro.totalPaginas) * 100
    ))
    : 0;

barra.style.width = porcentaje + "%";

// Etiqueta de lectura completada
const etiquetaCompletado = document.createElement("p");

if (porcentaje === 100) {
    etiquetaCompletado.textContent = "✓ Lectura completada";
    etiquetaCompletado.className = "lectura-completada";
}

const textoPorcentaje = document.createElement("p");
textoPorcentaje.textContent = porcentaje + "% completado";

barraFondo.appendChild(barra);
progreso.appendChild(paginas);
progreso.appendChild(barraFondo);
progreso.appendChild(textoPorcentaje);
if (porcentaje === 100) {
    progreso.appendChild(etiquetaCompletado);
}

        // Estado
        const estado = document.createElement("select");
        estado.className = "estado";

        ["Pendiente", "Leyendo", "Terminado"].forEach(function(opcion) {
            const elemento = document.createElement("option");
            elemento.value = opcion;
            elemento.textContent = opcion;
            elemento.selected = libro.estado === opcion;
            estado.appendChild(elemento);
        });

        estado.addEventListener("change", function() {
            libro.estado = estado.value;
            guardarLibros();
        });

        // Subir portada
        const selector = document.createElement("input");
        selector.type = "file";
        selector.accept = "image/*";
        selector.hidden = true;

        const botonPortada = document.createElement("button");
        botonPortada.textContent = "Cambiar portada";

        botonPortada.addEventListener("click", function() {
            selector.click();
        });

        selector.addEventListener("change", function() {
            const archivo = selector.files[0];

            if (!archivo || !archivo.type.startsWith("image/")) return;

            const lector = new FileReader();

            lector.onload = function() {
                libro.portada = lector.result;
                guardarLibros();
                mostrarLibros();
            };

            lector.readAsDataURL(archivo);
        });

        // Frases favoritas
        const botonFrases = document.createElement("button");
        botonFrases.textContent = "♡ Mis frases";

        botonFrases.addEventListener("click", function() {
            const frase = prompt("Escribe una frase de este libro:");

            if (frase && frase.trim()) {
                libro.frases = libro.frases || [];
                libro.frases.push(frase.trim());
                guardarLibros();
                mostrarLibros();
            }
        });

        const listaFrases = document.createElement("div");

        (libro.frases || []).forEach(function(frase) {
            const texto = document.createElement("p");
            texto.textContent = "❝ " + frase + " ❞";
            listaFrases.appendChild(texto);
        });

        // Construir tarjeta
        tarjeta.appendChild(favorito);
        tarjeta.appendChild(botonEliminar);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(autor);
        tarjeta.appendChild(progreso);
        tarjeta.appendChild(estado);
        tarjeta.appendChild(botonPortada);
        tarjeta.appendChild(selector);
        tarjeta.appendChild(botonFrases);
        tarjeta.appendChild(listaFrases);

        biblioteca.appendChild(tarjeta);
    });
    aplicarFiltros();
}

// Agregar libros
botonAgregar.addEventListener("click", function() {

    const titulo = prompt("¿Cuál es el título del libro?");
    if (!titulo || !titulo.trim()) return;

    const autor = prompt("¿Quién es el autor?");

   misLibros.push({
    id: Date.now(),
    titulo: titulo.trim(),
    autor: autor ? autor.trim() : "Desconocido",
    estado: "Pendiente",
    favorito: false,
    portada: "",
    frases: [],
    totalPaginas: 0,
    paginasLeidas: 0
});
    

    guardarLibros();
    mostrarLibros();
});

// Filtros
function filtrarLibros(categoria) {
    categoriaActual = categoria;
    aplicarFiltros();
}

function aplicarFiltros() {
    document.querySelectorAll(".libro").forEach(function(tarjeta, indice) {
        const libro = misLibros[indice];

        const coincideCategoria =
            categoriaActual === "Todos" ||
            (categoriaActual === "Favoritos" && libro.favorito) ||
            libro.estado === categoriaActual;

        const texto = (libro.titulo + " " + libro.autor).toLowerCase();
        const coincideBusqueda = texto.includes(textoBusqueda);

        tarjeta.style.display =
            coincideCategoria && coincideBusqueda ? "block" : "none";
    });
}

// Mostrar libros guardados al abrir
mostrarLibros();
actualizarEstadisticas();

const ventanaFicha = document.getElementById("ventanaFicha");

function abrirFicha(libro) {

    document.getElementById("generoLibro").value =
        libro.genero || "";
        
        document.getElementById("totalPaginas").value =
    libro.totalPaginas || "";

document.getElementById("paginasLeidas").value =
    libro.paginasLeidas || "";

    document.getElementById("fechaInicio").value =
        libro.fechaInicio || "";

    document.getElementById("fechaFin").value =
        libro.fechaFin || "";

    document.getElementById("calificacionLibro").value =
        libro.calificacion || "";

    document.getElementById("opinionLibro").value =
        libro.opinion || "";
        

    const frases = document.getElementById("frasesFicha");
    frases.innerHTML = "";

    (libro.frases || []).forEach(function(frase) {
        const parrafo = document.createElement("p");
        parrafo.textContent = "❝ " + frase + " ❞";
        frases.appendChild(parrafo);
    });

    ventanaFicha.style.display = "flex";

    document.getElementById("guardarFicha").onclick = function() {

        libro.genero = document.getElementById("generoLibro").value;
        libro.fechaInicio = document.getElementById("fechaInicio").value;
        libro.fechaFin = document.getElementById("fechaFin").value;
        libro.calificacion = document.getElementById("calificacionLibro").value;
        libro.opinion = document.getElementById("opinionLibro").value;
        const totalTexto = document.getElementById("totalPaginas").value;
const leidasTexto = document.getElementById("paginasLeidas").value;

if (totalTexto === "" && leidasTexto === "") {
    libro.totalPaginas = 0;
    libro.paginasLeidas = 0;
} else {
    const total = Number(totalTexto);
    const leidas = Number(leidasTexto);

    if (
        !Number.isInteger(total) ||
        !Number.isInteger(leidas) ||
        total < 1 ||
        leidas < 0 ||
        leidas > total
    ) {
        alert("Revisa las páginas. Las páginas leídas no pueden superar el total.");
        return;
    }

    libro.totalPaginas = total;
    libro.paginasLeidas = leidas;
}

        guardarLibros();

        ventanaFicha.style.display = "none";
    };
}

document.getElementById("cerrarFicha").addEventListener("click", function() {
    ventanaFicha.style.display = "none";
});
document.getElementById("buscarLibro").addEventListener("input", function() {
    textoBusqueda = this.value.trim().toLowerCase();
    aplicarFiltros();
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("./service-worker.js")
            .then(function() {
                console.log("MyBookshelf está lista para instalarse.");
            })
            .catch(function(error) {
                console.log("Error al registrar:", error);
            });
    });
}



