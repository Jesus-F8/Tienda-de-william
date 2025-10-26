// En: src/services/configService.js

const configDAL = require('../dal/configDAL'); // <-- CAMBIO AQUÍ

class ConfigService { // <-- CAMBIO AQUÍ

    /**
     * Obtiene todas las configuraciones como un objeto.
     */
    async getSettings() {
        return await configDAL.getAllSettings(); // <-- CAMBIO AQUÍ
    }

    /**
     * Actualiza una configuración específica.
     */
    async updateSetting(key, value) {
        if (!value) {
            throw new Error('El valor no puede estar vacío');
        }
        // Aquí se podrían añadir más validaciones (ej. si es un número)

        const updated = await configDAL.updateSetting(key, value); // <-- CAMBIO AQUÍ
        return { [updated.key]: updated.value };
    }
}

module.exports = new ConfigService(); // <-- CAMBIO AQUÍ