/**
 * @fileoverview Archivo principal de lógica para el formulario de Registro Plataforma GPS.
 * Maneja la validación, la interacción de modales de seguridad y términos, y el envío de datos.
 * @version 1.2.0
 */

// Inicializa los íconos de la librería Lucide
lucide.createIcons();

/** @type {HTMLFormElement} Elemento del formulario de registro */
const form = document.getElementById('reg-form');
/** @type {HTMLElement} Contenedor para mostrar mensajes de error */
const errorEl = document.getElementById('error-msg');
/** @type {HTMLElement} Contenedor para mostrar mensajes de éxito */
const successEl = document.getElementById('success-msg');
/** @type {HTMLButtonElement} Botón de envío del formulario */
const submitBtn = document.getElementById('submit-btn');
/** @type {HTMLElement} Indicador visual de carga durante el envío */
const loadingEl = document.getElementById('loading-indicator');

/** @type {HTMLInputElement} Campo de entrada para la contraseña */
const passInput = document.getElementById('password');
/** @type {HTMLInputElement} Campo de entrada para confirmar la contraseña */
const confirmInput = document.getElementById('confirm-password');
/** @type {HTMLInputElement} Casilla de verificación de consentimiento de términos */
const consentCheckbox = document.getElementById('consent');

// ==========================================
// RESTRICCIONES DE ENTRADA (SANITIZACIÓN EN TIEMPO REAL)
// ==========================================

/** Limpia el campo para aceptar únicamente letras y espacios */
const permitirSoloLetras = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

/** Limpia el campo para aceptar únicamente números */
const permitirSoloNumeros = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

// Aplicar sanitización a campos de texto
document.getElementById('nombre').addEventListener('input', permitirSoloLetras);
document.getElementById('apellido').addEventListener('input', permitirSoloLetras);
document.getElementById('color-vehiculo').addEventListener('input', permitirSoloLetras);

// Aplicar sanitización a campos numéricos
document.getElementById('celular').addEventListener('input', permitirSoloNumeros);
document.getElementById('modelo-vehiculo').addEventListener('input', permitirSoloNumeros);
document.getElementById('imei').addEventListener('input', permitirSoloNumeros);


// ==========================================
// MODALES Y ELEMENTOS DE INTERFAZ
// ==========================================

const passModal = document.getElementById('pass-modal');
const btnEntendido = document.getElementById('btn-entendido');
const termsModal = document.getElementById('terms-modal');
const linkTerminos = document.getElementById('link-terminos');
const btnEntendidoTerms = document.getElementById('btn-entendido-terms');

let alertaMostrada = false;

passInput.addEventListener('focus', () => {
    if (!alertaMostrada) {
        passModal.classList.remove('hidden');
        alertaMostrada = true;
    }
});

btnEntendido.addEventListener('click', () => {
    passModal.classList.add('hidden');
    passInput.focus();
});

linkTerminos.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.classList.remove('hidden');
});

btnEntendidoTerms.addEventListener('click', () => {
    termsModal.classList.add('hidden');
    consentCheckbox.disabled = false;
    checkFormValidity();
});

// ==========================================
// FUNCIONES DE UTILIDAD (Y VALIDACIÓN EN TIEMPO REAL)
// ==========================================

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === "password" ? "text" : "password";
}

function checkFormValidity() {
    let isValid = true;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // 1. Validar Contraseña
    if (passInput.value.length > 0 && !passRegex.test(passInput.value)) {
        document.getElementById('pass-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('pass-error').classList.add('hidden');
    }

    // 2. Validar Confirmación de Contraseña
    if (confirmInput.value.length > 0 && passInput.value !== confirmInput.value) {
        document.getElementById('match-error').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('match-error').classList.add('hidden');
    }

    // 3. Validar Correo Electrónico
    const correoInput = document.getElementById('correo');
    if (correoInput.value.length > 0 && !correoInput.validity.valid) {
        document.getElementById('correo-error').classList.remove('hidden');
    } else {
        document.getElementById('correo-error').classList.add('hidden');
    }

    // 4. Validar Celular (Exactamente 10)
    const celularInput = document.getElementById('celular');
    if (celularInput.value.length > 0 && celularInput.value.length < 10) {
        document.getElementById('celular-error').classList.remove('hidden');
    } else {
        document.getElementById('celular-error').classList.add('hidden');
    }

    // 5. Validar Modelo (Mínimo 4)
    const modeloInput = document.getElementById('modelo-vehiculo');
    if (modeloInput.value.length > 0 && modeloInput.value.length < 4) {
        document.getElementById('modelo-error').classList.remove('hidden');
    } else {
        document.getElementById('modelo-error').classList.add('hidden');
    }

    // 6. Validar Placa (Mínimo 5 - Maximo 6)
    const placaInput = document.getElementById('placa');
    if (placaInput.value.length > 0 && placaInput.value.length < 5) {
        document.getElementById('placa-error').classList.remove('hidden');
    } else {
        document.getElementById('placa-error').classList.add('hidden');
    }

    // 7. Validar IMEI (Exactamente 6)
    const imeiInput = document.getElementById('imei');
    if (imeiInput.value.length > 0 && imeiInput.value.length < 6) {
        document.getElementById('imei-error').classList.remove('hidden');
    } else {
        document.getElementById('imei-error').classList.add('hidden');
    }

    // Habilitar botón de envío sólo si HTML y nuestras validaciones adicionales están OK
    submitBtn.disabled = !(form.checkValidity() && isValid && consentCheckbox.checked);
}

// Ejecutar checkFormValidity cada vez que el usuario escribe algo
form.addEventListener('input', checkFormValidity);
consentCheckbox.addEventListener('change', checkFormValidity);

// ==========================================
// MANEJO DEL ENVÍO DEL FORMULARIO Y CORREOS
// ==========================================

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');
    submitBtn.classList.add('hidden');
    loadingEl.classList.remove('hidden');

    const datosParaBackend = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        tipo_vehiculo: document.getElementById('tipo-vehiculo').value,
        color_vehiculo: document.getElementById('color-vehiculo').value.trim(),
        modelo_vehiculo: document.getElementById('modelo-vehiculo').value.trim(),
        placa: document.getElementById('placa').value.trim().toUpperCase(),
        imei_6_digitos: document.getElementById('imei').value.trim(),
        codigo_distribuidor: document.getElementById('codigo-distribuidor').value.trim().toUpperCase(),
        fecha_registro: new Date().toLocaleString()
    };

    try {
        // Petición real a el servidor backend
        const response = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosParaBackend)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            // Éxito: Los correos se enviaron correctamente
            loadingEl.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            successEl.classList.remove('hidden');
            form.reset();
            checkFormValidity();
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // El servidor respondió, pero con un error interno
            throw new Error(result.message || "Error procesando el registro en el servidor.");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        loadingEl.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        errorEl.textContent = "Error al enviar los datos. Asegúrate de que el servidor backend esté encendido y tengas conexión a internet.";
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

document.getElementById('btn-salir').addEventListener('click', () => window.location.reload());