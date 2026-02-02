# Control de pagos — README breve

Sistema de Control de Pagos – Taller Mecánico

Aplicación web para la gestión de trabajos y pagos de mecánicos en un taller, diseñada para reemplazar el cálculo manual y desordenado de pagos semanales.

El sistema permite registrar trabajos, calcular ganancias automáticamente, cerrar semanas laborales y que cada mecánico pueda ver su resumen personal.

🚀 Características principales
👨‍🔧 Mecánicos

Ver sus trabajos realizados en la semana

Ver el total ganado automáticamente

Interfaz responsive (móvil y desktop)

Acceso con autenticación

🧑‍💼 Administrador

Registrar mecánicos

Registrar tipos de servicio y porcentajes

Registrar trabajos realizados

Control semanal de pagos

Cierre de semana automático

🧱 Tecnologías usadas
Backend

Node.js

Express

MongoDB + Mongoose

JWT (Autenticación)

dotenv

Frontend

HTML

Tailwind CSS

JavaScript Vanilla

Axios

Deploy

Render

📂 Estructura del proyecto
├── controllers/
├── models/
├── routes/
├── middlewares/
├── public/
│   ├── admin.html
│   ├── mecanico.html
│   ├── index.js
│   └── mecanico.js
├── config/
│   └── env.js
├── index.js
├── package.json
└── README.md

⚙️ Variables de entorno

Crea un archivo .env con las siguientes variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/taller
MONGO_URI_PROD=TU_URI_DE_MONGODB_ATLAS
JWT_SECRET=tu_clave_secreta
NODE_ENV=dev

▶️ Scripts disponibles
"scripts": {
  "start": "cross-env NODE_ENV=production node index.js",
  "dev": "cross-env NODE_ENV=dev nodemon index.js"
}

Desarrollo
npm run dev

Producción
npm start

🌐 Configuración para Render

El proyecto detecta automáticamente el entorno:

const PAGE_URL = process.env.NODE_ENV === 'production'
  ? 'https://TU-APP.onrender.com'
  : 'http://localhost:3000';

const MONGO_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI_PROD
  : process.env.MONGO_URI;


En Render, solo debes:

Agregar las variables de entorno

Usar npm start

No necesitas compilar Tailwind (usa CDN)

📱 Diseño Responsive

Mobile First

Optimizado para teléfonos y escritorio

Estilos consistentes entre admin y mecánicos

UI limpia y enfocada en datos

🔐 Seguridad

Autenticación con JWT

Rutas protegidas por middleware

Separación de roles (admin / mecánico)

📌 Estado del proyecto

🟢 Funcional
🛠️ En mejora continua (reportes, historial, filtros)

👤 Autor

Zander Osuna
Proyecto personal de práctica y portafolio
Desarrollado con Node.js, MongoDB y Tailwind CSS

