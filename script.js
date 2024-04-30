document.addEventListener('DOMContentLoaded', function() {
    cargarImagenesDesdeCSV();
});

// Función para cargar y mostrar imágenes desde datos CSV
function cargarImagenesDesdeCSV() {
    fetch('https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/tabla_evaluacion.csv')
        .then(response => response.text())
        .then(csvText => {
            const imagenes = parseCSV(csvText);
            window.imagenes = imagenes; // Hacer global para uso en filtrarImagenes
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

// Función para mostrar imágenes en la página
function mostrarImagenes(data) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas imágenes

    data.forEach(imagen => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        imgDiv.innerHTML = `
            <img src="https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/Imagenes/${imagen['ID']}.png" alt="${imagen['diagnostico']}" class="image">
            <div>ID: ${imagen['ID']}</div>
            <div>Diagnóstico: ${imagen['diagnostico']}</div>
            <div>Valor: ${imagen['valor']}</div>
            <select>
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
                <option value="unknown">No se puede determinar</option>
            </select>
            <textarea placeholder="Añade un comentario..."></textarea>
            <button onclick="guardarComentario('${imagen['ID']}')">Guardar</button>
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

