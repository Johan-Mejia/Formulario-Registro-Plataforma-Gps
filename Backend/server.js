/**
 * @fileoverview Servidor Backend para la plataforma de registro de Warriors GPS.
 * Maneja la recepción de datos desde el frontend y despacha de manera simultánea
 * los correos electrónicos usando plantillas HTML personalizadas.
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// ==========================================
// ⚠️ ATENCIÓN INGENIERO DE PLATAFORMA ⚠️
// CONFIGURACIÓN DE CONEXIÓN AL SERVIDOR
// ==========================================
// El código está de forma local, debe configurar la conexión y políticas de CORS para su servidor.
app.use(cors());


// Permite que el servidor entienda datos en formato JSON que envía el frontend
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DEL SERVICIO DE CORREO
// ==========================================
/**
 * Transportador de Nodemailer configurado con credenciales de Gmail.
 * @type {import('nodemailer').Transporter}
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'warriorsgpss@gmail.com', // Correo remitente
        pass: 'lnhnjfjvsftkwcej'        // Clave de aplicación
    }
});

// ==========================================
// RUTA PRINCIPAL DE REGISTRO (/api/registro)
// ==========================================
/**
 * Endpoint que recibe los datos del formulario web y envía 3 correos.
 * @route POST /api/registro
 */
