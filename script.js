// Ejemplo de datos JSON (puedes cargarlo desde un archivo externo)
const partidosData = [
    {
        id: 1,
        equipo_local: "Real Madrid",
        equipo_visitante: "Barcelona",
        fecha: "2025-08-20",
        resultado: "2-1",
        posesion_local: "55%",
        posesion_visitante: "45%",
        tiros_a_puerta: 8
    },
    {
        id: 2,
        equipo_local: "Manchester United",
        equipo_visitante: "Liverpool",
        fecha: "2025-08-21",
        resultado: "0-0",
        corners: 5,
        faltas: 12
    }
];

// Función para cargar y mostrar los partidos
function mostrarPartidos(data) {
    const container = document.getElementById('partidos-container');
    
    data.forEach(partido => {
        // Crear una tarjeta para cada partido
        const card = document.createElement('div');
        card.classList.add('partido-card');

        // Título con equipos
        const title = document.createElement('h2');
        title.textContent = `${partido.equipo_local || 'Equipo Local'} vs ${partido.equipo_visitante || 'Equipo Visitante'}`;
        card.appendChild(title);

        // Iterar dinámicamente sobre los campos del JSON
        for (const [key, value] of Object.entries(partido)) {
            if (key !== 'id' && key !== 'equipo_local' && key !== 'equipo_visitante') {
                const p = document.createElement('p');
                // Formatear el nombre del campo (por ejemplo, "tiros_a_puerta" -> "Tiros a Puerta")
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                p.innerHTML = `<strong>${formattedKey}:</strong> ${value}`;
                card.appendChild(p);
            }
        }

        container.appendChild(card);
    });
}

// Cargar los datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Si los datos están en un archivo JSON externo, descomenta esto:
    /*
    fetch('partidos.json')
        .then(response => response.json())
        .then(data => mostrarPartidos(data))
        .catch(error => console.error('Error al cargar el JSON:', error));
    */
    mostrarPartidos(partidosData); // Usar datos locales para el ejemplo
});