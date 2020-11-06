const config = {};
const fs = require('fs'); 
var ADMIN_SECRET_FILE = null
try {
 ADMIN_SECRET_FILE = fs.readFileSync(process.env.ADMIN_SECRET_FILE, {encoding:'utf8', flag:'r'}); 
} catch (error) {
  console.warn("ENV ADMIN_SECRET_FILE not found, getting ADMIN_SECRET_STRING or default value now...")
}

config.LOGS_DIR = process.env.LOGS_DIR || 'logs';
config.PORT = process.env.PORT || 3000;

/**
 * MongoDB
 */

config.mongodb = {};
config.mongodb.URL = process.env.MONGO_URL || 'mongodb://127.0.0.1/pixel-db';

/**
 * Fiware
 */
config.fiware = {};

config.fiware.IDM_URL = process.env.IDM_URL || 'https://id.pixel-ports.eu';
config.fiware.KEYROCK_CLIENT_ID =
  process.env.KEYROCK_CLIENT_ID || '820c5bce-b85f-465f-8523-2926b27c10d7';
config.fiware.ADMIN_SECRET = process.env.ADMIN_SECRET_STRING || ADMIN_SECRET_FILE || 'admin';
config.fiware.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pixel-ports.eu';
config.fiware.ADMIN_SECRET = config.fiware.ADMIN_SECRET.trim()

/**
 * alerts
 */
config.alerts = {};
config.alerts.ELASTALERT_URL = process.env.ELASTALERT_URL || 'http://192.168.0.9:8085';

/**
 * General Configuration
 */
config.const = {};

/**
 * Master Token
 */
config.auth = {};
config.auth.master = process.env.API_MASTER || 'alerts123456789';

config.const.LANG = ['en-US', 'es-ES'];

export default config;
