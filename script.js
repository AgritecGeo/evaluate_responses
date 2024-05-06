document.addEventListener('DOMContentLoaded', function() {
    //cargarImagenesDesdeCSV();
    cargarImagenesDesdeGCP();
});


function cargarImagenesDesdeGCP() {
    fetch('https://us-central1-agritecgeo-analytics.cloudfunctions.net/evaluate-response-plantix-1')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const imagenes = JSON.parse(data);
            window.imagenes = imagenes;
            mostrarImagenes(imagenes);
        })
        .catch(err => console.error('Error al cargar las imágenes desde GCP:', err));
}

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

function mostrarImagenes(imagenes) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = '';

    imagenes.forEach(imagen => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        const imageURL = imagen.url_imagen || 'https://via.placeholder.com/150'; // Proporcionar una imagen por defecto
        imgDiv.innerHTML = `
        <img src="${imageURL}" alt="${imagen.commonName}" class="image">
        <table>
            <tr><td>ID:</td><td id="id-${imagen.id}">${imagen.id}</td></tr>
            <tr><td>Common Name:</td><td id="commonName-${imagen.id}">${imagen.commonName}</td></tr>
            <tr><td>Scientific Name:</td><td id="scientificName-${imagen.id}">${imagen.scientificName}</td></tr>
            <tr><td>Pathogen:</td><td id="pathogen-${imagen.id}">${imagen.pathogen}</td></tr>
            <tr><td>Probability:</td><td id="probability-${imagen.id}">${imagen.probability}</td></tr>
            <tr><td colspan="2"><select id="status-${imagen.id}">
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
                <option value="unknown">No se puede determinar</option>
            </select></td></tr>
            <tr><td colspan="2"><textarea id="comment-${imagen.id}" placeholder="Añade un comentario..."></textarea></td></tr>
            <tr><td colspan="2"><button onclick="enviarDatos('${imagen.id}')">Enviar Datos</button></td></tr>
        </table>
    `;
        imgContainer.appendChild(imgDiv);
    });
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


/*
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
*/


function enviarDatos(imagenId) {
    // Encuentra los elementos por ID (asegúrate de que los IDs sean únicos)
    const commonNameEl = document.querySelector(`#commonName-${imagenId}`);
    const scientificNameEl = document.querySelector(`#scientificName-${imagenId}`);
    const pathogenEl = document.querySelector(`#pathogen-${imagenId}`);
    const probabilityEl = document.querySelector(`#probability-${imagenId}`);
    const statusEl = document.querySelector(`#status-${imagenId}`);
    const commentEl = document.querySelector(`#comment-${imagenId}`);

    // Crea un objeto con los datos
    const data = {
        id: imagenId,
        commonName: commonNameEl ? commonNameEl.textContent : '',
        scientificName: scientificNameEl ? scientificNameEl.textContent : '',
        pathogen: pathogenEl ? pathogenEl.textContent : '',
        probability: probabilityEl ? probabilityEl.textContent : '',
        status: statusEl ? statusEl.value : '',
        comment: commentEl ? commentEl.value : ''
    };

    // Envía los datos usando fetch
    fetch('https://us-central1-agritecgeo-analytics.cloudfunctions.net/evaluate-response-plantix-upload-comments-1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Asegúrate de que esta línea solo se ejecute si la respuesta es 200 OK
    })
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
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
