// En: src/dal/configDAL.js

const { Settings } = require('../models');

class ConfigDAL { // <-- CAMBIO AQUÍ

    /**
     * Obtiene todas las configuraciones.
     * @returns {Promise<Object>} Un objeto { key: value }
     */
    async getAllSettings() {
        const settings = await Settings.findAll();
        // Transforma el array [ {key, value}, ... ] en un objeto { key: value }
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    /**
     * Obtiene una configuración específica por su clave.
     * @param {string} key - La clave de la configuración (ej. 'exchange_rate_nio')
     * @returns {Promise<Object>} La configuración encontrada.
     */
    async findSettingByKey(key) {
        return await Settings.findByPk(key);
    }

    /**
     * Actualiza una configuración.
     * @param {string} key - La clave a actualizar.
     * @param {string} value - El nuevo valor.
     * @returns {Promise<Object>} La configuración actualizada.
     */
    async updateSetting(key, value) {
        const setting = await Settings.findByPk(key);
        if (!setting) {
            throw new Error('Clave de configuración no encontrada');
        }

        setting.value = value;
        await setting.save();
        return setting;
    }
}

module.exports = new ConfigDAL(); // <-- CAMBIO AQUÍ