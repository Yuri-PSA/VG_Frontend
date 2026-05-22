document.addEventListener("DOMContentLoaded", function () {
    menuUser();
    phoneMenu();
    initMobileScroll();
    optionsBar();
    cancelButton();
    tabSelected();
    initTableResize();
});


/* ============================== VARIABLES ============================== */
const token = Session.getToken();
const logoUser = Session.getUser();


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector('.loader-overlay').style.display = 'flex';
}

function hideLoader() {
    document.querySelector('.loader-overlay').style.display = 'none';
}


/* ============================== MENU NAME ============================== */
function menuUser() {
    const user = document.querySelector('.option-bar .name p');
    user.innerHTML = '';
    user.innerHTML = logoUser;
}


/* ============================== PHONE MENU ============================== */
function phoneMenu() {
    const container = document.querySelector('.mobile-nav');
    const hamburger = document.getElementById('hamburger');
    const optionBar = document.getElementById('optionBar');
    const checkBox = hamburger.querySelector('input');

    if (!container || !hamburger || !optionBar || !checkBox) return;

    checkBox.addEventListener('change', function (e) {
        e.stopPropagation();

        container.classList.toggle('bar', checkBox.checked);
        hamburger.classList.toggle('active', checkBox.checked);
        optionBar.classList.toggle('active', checkBox.checked);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !optionBar.contains(e.target)) {
            checkBox.checked = false;
            container.classList.remove('bar');
            hamburger.classList.remove('active');
            optionBar.classList.remove('active');
        }
    });

    // Cerrar al hacer click en un enlace del menú
    const menuLinks = optionBar.querySelectorAll('.option');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            checkBox.checked = false;
            container.classList.remove('bar');
            hamburger.classList.remove('active');
            optionBar.classList.remove('active');
        });
    });

    // Touch events
    hamburger.addEventListener('touchstart', function (e) {
        e.stopImmediatePropagation();
    }, { passive: true });
}

function initMobileScroll() {
    const nav = document.querySelector('.mobile-nav');
    const scrollContainer = document.querySelector('.content-container');

    if (!nav || !scrollContainer) return;

    function handleMobileScroll() {
        const scrollTop = scrollContainer.scrollTop;
        if (scrollTop > 30)
            nav.classList.add('scrolled');
        else
            nav.classList.remove('scrolled');
    }

    scrollContainer.addEventListener('scroll', handleMobileScroll, { passive: true });
    handleMobileScroll();
}


/* ============================== OPTIONS BAR ============================== */
async function logoutReset() {
    try {
        await fetch('http://127.0.0.1:3000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        Session.clearAll();
        window.location.href = 'index.html';
    }
}

function optionsBar() {
    const dashboard = document.querySelector('.option.dashboard');
    const request = document.querySelector('.option.requests');
    const expenses = document.querySelector('.option.expenses');
    const liquidations = document.querySelector('.option.liquidation');
    const logout = document.querySelector('.option.log-out');

    function setActiveOption() {
        const allOptions = document.querySelectorAll('.option:not(.log-out)');
        const currentPath = window.location.pathname;

        allOptions.forEach(option => {
            option.classList.remove('active');
        });

        if (currentPath.includes('colab-dashboard.html'))
            dashboard.classList.add('active');
        else if (currentPath.includes('colab-solicitudes.html') || currentPath.includes('crear-solicitud.html') || currentPath.includes('editar-solicitud.html'))
            request.classList.add('active');
        else if (currentPath.includes('colab-comprobaciones.html') || currentPath.includes('crear-comprobacion.html') || currentPath.includes('editar-comprobacion.html'))
            expenses.classList.add('active');
        else if (currentPath.includes('colab-liquidaciones.html'))
            liquidations.classList.add('active');
    }

    setActiveOption();

    dashboard.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'colab-dashboard.html';
    });

    request.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'colab-solicitudes.html';
    });

    expenses.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'colab-comprobaciones.html';
    });

    liquidations.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'colab-liquidaciones.html';
    });

    logout.addEventListener('click', async (e) => {
        e.stopPropagation();
        logoutReset();
    });
}


/* =============================== FORM BUTTONS =============================== */
// Cancel
function cancelButton() {
    const cancelButton = document.querySelector('.button.cancel');

    cancelButton.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'colab-comprobaciones.html';
    });
}


/* ============================== FACTURA TABS ============================== */
function tabSelected() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}


/* =========================== RESIZE TABLE COLUMNS =========================== */
function initTableResize() {
    const table = document.querySelector('.table-container table');
    const headers = table.querySelectorAll('.table-head th');

    headers.forEach(th => {
        const handle = document.createElement('div');
        handle.classList.add('resize-handle');
        th.appendChild(handle);

        let startX, startWidth;

        handle.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startWidth = th.offsetWidth;
            handle.classList.add('resizing');

            const onMouseMove = (e) => {
                const newWidth = Math.max(60, startWidth + (e.clientX - startX));
                th.style.width = newWidth + 'px';
                th.style.minWidth = newWidth + 'px';
            };

            const onMouseUp = () => {
                handle.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });
    });
}