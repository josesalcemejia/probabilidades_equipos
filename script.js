

// Función para formatear la fecha actual como YYYY-MM-DD
function getFechaActual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11, +1 y formato de 2 dígitos
    const dia = String(hoy.getDate()).padStart(2, '0'); // Formato de 2 dígitos
    return `${año}-${mes}-${dia}`;
}

// Función para calcular la cuota promedio desde un rango o valor
function calcularCuotaPromedio(cuota) {
    try {
        if (cuota.includes('-')) {
            const [min, max] = cuota.split('-').map(val => parseFloat(val.trim()));
            if (isNaN(min) || isNaN(max)) throw new Error('Cuota inválida');
            console.log(`Cuota promedio para ${cuota}: ${(min + max) / 2}`);
            return (min + max) / 2;
        }
        const cuotaNum = parseFloat(cuota.replace('+', '').trim());
        if (isNaN(cuotaNum)) throw new Error('Cuota inválida');
        console.log(`Cuota para ${cuota}: ${cuotaNum}`);
        return cuotaNum;
    } catch (error) {
        console.error('Error al calcular cuota promedio:', error);
        return 1; // Valor por defecto para evitar división por cero
    }
}

// Función para calcular probabilidades combinando victorias y cuotas
function calcularProbabilidades(partido) {
    try {
        // Probabilidad basada en victorias
        const tasaLocalVictorias = partido.total_partidos_local > 0 ? parseInt(partido.victorias_local) / parseInt(partido.total_partidos_local) : 0;
        const tasaVisitanteVictorias = partido.total_partidos_visitante > 0 ? parseInt(partido.victorias_visitante) / parseInt(partido.total_partidos_visitante) : 0;
        console.log(`Tasa de victorias - Local: ${tasaLocalVictorias}, Visitante: ${tasaVisitanteVictorias}`);

        // Probabilidad basada en cuotas
        const cuotaLocalNum = calcularCuotaPromedio(partido['Rango de cuota local']);
        const cuotaVisitanteNum = calcularCuotaPromedio(partido['rango de cuota visitante']);
        const probLocalCuotas = (1 / cuotaLocalNum) / ((1 / cuotaLocalNum) + (1 / cuotaVisitanteNum)) * 100;
        const probVisitanteCuotas = (1 / cuotaVisitanteNum) / ((1 / cuotaLocalNum) + (1 / cuotaVisitanteNum)) * 100;
        console.log(`Probabilidad por cuotas - Local: ${probLocalCuotas.toFixed(1)}%, Visitante: ${probVisitanteCuotas.toFixed(1)}%`);

        // Combinar: promedio ponderado (50% victorias, 50% cuotas)
        const probLocal = (0.5 * tasaLocalVictorias * 100) + (0.5 * probLocalCuotas);
        const probVisitante = (0.5 * tasaVisitanteVictorias * 100) + (0.5 * probVisitanteCuotas);
        console.log(`Probabilidad combinada sin normalizar - Local: ${probLocal.toFixed(1)}%, Visitante: ${probVisitante.toFixed(1)}%`);

        // Normalizar para que sumen 100%
        const sumaProbs = probLocal + probVisitante;
        if (sumaProbs === 0) {
            console.log('Suma de probabilidades es 0, usando 50%/50%');
            return { probLocal: 50.0, probVisitante: 50.0 };
        }
        const probLocalNorm = (probLocal / sumaProbs * 100).toFixed(1);
        const probVisitanteNorm = (probVisitante / sumaProbs * 100).toFixed(1);
        console.log(`Probabilidad final normalizada - Local: ${probLocalNorm}%, Visitante: ${probVisitanteNorm}%`);
        return { probLocal: probLocalNorm, probVisitante: probVisitanteNorm };
    } catch (error) {
        console.error('Error al calcular probabilidades:', error);
        return { probLocal: 50.0, probVisitante: 50.0 }; // Valor por defecto
    }
}