app.post('/api/registro', async (req, res) => {
    // 1. Recepción y estructuración de datos
    const data = req.body;
    const nombreCompleto = `${data.nombre} ${data.apellido}`;
    const vehiculoInfo = `${data.tipo_vehiculo} (${data.color_vehiculo}, ${data.modelo_vehiculo}) - Placa: ${data.placa}`;
    const distribuidor = `${data.codigo_distribuidor}`;

    // ==========================================
    // PLANTILLAS HTML PARA LOS CORREOS
    // ==========================================

    /** @type {string} Plantilla dirigida al cliente confirmando el registro */
    const correoUsuarioHTML = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #B82222 0%, #8F1A1A 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px;">
                WARRIORS <span style="font-weight: 300;">GPS TRACKER</span>
            </h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0; text-align: center; font-size: 22px;">¡Registro Exitoso!</h2>
            <p style="color: #555555; font-size: 16px;">Hola <strong>${data.nombre} ${data.apellido}</strong>,</p>
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Tu registro en nuestra plataforma ha sido procesado de manera exitosa. El GPS de tu vehículo se activará en un tiempo estimado de <strong>5 a 10 minutos</strong>.
            </p>
            <div style="background-color: #f9fafb; border-left: 4px solid #B82222; padding: 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                <h3 style="margin-top: 0; color: #262626; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Detalles del Vehículo</h3>
                <ul style="list-style: none; padding: 0; margin: 0; color: #4b5563; font-size: 15px; line-height: 2;">
                    <li><strong>Vehículo:</strong> ${data.tipo_vehiculo} (${data.color_vehiculo}, ${data.modelo_vehiculo})</li>
                    <li><strong>Placa:</strong> <span style="text-transform: uppercase;">${data.placa}</span></li>
                    <li><strong>IMEI:</strong> ${data.imei_6_digitos}</li>
                    <li><strong>Fecha:</strong> ${data.fecha_registro}</li>
                </ul>
            </div>
            <p style="color: #555555; font-size: 16px; text-align: center; margin-top: 30px;">
                Gracias por confiar en <strong>Warriors GPS</strong>.
            </p>
        </div>
        <div style="background-color: #262626; padding: 30px 20px; text-align: center;">
            <p style="color: #d1d5db; font-size: 15px; margin-bottom: 20px;">¿Ya tienes todo listo?</p>
            <a href="https://warriorsgpstracker.com" style="background-color: #B82222; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Ir a la Plataforma
            </a>
            <p style="color: #6b7280; font-size: 12px; margin-top: 25px;">
                © 2026 Warriors GPS Tracker. Todos los derechos reservados.
            </p>
        </div>
    </div>
    `;

    /** @type {string} Plantilla dirigida a Dana*/
    const correoDanaHTML = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #B82222 0%, #8F1A1A 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px;">
                WARRIORS <span style="font-weight: 300;">GPS TRACKER</span>
            </h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0; text-align: center; font-size: 22px;">¡Nuevo Registro Base de Datos!</h2>
            <div style="background-color: #f9fafb; border-left: 4px solid #B82222; padding: 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                <h3 style="margin-top: 0; color: #262626; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Detalles a Registrar</h3>
                <ul style="list-style: none; padding: 0; margin: 0; color: #4b5563; font-size: 15px; line-height: 2;">
                    <li><strong>Usuario:</strong> ${data.nombre} ${data.apellido}</li>
                    <li><strong>Vehículo:</strong> ${data.tipo_vehiculo} (${data.color_vehiculo}, ${data.modelo_vehiculo})</li>
                    <li><strong>Placa:</strong> <span style="text-transform: uppercase;">${data.placa}</span></li>
                    <li><strong>IMEI:</strong> ${data.imei_6_digitos}</li>
                    <li><strong>Distribuidor:</strong> ${data.codigo_distribuidor}</li>
                    <li><strong>Fecha:</strong> ${data.fecha_registro}</li>
                </ul>
            </div>
        </div>
        <div style="background-color: #262626; padding: 30px 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin-top: 25px;">
                © 2026 Warriors GPS Tracker. Todos los derechos reservados.
            </p>
        </div>
    </div>
    `;

    /** @type {string} Plantilla dirigida al Ingeniero*/
    const correoIngenieroHTML = `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #B82222 0%, #8F1A1A 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 2px;">
                WARRIORS <span style="font-weight: 300;">GPS TRACKER</span>
            </h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0; text-align: center; font-size: 22px;">¡Activación de GPS Requerida!</h2>
            <div style="background-color: #f9fafb; border-left: 4px solid #B82222; padding: 20px; margin: 25px 0; border-radius: 0 6px 6px 0;">
                <h3 style="margin-top: 0; color: #262626; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Detalles del Dispositivo</h3>
                <ul style="list-style: none; padding: 0; margin: 0; color: #4b5563; font-size: 15px; line-height: 2;">
                    <li><strong>Usuario:</strong> ${data.nombre} ${data.apellido}</li>
                    <li><strong>IMEI:</strong> ${data.imei_6_digitos}</li>
                    <li><strong>Fecha:</strong> ${data.fecha_registro}</li>
                </ul>
            </div>
        </div>
        <div style="background-color: #262626; padding: 30px 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin-top: 25px;">
                © 2026 Warriors GPS Tracker. Todos los derechos reservados.
            </p>
        </div>
    </div>
    `;

    // ==========================================
    // EJECUCIÓN DEL ENVÍO DE CORREOS
    // ==========================================
    try {
        // Se ejecuta el envío de los 3 correos de forma concurrente para mayor velocidad
        await Promise.all([
            // 1. Correo al Usuario
            transporter.sendMail({
                from: '"Warriors GPS" <warriorsgpss@gmail.com>',
                to: data.correo,
                subject: 'Confirmación de Registro - Warriors GPS',
                html: correoUsuarioHTML
            }),

            // 2. Correo a Dana (Base de datos)
            transporter.sendMail({
                from: '"Warriors - Sistema GPS" <warriorsgpss@gmail.com>',
                to: 'c.warriorssas@gmail.com',
                subject: `NUEVO INGRESO BD: ${nombreCompleto}`,
                html: correoDanaHTML
            }),

            // 3. Correo a Ingeniero (Plataforma)
            transporter.sendMail({
                from: '"Warriors - Sistema GPS" <warriorsgpss@gmail.com>',
                to: 'soporte@aliengpstracker.com',
                subject: `ACTIVAR GPS - IMEI: ${data.imei_6_digitos}`,
                html: correoIngenieroHTML
            })
        ]);

        // Respuesta exitosa al frontend
        res.status(200).json({ status: 'success', message: 'Correos enviados correctamente' });

    } catch (error) {
        // Manejo de errores de conexión o autenticación
        console.error("Error al enviar los correos: ", error);
        res.status(500).json({ status: 'error', message: 'Fallo al enviar los correos' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});