document.addEventListener("DOMContentLoaded", function() {
    optionsBar();
    initCalendar();
    currencyOptions();
    paymentOptions();
});


/* ============================== OPTIONS BAR ============================== */
function optionsBar() {
    const dashboard = document.querySelector('.option.dasboard');
    const request = document.querySelector('.option.requests');
    const expenses = document.querySelector('.option.expenses');
    const history = document.querySelector('.option.history');

    request.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'solicitudes.html';
    });
}


/* =============================== FORM BUTTONS =============================== */
function cancelButton() {

}

function sendButton() {
    const destination = document.getElementById('ans-destination').value;
}


/* ============================== CURRENCY OPTIONS ============================== */
function currencyOptions() {
    const currencies = [
        { code: 'MXN', name: 'MXN', flag: './assets/images/MXN.webp', symbol: '$' },
        { code: 'USD', name: 'USD', flag: './assets/images/USD.webp', symbol: '$' },
        { code: 'EUR', name: 'EUR', flag: './assets/images/EUR.webp', symbol: '€' },
        { code: 'JPY', name: 'JPY', flag: './assets/images/JPY.webp', symbol: '¥' }
    ];

    const selector = document.querySelector('.currency-selector');
    const flagsDiv = selector.querySelector('.flags');
    const dropdown = selector.querySelector('.currency-dropdown');
    const symbol = document.querySelector('.answer.money .symbol');
    
    // Construir lista
    function buildDropdown(currentCurrency) {
        dropdown.innerHTML = '';
        const otherCurrencies = currencies.filter(c => c.code !== currentCurrency);
        otherCurrencies.forEach(currency => {
            const option = document.createElement('div');
            option.className = 'currency-option';
            option.setAttribute('data-currency', currency.code);
            option.innerHTML = `
                <img src="${currency.flag}" alt="${currency.code}">
                <span>${currency.name}</span>
            `;
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectedCurrency(currency);
                dropdown.classList.remove('show');
                closeOtherDropdowns(selector);
            });
            dropdown.appendChild(option);
        });
    }

    function updateSelectedCurrency(currency) {
        flagsDiv.innerHTML = `
            <img src="${currency.flag}" alt="${currency.code}">
            <p>${currency.name}</p>
            <i class="fa-solid fa-angle-down"></i>
        `;
        symbol.innerHTML = `${currency.symbol}`;

        buildDropdown(currency.code);
    }

    flagsDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');

        closeOtherDropdowns(selector);
        if(!isOpen)
            dropdown.classList.add('show');
        else
            dropdown.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        if(!selector.contains(e.target))
            dropdown.classList.remove('show');
    });

    const defaultCurrency = currencies.find(c => c.code === 'MXN');
    updateSelectedCurrency(defaultCurrency);
}


/* ============================== PAYMENT OPTIONS ============================== */
function paymentOptions() {
    const payments = [
        { name: 'Transferencia' },
        { name: 'Efectivo' }
    ];

    const selector = document.querySelector('.payment-selector');
    const pTag = selector.querySelector('p');
    const dropdown = selector.querySelector('.payment-dropdown');

    function buildDropdown(currentName) {
        dropdown.innerHTML = '';
        const others = payments.filter(p => p.name !== currentName);
        others.forEach(payment => {
            const option = document.createElement('div');
            option.className = 'payment-option';
            option.textContent = payment.name;
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelectedPayment(payment);
                dropdown.classList.remove('show');
                closeOtherDropdowns(selector);
            });
            dropdown.appendChild(option);
        });
    }

    function updateSelectedPayment(payment) {
        pTag.textContent = payment.name;
        buildDropdown(payment.name);
    }

    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');

        closeOtherDropdowns(selector);
        if(!isOpen)
            dropdown.classList.add('show');
        else
            dropdown.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        if(!selector.contains(e.target))
            dropdown.classList.remove('show');
    });

    const defaultPayment = payments.find(n => n.name === 'Transferencia');
    updateSelectedPayment(defaultPayment);
}


