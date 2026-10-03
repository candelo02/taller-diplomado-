const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const { featureFlagService } = require('../src/config/featureFlags');
const db = require('../src/db/database');

test('API Integration Tests - Restaurante Gourmet "La Dolce Vita"', async (t) => {
  t.beforeEach(() => {
    db.reset();
    featureFlagService.setFlag('online_ordering_enabled', true);
    featureFlagService.setFlag('table_reservation_enabled', true);
    featureFlagService.setFlag('promotions_banner_enabled', true);
  });

  await t.test('GET /healthz - Debe retornar HTTP 200 OK para monitoreo', async () => {
    const res = await request(app).get('/healthz');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'OK');
  });

  await t.test('GET /api/menu - Debe retornar lista completa del catálogo de platos', async () => {
    const res = await request(app).get('/api/menu');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 10);
  });

  await t.test('GET /api/menu?category=Entradas - Debe filtrar por categoría Entradas', async () => {
    const res = await request(app).get('/api/menu?category=Entradas');
    assert.equal(res.status, 200);
    assert.ok(res.body.every(item => item.category === 'Entradas'));
  });

  await t.test('GET /api/menu?search=Salmón - Debe buscar platos por nombre o ingrediente', async () => {
    const res = await request(app).get('/api/menu?search=Salmón');
    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0);
    assert.match(res.body[0].name, /Salmón/i);
  });

  await t.test('GET /api/menu/:id - Retorna detalle del plato existente', async () => {
    const res = await request(app).get('/api/menu/1');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 1);
    assert.ok(res.body.name);
  });

  await t.test('POST /api/orders - Crear pedido en línea y calcular totales', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Juan Pérez',
        phone: '3001234567',
        address: 'Calle 100 #15-20',
        items: [
          { id: 1, quantity: 2 }, // Bruschetta $14.50 * 2 = 29.00
          { id: 7, quantity: 1 }  // Tiramisú $9.50 * 1 = 9.50
        ]
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.order.customerName, 'Juan Pérez');
    assert.equal(res.body.order.subtotal, 38.50);
    assert.equal(res.body.order.serviceFee, 3.85);
    assert.equal(res.body.order.total, 42.35);
    assert.ok(res.body.order.orderId.startsWith('ORD-'));
  });

  await t.test('POST /api/orders - Debe retornar 403 Forbidden cuando online_ordering_enabled = false', async () => {
    featureFlagService.setFlag('online_ordering_enabled', false);

    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Juan Pérez',
        items: [{ id: 1, quantity: 1 }]
      });

    assert.equal(res.status, 403);
    assert.match(res.body.error, /deshabilitado/);
  });

  await t.test('POST /api/reservations - Crear reserva de mesa exitosamente', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({
        name: 'Camila Torres',
        email: 'camila@example.com',
        phone: '3109876543',
        date: '2026-10-15',
        time: '20:00',
        guests: 4,
        specialRequests: 'Mesa cerca a la ventana'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.reservation.name, 'Camila Torres');
    assert.equal(res.body.reservation.guests, 4);
    assert.ok(res.body.reservation.reservationId.startsWith('RES-'));
  });

  await t.test('POST /api/reservations - Debe retornar 403 cuando table_reservation_enabled = false', async () => {
    featureFlagService.setFlag('table_reservation_enabled', false);

    const res = await request(app)
      .post('/api/reservations')
      .send({
        name: 'Camila Torres',
        date: '2026-10-15',
        time: '20:00',
        guests: 4
      });

    assert.equal(res.status, 403);
    assert.match(res.body.error, /fuera de servicio/);
  });
});
