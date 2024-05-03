document.addEventListener('DOMContentLoaded', function() {
    cargarImagenesDesdeCSV();
});

// URL del archivo CSV en el repositorio de GitHub
const csvURL = 'tabla_evaluacion.csv';

// Función para cargar y mostrar imágenes desde datos CSV
function cargarImagenesDesdeCSV() {
    fetch(csvURL)
        .then(response => response.text())
        .then(csvText => {
            const imagenes = parseCSV(csvText);
            mostrarImagenes(imagenes);
        })
        .catch(err => console.error('Error al cargar y parsear el CSV:', err));
}

// Función para parsear texto CSV y convertirlo a objetos de JavaScript
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines.shift().split(',');

    return lines.map(line => {
        const data = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = data[index];
            return obj;
        }, {});
    });
}

// Función para mostrar imágenes y evaluaciones en la página
function mostrarImagenes(datos) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas imágenes

    datos.forEach(imagen => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        const imageURL = 'https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/Imagenes/imagen_' + imagen.id + '.png';
        imgDiv.innerHTML = `
            <img src="${imageURL}" alt="${imagen.commonName}" class="image">
            <div><strong>ID:</strong> ${imagen.id}</div>
            <div><strong>Nombre común:</strong> ${imagen.commonName}</div>
            <div><strong>Nombre científico:</strong> ${imagen.scientificName}</div>
            <div><strong>Patógeno:</strong> ${imagen.pathogen}</div>
            <div><strong>Probabilidad:</strong> ${imagen.probability}</div>
            <select>
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
                <option value="unknown">No se puede determinar</option>
            </select>
            <textarea placeholder="Añade un comentario..."></textarea>
            <button onclick="guardarComentario('${imagen.id}')">Guardar</button>
        `;
        imgContainer.appendChild(imgDiv);
    });
}

// Función para guardar comentarios sobre las imágenes
function guardarComentario(imageId) {
    const imgBox = document.querySelector(`button[onclick="guardarComentario('${imageId}')"]`).parentNode;
    const comentario = imgBox.querySelector('textarea').value;
    const evaluacion = imgBox.querySelector('select').value;
    const fecha = new Date().toISOString();

    console.log(`Guardando comentario para la imagen ${imageId}: ${comentario}, Evaluación: ${evaluacion}, Fecha: ${fecha}`);
    // Aquí añadirías la lógica para enviar estos datos a tu backend o API
}
