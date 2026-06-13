# 🚀 Sistema de Registro Warriors GPS

Plataforma de registro de usuarios diseñada para **Warriors GPS**, que permite la captura de datos del cliente, validación en tiempo real y la automatización del flujo de trabajo administrativo mediante el envío simultáneo de tres correos electrónicos de confirmación.

## 📋 Características Principales

* **Frontend Moderno:** Interfaz responsiva desarrollada con **Tailwind CSS**, tipografía *DM Sans* y validaciones en tiempo real para asegurar la calidad de los datos.
* **Backend Escalable:** Servidor con **Node.js y Express** que gestiona la lógica del proyecto.
* **Automatización de Correos:** Integración con **Nodemailer** para disparar tres notificaciones automáticas al registrar un nuevo usuario:
    1. Confirmación para el **Usuario**.
    2. Notificación de ingreso a la **Base de Datos**.
    3. Alerta técnica para la **Activación de dispositivo GPS**.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript (Vanilla).
* **Backend:** Node.js, Express.js.
* **Integración:** Nodemailer.
* **Entorno de Desarrollo:** IntelliJ IDEA.

## 📂 Estructura del Proyecto

```text
/
├── Frontend/           # Interfaz de usuario, estilos y lógica cliente
├── Backend/            # Servidor API, controladores y plantillas de correo
└── README.md           # Documentación del proyecto
