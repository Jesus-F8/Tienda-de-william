// testConnection.js
require('dotenv').config();
const sequelize = require('./src/config/database');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✓ Conexión a PostgreSQL exitosa');
        console.log('✓ Base de datos:', process.env.DB_NAME);
        console.log('✓ Host:', process.env.DB_HOST);
        console.log('✓ Puerto:', process.env.DB_PORT);

        // Cerrar la conexión
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ Error al conectar con la base de datos:');
        console.error('  Mensaje:', error.message);
        console.error('  Detalles:', error.original?.message || error);
        process.exit(1);
    }
}

testConnection();

