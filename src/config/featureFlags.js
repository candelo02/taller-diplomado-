const dotenv = require('dotenv');
dotenv.config();

const defaultFlags = {
  // Ticket 1: Soporte base de tema oscuro detrás de flag apagado (false por defecto)
  dark_mode_enabled: process.env.FEATURE_DARK_MODE_ENABLED === 'true' || false,

  // Ticket 2: Visibilidad del botón toggle según porcentaje de rollout (ej: 10%)
  dark_mode_visible_percentage: parseInt(process.env.FEATURE_DARK_MODE_VISIBLE_ROLLOUT || '10', 10),

  // Ticket 3: Persistencia de preferencia de tema (localStorage / API backend) (true por defecto)
  dark_mode_persistence_enabled: process.env.FEATURE_DARK_MODE_PERSISTENCE === 'false' ? false : true
};

function getDeterministicHash(identifier) {
  if (!identifier) return 0;
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

class FeatureFlagService {
  constructor(flags = defaultFlags) {
    this.flags = { ...flags };
  }

  setFlag(flagName, value) {
    this.flags[flagName] = value;
  }

  getFlags() {
    return { ...this.flags };
  }

  /**
   * Ticket 1: Evalúa si las variables CSS y el motor de tema oscuro están habilitados en el sistema
   */
  isDarkModeSupported() {
    return Boolean(this.flags.dark_mode_enabled);
  }

  /**
   * Ticket 2: Evalúa si el botón toggle de modo oscuro es visible para un usuario dado según porcentaje
   */
  isDarkModeVisible(userIdOrIp = 'anonymous') {
    if (!this.isDarkModeSupported()) return false;
    if (this.flags.dark_mode_visible_percentage >= 100) return true;
    if (this.flags.dark_mode_visible_percentage <= 0) return false;
    const hash = getDeterministicHash(userIdOrIp);
    return hash < this.flags.dark_mode_visible_percentage;
  }

  /**
   * Ticket 3: Evalúa si la preferencia debe guardarse y mantenerse persistida
   */
  isDarkModePersistenceEnabled() {
    return this.isDarkModeSupported() && Boolean(this.flags.dark_mode_persistence_enabled);
  }

  evaluateForUser(userIdOrIp = 'anonymous') {
    return {
      dark_mode_enabled: this.isDarkModeSupported(),
      dark_mode_visible: this.isDarkModeVisible(userIdOrIp),
      dark_mode_persistence: this.isDarkModePersistenceEnabled(),
      raw_flags: this.flags
    };
  }
}

const instance = new FeatureFlagService();

module.exports = {
  featureFlagService: instance,
  FeatureFlagService
};
