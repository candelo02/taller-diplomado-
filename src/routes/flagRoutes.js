const express = require('express');
const router = express.Router();
const { featureFlagService } = require('../config/featureFlags');

router.get('/feature-flags', (req, res) => {
  res.json(featureFlagService.evaluate());
});

router.post('/feature-flags', (req, res) => {
  const { flag, value } = req.body;
  if (!flag) {
    return res.status(400).json({ error: 'Nombre de flag requerido' });
  }

  featureFlagService.setFlag(flag, value);
  res.json({
    message: `Feature flag '${flag}' actualizado a ${value}`,
    flags: featureFlagService.getFlags()
  });
});

module.exports = router;
