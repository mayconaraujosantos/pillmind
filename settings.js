/**
 * Node-RED Settings Configuration
 * Configura Node-RED para aceitar conexões de qualquer interface (0.0.0.0)
 * Permite acesso do Android emulator (10.0.2.2) e iOS simulator (localhost)
 */

/* eslint-disable no-undef */
module.exports = {
  // Listen on all interfaces (0.0.0.0) to allow connections from Android emulator (10.0.2.2)
  // This applies to both the editor UI and the API endpoints
  uiHost: '0.0.0.0',
  uiPort: 1880,

  // Also bind HTTP server to all interfaces
  httpAdminRoot: '/',
  httpNodeRoot: '/',
  httpRoot: '/',

  // Allow connections from all origins (important for mobile devices)
  // This is only for development - use proper CORS in production
  httpCors: {
    origin: '*',
  },

  // Database filename
  flows: 'node-red-flow.json',

  // Node modules directory
  nodesDir: '.node-red/nodes',

  // User settings
  userDir: '.node-red',

  // Logging level: fatal, error, warn, info, debug, trace
  logging: {
    console: {
      level: 'info',
    },
  },

  // Enable editor UI
  httpAdminRoot: '/',

  // API settings - expose all HTTP nodes at root
  httpNodeRoot: '/',

  // Context storage
  contextStorage: {
    default: {
      module: 'memory',
    },
  },

  // Credentials encryption
  credentialSecret: 'pillmind-dev-secret-key',
};
