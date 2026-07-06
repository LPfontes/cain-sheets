// ==========================================
// CENTRAL DE LOGS - ASSIMILAÇÃO RPG
// ==========================================

const LOG_STYLES = {
  info: 'color: #00ff66; font-weight: bold; background: rgba(0, 255, 102, 0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(0, 255, 102, 0.15);',
  warn: 'color: #eab308; font-weight: bold; background: rgba(234, 179, 8, 0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(234, 179, 8, 0.15);',
  error: 'color: #ef4444; font-weight: bold; background: rgba(239, 68, 68, 0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.15);',
  debug: 'color: #3b82f6; font-weight: bold; background: rgba(59, 130, 246, 0.05); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.15);'
};

export const logger = {
  info(msg, ...args) {
    console.log(`%c[INFO] ${msg}`, LOG_STYLES.info, ...args);
  },
  warn(msg, ...args) {
    console.warn(`%c[WARN] ${msg}`, LOG_STYLES.warn, ...args);
  },
  error(msg, ...args) {
    console.error(`%c[ERROR] ${msg}`, LOG_STYLES.error, ...args);
  },
  debug(msg, ...args) {
    console.log(`%c[DEBUG] ${msg}`, LOG_STYLES.debug, ...args);
  }
};
