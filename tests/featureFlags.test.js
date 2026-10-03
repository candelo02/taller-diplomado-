const test = require('node:test');
const assert = require('node:assert/strict');
const { FeatureFlagService } = require('../src/config/featureFlags');

test('FeatureFlagService - Restaurante Gourmet Flags', async (t) => {
  await t.test('online_ordering_enabled activado por defecto', () => {
    const ff = new FeatureFlagService({ online_ordering_enabled: true, table_reservation_enabled: true, promotions_banner_enabled: true });
    assert.equal(ff.isOnlineOrderingEnabled(), true);
    assert.equal(ff.isTableReservationEnabled(), true);
    assert.equal(ff.isPromotionsBannerEnabled(), true);
  });

  await t.test('Permite desactivar flags individualmente', () => {
    const ff = new FeatureFlagService({ online_ordering_enabled: false, table_reservation_enabled: true, promotions_banner_enabled: false });
    assert.equal(ff.isOnlineOrderingEnabled(), false);
    assert.equal(ff.isTableReservationEnabled(), true);
    assert.equal(ff.isPromotionsBannerEnabled(), false);
  });

  await t.test('setFlag actualiza dinámicamente el estado del flag', () => {
    const ff = new FeatureFlagService();
    ff.setFlag('online_ordering_enabled', false);
    assert.equal(ff.isOnlineOrderingEnabled(), false);
  });
});
