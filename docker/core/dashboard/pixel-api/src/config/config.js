const config = {};

config.LOGS_DIR = process.env.LOGS_DIR || 'logs';
config.PORT = process.env.PORT || 3000;

/**
 * MongoDB
 */

config.mongodb = {};
config.mongodb.URL = process.env.MONGO_URL || 'mongodb://192.168.0.44/pixel-db';

/**
 * Fiware
 */
config.fiware = {};

config.fiware.IDM_URL = process.env.IDM_URL || 'https://id.pixel-ports.eu';

/**
 * General Configuration
 */
config.const = {};

/**
 * Master Token
 */
config.auth = {};
config.auth.master = process.env.API_MASTER || '123456789';

config.const.LANG = ['en-US', 'es-ES'];

export default config;