// Función para mostrar los partidos
function mostrarPartidos(data, fechaFiltro = null) {
    const container = document.getElementById('partidos-container');
    container.innerHTML = ''; // Limpiar contenedor para evitar duplicados

    // Filtrar partidos por fecha si se proporciona un filtro
    const partidosFiltrados = fechaFiltro
        ? data.filter(partido => partido.fecha === fechaFiltro)
        : data;

    if (partidosFiltrados.length === 0) {
        const noPartidos = document.createElement('p');
        noPartidos.textContent = 'No hay partidos para la fecha seleccionada.';
        noPartidos.style.color = '#e74c3c';
        container.appendChild(noPartidos);
        return;
    }

    partidosFiltrados.forEach(partido => {
        // Crear tarjeta para el partido
        const card = document.createElement('div');
        card.classList.add('partido-card');

        // Equipo Local
        const equipoLocal = document.createElement('div');
        equipoLocal.classList.add('equipo');
        const localTitle = document.createElement('h2');
        localTitle.textContent = partido.equipo_local || 'Equipo Local';
        equipoLocal.appendChild(localTitle);

        // Mostrar estadísticas del equipo local (incluyendo rango de cuota)
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

        // Mostrar estadísticas del equipo visitante (incluyendo rango de cuota)
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

        // Calcular y mostrar probabilidades
        if (partido['Rango de cuota local'] && partido['rango de cuota visitante'] && 
            partido.victorias_local && partido.total_partidos_local && 
            partido.victorias_visitante && partido.total_partidos_visitante) {
            const { probLocal, probVisitante } = calcularProbabilidades(partido);

            // Añadir barra de probabilidad
            const barraContainer = document.createElement('div');
            barraContainer.classList.add('probabilidad-barra');
            const barraLocal = document.createElement('div');
            barraLocal.classList.add('barra-local');
            barraLocal.style.width = `${probLocal}%`;
            const barraVisitante = document.createElement('div');
            barraVisitante.classList.add('barra-visitante');
            barraVisitante.style.width = `${probVisitante}%`;
            barraContainer.appendChild(barraLocal);
            barraContainer.appendChild(barraVisitante);
            datosComunes.appendChild(barraContainer);

            // Añadir nota de probabilidad
            const notaProb = document.createElement('p');
            notaProb.innerHTML = `<strong>Probabilidad de Victoria:</strong> ${partido.equipo_local} ${probLocal}% vs ${partido.equipo_visitante} ${probVisitante}%`;
            datosComunes.appendChild(notaProb);
        } else {
            const errorMsg = document.createElement('p');
            errorMsg.innerHTML = `<strong>Error:</strong> Faltan datos para calcular la probabilidad`;
            datosComunes.appendChild(errorMsg);
        }

        // Mostrar otros datos comunes
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

// Función para filtrar partidos por fecha
let todosLosPartidos = []; // Almacenar todos los partidos cargados
function filtrarPorFecha() {
    const fechaSeleccionada = document.getElementById('fecha-picker').value;
    console.log('Fecha seleccionada:', fechaSeleccionada);
    mostrarPartidos(todosLosPartidos, fechaSeleccionada);
}

// Cargar los datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Flatpickr con la fecha actual
    const fechaActual = getFechaActual();
    flatpickr('#fecha-picker', {
        dateFormat: 'Y-m-d',
        defaultDate: fechaActual, // Usar la fecha actual
        locale: {
            firstDayOfWeek: 1 // Lunes como primer día de la semana
        }
    });

    fetch('partidos.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar partidos.json');
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados desde partidos.json:', data);
            todosLosPartidos = data; // Guardar todos los partidos
            mostrarPartidos(todosLosPartidos, fechaActual); // Filtrar por la fecha actual al inicio
        })
        .catch(error => {
            console.error('Error al cargar el JSON:', error);
            console.log('Usando datos embebidos como respaldo');
            todosLosPartidos = partidosData;
            mostrarPartidos(todosLosPartidos, fechaActual); // Filtrar por la fecha actual al inicio
        });
});