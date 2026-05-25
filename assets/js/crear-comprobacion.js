document.addEventListener("DOMContentLoaded", function () {
    menuUser();
    phoneMenu();
    initMobileScroll();
    optionsBar();
    cancelButton();
    tabSelected();
    requestDropdown();
    initTableResize();
    initUpload();
});


/* ============================== VARIABLES ============================== */
// Facturas
let selectedPDF = null;
let selectedXML = null;
let selectedIMG = null;

let isUploading = false;
let uploadComplete = false;
let uploadedFilePath = null;

// Backend
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
// Reset
function resetFacturado() {
    const pdfContainer = document.querySelector('#facturado-container .first-column .receipt-container');
    const xmlContainer = document.querySelector('#facturado-container .second-column .receipt-container');

    selectedPDF = null;
    selectedXML = null;

    if(pdfContainer) {
        pdfContainer.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Selecciona o arrastra tu factura PDF</p>
        `;

        pdfContainer.style.backgroundImage = '';
        pdfContainer.classList.remove('has-image');
        pdfContainer.dataset.file = '';
    }

    if(xmlContainer) {
        xmlContainer.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Selecciona o arrastra tu factura XML</p>
        `;

        xmlContainer.style.backgroundImage = '';
        xmlContainer.classList.remove('has-image');
        xmlContainer.dataset.file = '';
    }
}

function resetNoFacturado() {
    const imgContainer = document.querySelector('#no-facturado-container .receipt-container');

    selectedIMG = null;

    if(imgContainer) {
        imgContainer.innerHTML = `
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Selecciona o arrastra tu comprobante (JPG o PNG)</p>
        `;

        imgContainer.style.backgroundImage = '';
        imgContainer.classList.remove('has-image');
        imgContainer.dataset.file = '';
    }
}

function tabSelected() {
    const tabs = document.querySelectorAll('.tab');
    const facturadoContainer = document.getElementById('facturado-container');
    const noFacturadoContainer = document.getElementById('no-facturado-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');

            const isFacturado = this.classList.contains('factura');

            if (isFacturado) {
                facturadoContainer.style.display = 'flex';
                noFacturadoContainer.style.display = 'none';
                resetFacturado();
            } else {
                facturadoContainer.style.display = 'none';
                noFacturadoContainer.style.display = 'grid';
                resetNoFacturado();
            }
        });
    });
}


