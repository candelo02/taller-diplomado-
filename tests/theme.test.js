const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { featureFlagService } = require('../src/config/featureFlags');
const db = require('../src/db/database');

test('API Integration Tests - Dashboard Dark Mode & User Preferences', async (t) => {
  t.beforeEach(() => {
    db.reset();
    featureFlagService.setFlag('dark_mode_enabled', true);
    featureFlagService.setFlag('dark_mode_visible_percentage', 100);
    featureFlagService.setFlag('dark_mode_persistence_enabled', true);
  });

  await t.test('GET /healthz - Debe retornar HTTP 200 OK', async () => {
    const res = await request(app).get('/healthz');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'OK');
  });

  await t.test('Ticket 3: POST /api/user-preferences guarda la preferencia de tema', async () => {
    const res = await request(app)
      .post('/api/user-preferences')
      .set('X-User-Id', 'user_test')
      .send({ theme: 'dark' });

    assert.equal(res.status, 200);
    assert.equal(res.body.theme, 'dark');
    assert.equal(res.body.userId, 'user_test');
  });

  await t.test('Ticket 3: GET /api/user-preferences recupera preferencia guardada', async () => {
    await request(app)
      .post('/api/user-preferences')
      .set('X-User-Id', 'user_test')
      .send({ theme: 'dark' });

    const res = await request(app)
      .get('/api/user-preferences')
      .set('X-User-Id', 'user_test');

    assert.equal(res.status, 200);
    assert.equal(res.body.theme, 'dark');
  });

  await t.test('POST /api/user-preferences valida tema invalido', async () => {
    const res = await request(app)
      .post('/api/user-preferences')
      .set('X-User-Id', 'user_test')
      .send({ theme: 'blue' });

    assert.equal(res.status, 400);
    assert.match(res.body.error, /El tema debe ser/);
  });

  await t.test('POST /api/user-preferences retorna 403 si persistencia está deshabilitada', async () => {
    featureFlagService.setFlag('dark_mode_persistence_enabled', false);

    const res = await request(app)
      .post('/api/user-preferences')
      .set('X-User-Id', 'user_test')
      .send({ theme: 'dark' });

    assert.equal(res.status, 403);
    assert.match(res.body.error, /deshabilitada/);
  });
});
