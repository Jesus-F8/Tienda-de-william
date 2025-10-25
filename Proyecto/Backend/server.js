const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar modelos para establecer asociaciones
require('./src/models');

// Importar rutas y middlewares
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares de seguridad y parsing
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Rutas
app.use('/api', routes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Inventario',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            health: '/api/health'
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`
    });
});

// Manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📊 API disponible en http://localhost:${port}/api`);
    console.log(`🏥 Health check en http://localhost:${port}/api/health`);
    console.log(`📦 Productos en http://localhost:${port}/api/products`);
});

