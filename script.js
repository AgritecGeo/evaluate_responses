document.addEventListener('DOMContentLoaded', function() {
    cargarImagenesDesdeCSV();
});

function cargarImagenesDesdeCSV() {
    fetch('tabla_evaluacion.csv')
        .then(response => response.text())
        .then(csvText => {
            const imagenes = parseCSV(csvText);
            mostrarImagenes(imagenes);
        })
        .catch(err => console.error('Error al cargar y parsear el CSV:', err));
}

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

function mostrarImagenes(data) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas imágenes

    data.forEach(imagen => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        const imageURL = `https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/Imagenes/imagen_${imagen['ID']}.png`;
        imgDiv.innerHTML = `
            <img src="${imageURL}" alt="Imagen ${imagen['ID']}" class="image">
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
    // Aquí deberías añadir la lógica para enviar estos datos a tu backend o API
}