/* =========================== DROPDOWN FUNCTIONS =========================== */
function closeOtherDropdowns(currentSelector) {
    const allSelectors = ['.currency-selector', '.payment-selector'];
    allSelectors.forEach(sel => {
        const other = document.querySelector(sel);
        if (other && other !== currentSelector) {
            const dropdown = other.querySelector('.currency-dropdown, .payment-dropdown');
            if (dropdown && dropdown.classList.contains('show'))
                dropdown.classList.remove('show');
        }
    });
}


/* =============================== DATE PICKER =============================== */
function initCalendar() {
    const monthLabel = document.querySelector('.date-header .month');
    const yearLabel = document.querySelector('.date-header .year');
    const datesContainer = document.querySelector('.dates');
    const daysHeader = document.querySelector('.days-header');
    const prevBtn = document.querySelector('.prev-month');
    const nextBtn = document.querySelector('.next-month');
    const monthSelector = document.querySelector('.month-selector');
    const yearSelector = document.querySelector('.year-selector');

    let currentDate = new Date();
    let startDate = null;
    let endDate = null;
    let viewMode = 'days';

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
                        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Funciones auxiliares
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayIndex(year, month) {
        return new Date(year, month, 1).getDay();
    }

    function isSameDate(date1, date2) {
        return date1 && date2 && date1.year === date2.year && date1.month === date2.month && date1.day === date2.day;
    }

    function toTimestamp(date) {
        if (!date) return null;
        return new Date(date.year, date.month, date.day).getTime();
    }

    function isInRange(date) {
        if (!startDate || !endDate) return false;
        const dateTs = toTimestamp(date);
        const startTs = toTimestamp(startDate);
        const endTs = toTimestamp(endDate);
        return dateTs >= startTs && dateTs <= endTs;
    }

    // Renderiza el calendario de días
    function renderDays() {
        monthLabel.style.display = 'flex';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthLabel.textContent = monthNames[month];
        yearLabel.textContent = year;

        const firstDay = getFirstDayIndex(year, month);
        const daysInMonth = getDaysInMonth(year, month);

        // Días del mes anterior
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
        const prevMonthDays = firstDay;

        const totalCells = 42;  // 6 filas x 7 días
        const nextMonthDays = totalCells - (prevMonthDays + daysInMonth);
        
        datesContainer.innerHTML = '';
        daysHeader.style.display = 'grid';
        datesContainer.classList.remove('months-grid', 'years-grid');

        // 1. Mes anterior
        for(let i = prevMonthDays - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const cell = createDateCell(day, prevMonthYear, prevMonth, true);
            datesContainer.appendChild(cell);
        }

        // 2. Mes actual
        for(let day = 1; day <= daysInMonth; day++) {
            const cell = createDateCell(day, year, month, false);
            datesContainer.appendChild(cell);
        }

        // 3. Mes siguiente
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextMonthYear = month === 11 ? year + 1 : year;
        for(let day = 1; day <= nextMonthDays; day++) {
            const cell = createDateCell(day, nextMonthYear, nextMonth, true);
            datesContainer.appendChild(cell);
        }
    }

    // Vista de días
    function createDateCell(day, year, month, isOtherMonth) {
        const cell = document.createElement('div');
        cell.classList.add('date-cell');
        cell.textContent = day;
        if(isOtherMonth) cell.classList.add('other-month');

        const dateObj = { year, month, day };

        // Asignar clases de rango
        if (startDate && isSameDate(dateObj, startDate)) cell.classList.add('start');
        if (endDate && isSameDate(dateObj, endDate)) cell.classList.add('end');
        if (isInRange(dateObj)) cell.classList.add('in-range');

        cell.addEventListener('click', (e) => {
            e.stopPropagation();

            // Si no hay inicio o ya hay un rango completo, reinicia con esta fecha como nuevo inicio
            if (startDate === null || (startDate && endDate !== null)) {
                startDate = { year, month, day };
                endDate = null;
                console.log(`Rango reiniciado. Inicio: ${day}/${month+1}/${year}`);
            }
            // Si hay inicio pero no fin, se establece el fin (ordenando las fechas)
            else if (startDate && endDate === null) {
                const currentTs = toTimestamp({ year, month, day });
                const startTs = toTimestamp(startDate);
                if (currentTs < startTs) {
                    endDate = { ...startDate };
                    startDate = { year, month, day };
                } else
                    endDate = { year, month, day };
                
                console.log(`Rango seleccionado: ${startDate.day}/${startDate.month+1}/${startDate.year} - ${endDate.day}/${endDate.month+1}/${endDate.year}`);
            }

            renderCalendar();
        });
        return cell;
    }

    // Vista de meses
    function renderMonths() {
        const year = currentDate.getFullYear();
        monthLabel.textContent = monthNames[currentDate.getMonth];
        yearLabel.textContent = year;

        daysHeader.style.display = 'none';
        datesContainer.innerHTML = '';
        datesContainer.classList.remove('years-grid');
        datesContainer.classList.add('months-grid');
        monthLabel.style.display = 'none';

        for (let i = 0; i < 12; i++) {
            const monthDiv = document.createElement('div');
            monthDiv.classList.add('month-item');
            monthDiv.textContent = monthNames[i];
            monthDiv.addEventListener('click', (e) => {
                e.stopPropagation();

                // Cambiar al mes seleccionado
                currentDate.setMonth(i);
                viewMode = 'days';
                renderCalendar();
            });

            datesContainer.appendChild(monthDiv);
        }
    }

    // Vista de años
    function renderYears() {
        const year = currentDate.getFullYear();
        const decadeStart = Math.floor(year / 10) * 10;
        yearLabel.textContent = `${decadeStart} - ${decadeStart + 9}`;
        monthLabel.style.display = 'none';

        daysHeader.style.display = 'none';
        datesContainer.innerHTML = '';
        datesContainer.classList.remove('months-grid');
        datesContainer.classList.add('years-grid');

        // Generar años
        const startYear = decadeStart - 1;
        for (let i = 0; i < 12; i++) {
            const y = startYear + i;
            const yearDiv = document.createElement('div');
            yearDiv.classList.add('year-item');
            yearDiv.textContent = y;
            yearDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                currentDate.setFullYear(y);
                viewMode = 'days';
                renderCalendar();
            });
            datesContainer.appendChild(yearDiv);
        }
    }

    // Render principal
    function renderCalendar() {
        if(viewMode === 'months')
            renderMonths();
        else if (viewMode === 'years')
            renderYears();
        else
            renderDays();
    }

    // Navegación con flechas
    function navigate(delta) {
        if (viewMode === 'months') {
            currentDate.setFullYear(currentDate.getFullYear() + delta);
            renderMonths();
        } else if (viewMode === 'years') {
            currentDate.setFullYear(currentDate.getFullYear() + delta * 10);
            renderYears();
        } else {
            currentDate.setMonth(currentDate.getMonth() + delta);
            renderDays();
        }
        hideSelectors();
    }

    function hideSelectors() {
        if (monthSelector) monthSelector.style.display = 'none';
        if (yearSelector) yearSelector.style.display = 'none';
    }

    // Eventos
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    monthLabel.addEventListener('click', (e) => {
        e.stopPropagation();

        if (viewMode === 'days') {
            viewMode = 'months';
            renderCalendar();
        } else if (viewMode === 'months') {
            viewMode = 'days';
            renderCalendar();
        } else if (viewMode === 'years') {
            viewMode = 'months';
            renderCalendar();
        }
        hideSelectors();
    });

    yearLabel.addEventListener('click', (e) => {
        e.stopPropagation();
        viewMode = 'years';
        renderCalendar();
        hideSelectors();
    });

    document.addEventListener('click', (e) => {
        if (monthSelector && yearSelector)
            if (!monthSelector.contains(e.target) && !yearSelector.contains(e.target) &&
                e.target !== monthLabel && e.target !== yearLabel)
                    hideSelectors();
    });

    renderCalendar();
}