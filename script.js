document.addEventListener('DOMContentLoaded', function() {
    cargarImagenesDesdeCSV();
});

// Función para cargar y mostrar imágenes desde datos CSV
function cargarImagenesDesdeCSV() {
    fetch('tabla_evaluacion.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            const imagenes = parseCSV(csvText);
            const agrupadasPorImagen = agruparPorImagen(imagenes);
            mostrarImagenes(agrupadasPorImagen);
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
            obj[nextKey.trim()] = data[index].trim();
            return obj;
        }, {});
    });
}

// Agrupar por ID de imagen para manejar múltiples registros por imagen
function agruparPorImagen(imagenes) {
    return imagenes.reduce((acc, imagen) => {
        const id = imagen.id;
        if (!acc[id]) {
            acc[id] = [];
        }
        acc[id].push(imagen);
        return acc;
    }, {});
}

// Función para mostrar imágenes en la página
function mostrarImagenes(imagenes) {
    const imgContainer = document.getElementById('img-container');
    imgContainer.innerHTML = '';

    Object.keys(imagenes).forEach(id => {
        const registros = imagenes[id];
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img-box');
        const imageURL = `https://filedn.com/lRAMUKU4tN3HUnQqI5npg4H/Plantix/Imagenes/imagen_${id}.png`;
        
        imgDiv.innerHTML = `<img src="${imageURL}" alt="Imagen ${id}" class="image">`;
        
        const table = document.createElement('table');
        registros.forEach(registro => {
            const row = table.insertRow();
            row.innerHTML = `
                <td><strong>Nombre Común:</strong> ${registro.commonName}</td>
                <td><strong>Nombre Científico:</strong> ${registro.scientificName}</td>
                <td><strong>Patógeno:</strong> ${registro.pathogen}</td>
                <td><strong>Probabilidad:</strong> ${registro.probability}</td>
                <td>
                    <select>
                        <option value="true">Verdadero</option>
                        <option value="false">Falso</option>
                        <option value="unknown">No se puede determinar</option>
                    </select>
                </td>
            `;
        });
        imgDiv.appendChild(table);
        
        const textarea = document.createElement('textarea');
        textarea.placeholder = "Añade un comentario...";
        imgDiv.appendChild(textarea);
        
        const saveButton = document.createElement('button');
        saveButton.textContent = "Guardar";
        saveButton.onclick = function() { guardarComentario(id); };
        imgDiv.appendChild(saveButton);
        
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
    // Aquí se debería añadir la lógica para enviar estos datos a tu backend o API
}
