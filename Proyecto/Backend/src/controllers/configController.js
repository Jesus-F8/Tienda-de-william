// En: src/controllers/configController.js

const configService = require('../services/configService'); // <-- CAMBIO AQUÍ

class ConfigController { // <-- CAMBIO AQUÍ

    async getSettings(req, res, next) {
        try {
            const settings = await configService.getSettings(); // <-- CAMBIO AQUÍ
            res.status(200).json(settings);
        } catch (error) {
            next(error);
        }
    }

    async updateSetting(req, res, next) {
        try {
            const { key } = req.params;
            const { value } = req.body;

            const updatedSetting = await configService.updateSetting(key, value); // <-- CAMBIO AQUÍ
            res.status(200).json(updatedSetting);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ConfigController(); // <-- CAMBIO AQUÍ