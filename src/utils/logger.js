// src/utils/logger.js
// ============================================
export const logger = {
  info: (message) => console.log(`ℹ️  ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  error: (message) => console.error(`❌ ${message}`),
  warn: (message) => console.warn(`⚠️  ${message}`),
  debug: (message) => {
    if (process.env.DEBUG) console.log(`🐛 ${message}`);
  },
};

export const logOperation = (operation, details) => {
  logger.info(`${operation}: ${JSON.stringify(details)}`);
};
