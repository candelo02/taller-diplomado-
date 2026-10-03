const test = require('node:test');
const assert = require('node:assert/strict');
const { FeatureFlagService } = require('../src/config/featureFlags');

test('FeatureFlagService - Ejemplo 3 (Modo Oscuro)', async (t) => {
  await t.test('Ticket 1: dark_mode_enabled deshabilitado por defecto', () => {
    const ff = new FeatureFlagService({ dark_mode_enabled: false, dark_mode_visible_percentage: 10 });
    assert.equal(ff.isDarkModeSupported(), false);
    assert.equal(ff.isDarkModeVisible('user_123'), false);
  });

  await t.test('Ticket 1: dark_mode_enabled habilitado explícitamente', () => {
    const ff = new FeatureFlagService({ dark_mode_enabled: true, dark_mode_visible_percentage: 10 });
    assert.equal(ff.isDarkModeSupported(), true);
  });

  await t.test('Ticket 2: Rollout 100% permite ver el toggle a cualquier usuario', () => {
    const ff = new FeatureFlagService({ dark_mode_enabled: true, dark_mode_visible_percentage: 100 });
    assert.equal(ff.isDarkModeVisible('user_123'), true);
    assert.equal(ff.isDarkModeVisible('user_999'), true);
  });

  await t.test('Ticket 2: Rollout 0% oculta el toggle a cualquier usuario', () => {
    const ff = new FeatureFlagService({ dark_mode_enabled: true, dark_mode_visible_percentage: 0 });
    assert.equal(ff.isDarkModeVisible('user_123'), false);
  });

  await t.test('Ticket 3: Persistencia inactiva si dark_mode_enabled es false', () => {
    const ff = new FeatureFlagService({ dark_mode_enabled: false, dark_mode_persistence_enabled: true });
    assert.equal(ff.isDarkModePersistenceEnabled(), false);
  });
});
