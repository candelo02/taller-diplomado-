const db = require('../db/database');

class PreferenceModel {
  static getPreference(userId) {
    if (!userId) return 'light';
    return db.data.userPreferences[userId] || 'light';
  }

  static setPreference(userId, theme) {
    if (!userId) throw new Error('ID de usuario requerido');
    if (!['light', 'dark'].includes(theme)) {
      throw new Error("El tema debe ser 'light' o 'dark'");
    }
    db.data.userPreferences[userId] = theme;
    db.save();
    return { userId, theme };
  }
}

module.exports = PreferenceModel;
