const express = require('express');
const router = express.Router();
const PreferenceModel = require('../models/preferenceModel');
const { featureFlagService } = require('../config/featureFlags');

// GET /api/user-preferences (Ticket 3)
router.get('/user-preferences', (req, res) => {
  const userId = req.headers['x-user-id'] || 'anonymous';

  if (!featureFlagService.isDarkModePersistenceEnabled()) {
    return res.status(200).json({
      theme: 'light',
      persistence_active: false,
      message: 'Persistencia de tema inactiva por Feature Toggle'
    });
  }

  const theme = PreferenceModel.getPreference(userId);
  res.json({ userId, theme, persistence_active: true });
});

// POST /api/user-preferences (Ticket 3: Guardar preferencia)
router.post('/user-preferences', (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.userId || 'anonymous';
  const { theme } = req.body;

  if (!featureFlagService.isDarkModePersistenceEnabled()) {
    return res.status(403).json({
      error: 'La persistencia de preferencia de tema está deshabilitada (Ticket 3 Feature Toggle OFF).'
    });
  }

  try {
    const result = PreferenceModel.setPreference(userId, theme);
    res.json({
      message: 'Preferencia de tema actualizada exitosamente',
      ...result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
