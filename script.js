document.addEventListener('DOMContentLoaded', function() {
    cargarImagenesDesdeCSV();
});

// Función para cargar y mostrar imágenes desde datos CSV
function cargarImagenesDesdeCSV() {
    fetch('tabla_evaluacion.csv')
        .then(response => response.text())
        .then(csvText => {
            const imagenes = parseCSV(csvText);
            window.imagenes = imagenes; // Almacenar globalmente para uso en otras funciones
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
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index];
            return obj;
        }, {});
    });
}

// Función para mostrar imágenes y evaluaciones en la página
function mostrarImagenes(data) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = '';

    data.forEach(imagen => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        const imageURL = `https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/Imagenes/imagen_${imagen.id}.png`;
        imgDiv.innerHTML = `
            <img src="${imageURL}" alt="${imagen.commonName}" class="image">
            <table>
                <tr><td>ID:</td><td>${imagen.id}</td></tr>
                <tr><td>Common Name:</td><td>${imagen.commonName}</td></tr>
                <tr><td>Scientific Name:</td><td>${imagen.scientificName}</td></tr>
                <tr><td>Pathogen:</td><td>${imagen.pathogen}</td></tr>
                <tr><td>Probability:</td><td>${imagen.probability}</td></tr>
                <tr><td colspan="2"><select>
                    <option value="true">Verdadero</option>
                    <option value="false">Falso</option>
                    <option value="unknown">No se puede determinar</option>
                </select></td></tr>
                <tr><td colspan="2"><textarea placeholder="Añade un comentario..."></textarea></td></tr>
                <tr><td colspan="2"><button onclick="guardarComentario('${imagen.id}')">Guardar</button></td></tr>
            </table>
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
    // Aquí deberías añadir la lógica para enviar estos datos a tu backend o API
}
