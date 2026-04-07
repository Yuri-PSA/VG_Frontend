document.addEventListener('DOMContentLoaded', function() {
    statusChart();
});


/* ============================== OPTIONS BAR ============================== */


/* ============================== GRAPHS ============================== */
const shadowPlugin = {
    id: 'shadowPlugin',
    beforeDatasetsDraw(chart, args, options) {
        const { ctx } = chart;
        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    },
    afterDatasetsDraw(chart, args, options) {
        const { ctx } = chart;
        ctx.restore();
    }
};


function statusChart() {
    const ctx = document.getElementById('status-chart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
            datasets: [{
                data: [18, 23, 5],
                backgroundColor: [
                    '#C9C867',      // amarillo para pendientes
                    '#97BD13',      // verde para aprobadas
                    '#D65B5B'       // rojo para rechazadas
                ],
                borderWidth: 0,
                hoverOffset: 5,     // hover de separación
                spacing: 0          // espacio entre segmentos
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [shadowPlugin]
    });
}