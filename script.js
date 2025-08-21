// Ejemplo de datos JSON
// const partidosData = [
//     {
//         "id": 3,
//         "liga": "Copa Sudamericana",
//         "equipo_local": "Lanús",
//         "equipo_visitante": "Central Córdoba",
//         "Rango de cuota local": "1,50 - 1,99",
//         "total_partidos_local": "5",
//         "victorias_local": "4",
//         "empates_local": "1",
//         "fecha": "2025-08-21",
//         "resultado": "sin resultado",
//         "corners": "sin resultado",
//         "faltas": "sin resultado",
//         "rango de cuota visitante": "+3.00",
//         "total_partidos_visitante": "3",
//         "victorias_visitante": "0",
//         "empates_visitante": "3",
//         "NOTA": "Estas probabildades estan basadas en la cuota del equipo de Lanús en sus ultimos 5 partidos"
//     }
// ];

// Función para mostrar los partidos
function mostrarPartidos(data) {
    const container = document.getElementById('partidos-container');
    
    data.forEach(partido => {
        // Crear tarjeta para el partido
        const card = document.createElement('div');
        card.classList.add('partido-card');

        // Equipo Local
        const equipoLocal = document.createElement('div');
        equipoLocal.classList.add('equipo');
        const localTitle = document.createElement('h2');
        localTitle.textContent = partido.equipo_local || 'Equipo Local';
        equipoLocal.appendChild(localTitle);

        // Mostrar estadísticas del equipo local
        for (const [key, value] of Object.entries(partido)) {
            if (key.includes('local') && key !== 'equipo_local') {
                const p = document.createElement('p');
                const formattedKey = key.replace(/_local/g, '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                p.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
                equipoLocal.appendChild(p);
            }
        }

        // Separador VS
        const vs = document.createElement('div');
        vs.classList.add('vs');
        vs.textContent = 'VS';

        // Equipo Visitante
        const equipoVisitante = document.createElement('div');
        equipoVisitante.classList.add('equipo');
        const visitanteTitle = document.createElement('h2');
        visitanteTitle.textContent = partido.equipo_visitante || 'Equipo Visitante';
        equipoVisitante.appendChild(visitanteTitle);

        // Mostrar estadísticas del equipo visitante
        for (const [key, value] of Object.entries(partido)) {
            if (key.includes('visitante') && key !== 'equipo_visitante') {
                const p = document.createElement('p');
                const formattedKey = key.replace(/_visitante/g, '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                p.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
                equipoVisitante.appendChild(p);
            }
        }

        // Datos comunes (liga, fecha, resultado, nota, etc.)
        const datosComunes = document.createElement('div');
        datosComunes.classList.add('datos-comunes');
        for (const [key, value] of Object.entries(partido)) {
            if (!key.includes('local') && !key.includes('visitante') && key !== 'id' && key !== 'equipo_local' && key !== 'equipo_visitante') {
                const p = document.createElement('p');
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                p.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
                datosComunes.appendChild(p);
            }
        }

        // Agregar elementos a la tarjeta
        card.appendChild(equipoLocal);
        card.appendChild(vs);
        card.appendChild(equipoVisitante);
        card.appendChild(datosComunes);

        container.appendChild(card);
    });
}

// Cargar los datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Si usas un archivo JSON externo, descomenta esto:
    
    fetch('partidos.json')
        .then(response => response.json())
        .then(data => mostrarPartidos(data))
        .catch(error => console.error('Error al cargar el JSON:', error));
    
    mostrarPartidos(partidosData); // Usar datos locales para el ejemplo
});