/* ============================= REQUEST DROPDOWN ============================= */
function requestDropdown() {
    const requests = document.querySelector('.request-selector');
    const dropdown = document.querySelector('.request-dropdown');

    requests.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if(!requests.contains(e.target))
            dropdown.classList.remove('show');
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


/* ============================= UPLOAD FACTURAS ============================= */
function initUpload() {
    const pdfContainer = document.querySelector('#facturado-container .first-column .receipt-container');
    const xmlContainer = document.querySelector('#facturado-container .second-column .receipt-container');
    const imgContainer = document.querySelector('#no-facturado-container .receipt-container');
    const uploadButton = document.querySelector('.button-receipt');

    let pdfInput = document.getElementById('pdf-input');
    let xmlInput = document.getElementById('xml-input');
    let imgInput = document.getElementById('img-input');

    if(!pdfInput) {
        pdfInput = document.createElement('input');
        pdfInput.id = 'pdf-input';
        pdfInput.type = 'file';
        pdfInput.accept = '.pdf';
        pdfInput.style.display = 'none';
        document.body.appendChild(pdfInput);
    }

    if(!xmlInput) {
        xmlInput = document.createElement('input');
        xmlInput.id = 'xml-input';
        xmlInput.type = 'file';
        xmlInput.accept = '.xml';
        xmlInput.style.display = 'none';
        document.body.appendChild(xmlInput);
    }

    if(!imgInput) {
        imgInput = document.createElement('input');
        imgInput.id = 'img-input';
        imgInput.type = 'file';
        imgInput.accept = '.jpg, .jpeg, .png';
        imgInput.style.display = 'none';
        document.body.appendChild(imgInput);
    }

    // Previsualizar
    function previewImage(container, file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            container.innerHTML = '';
            container.style.backgroundImage = `url(${e.target.result})`;
            container.style.backgroundSize = 'cover';
            container.style.backgroundPosition = 'center';
            container.classList.add('has-image');
        };

        reader.readAsDataURL(file);
    }

    function previewFileInfo(container, file, iconClass) {
        container.innerHTML = `
            <i class="${iconClass}"></i>
            <p>${file.name}</p>
        `;

        container.style.backgroundImage = '';
        container.classList.add('has-image');
    }

    // Reset
    function resetContainer(container, type) {
        if(type === 'pdf') 
            container.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Selecciona o arrastra tu factura PDF</p>
            `;
        else if(type === 'xml') 
            container.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Selecciona o arrastra tu factura XML</p>
            `;
        else if(type === 'img') 
            container.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <p>Selecciona o arrastra tu comprobante (JPG o PNG)</p>
            `;

        container.style.backgroundImage = '';
        container.classList.remove('has-image');
    }

    // Loader
    function showLoaderFact(container) {
        container.innerHTML = `
            <div class="loader-receipt"></div>
            <p>Subiendo comprobante...</p>
        `;
    }

    // Validaciones
    function validatePDF(file) {
        if(file.type !== 'application/pdf') {
            Toast('FORMATO DE ARCHIVO INVÁLIDO', 'Solo se permiten archivos en formato PDF');
            return false;
        }
        return true;
    }

    function validateXML(file) {
        if(!file.name.endsWith('.xml')) {
            Toast('FORMATO DE ARCHIVO INVÁLIDO', 'Solo se permiten archivos en formato XML');
            return false;
        }
        return true;
    }

    function validateIMG(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if(!validTypes.includes(file.type)) {
            Toast('FORMATO DE ARCHIVO INVÁLIDO', 'Solo se permiten archivos en formato JPG o PNG');
            return false;
        }
        return true;
    }

    // Manejadores de selección
    function onPDFSelect(file) {
        if(!validatePDF(file)) return false;
        selectedPDF = file;
        previewFileInfo(pdfContainer, file, 'fa-solid fa-file-pdf');
        return true;
    }

    function onXMLSelect(file) {
        if(!validateXML(file)) return false;
        selectedXML = file;
        previewFileInfo(xmlContainer, file, 'fa-solid fa-file-code');
        return true;
    }

    function onIMGSelect(file) {
        if(!validateIMG(file)) return false;
        selectedIMG = file;
        previewImage(imgContainer, file);
        return true;
    }

    // Eventos de arrastre y clic
    function setupContainer(container, inputElement, onSelect) {
        if(!container) return;

        container.addEventListener('click', (e) => {
            e.stopPropagation();
            inputElement.click();
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('dragover');
        });
        container.addEventListener('dragleave', () => {
            container.classList.remove('dragover');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) onSelect(file);
        });

        inputElement.addEventListener('change', (e) => {
            if(e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if(onSelect(file))
                    inputElement.value = '';
            }
        });
    }

    setupContainer(pdfContainer, pdfInput, onPDFSelect);
    setupContainer(xmlContainer, xmlInput, onXMLSelect);
    setupContainer(imgContainer, imgInput, onIMGSelect);

    // Upload button
    if(uploadButton) {
        const newButton = uploadButton.cloneNode(true);
        uploadButton.parentNode.replaceChild(newButton, uploadButton);

        newButton.addEventListener('click', async() => {
            const isFacturado = document.querySelector('.tab.factura.selected') !== null;

            if(isFacturado) {
                if(!selectedPDF && !selectedXML) {
                    Toast('FALTA DE ARCHIVOS', 'Por favor, selecciona ambos archivos: PDF y XML');
                    return;
                }
                if(!selectedPDF) {
                    Toast('ARCHIVO FALTANTE', 'Por favor, selecciona la factura en formato PDF para su registro');
                    return;
                }
                if(!selectedXML) {
                    Toast('ARCHIVO FALTANTE', 'Por favor, selecciona la factura en formato XML para su registro');
                    return;
                }
            } else {
                if(!selectedIMG) {
                    Toast('COMPROBANTE FALTANTE', 'Por favor, selecciona la imagen del ticket o recibo para su registro');
                    return;
                }
            }
        });
    }
}


/* ================================== TOAST ================================== */
// Toast -> Simple
const ToastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    width: '600px',
    customClass: { popup: 'colored-toast' },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

function Toast(title, content, imageUrl = './assets/images/Icon_agave.webp') {
    ToastMixin.fire({
        icon: undefined,
        html: `
            <div style="display: flex; align-items: center; gap: 20px;">
                <img src="${imageUrl}" alt="Agave" class="agave-icon">
                <div class="text">
                    <p>${title}</p>
                    <span>${content}</span>
                </div>
            </div>
        `
    });
}