const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { featureFlagService } = require('../config/featureFlags');

// POST /api/orders - Crear nuevo pedido en línea
router.post('/orders', (req, res) => {
  if (!featureFlagService.isOnlineOrderingEnabled()) {
    return res.status(403).json({
      error: 'El servicio de pedidos en línea está deshabilitado temporalmente (Feature Flag OFF).'
    });
  }

  const { customerName, phone, address, items, notes } = req.body;

  if (!customerName || !customerName.trim()) {
    return res.status(400).json({ error: 'El nombre del cliente es obligatorio' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El pedido debe incluir al menos un producto' });
  }

  // Calcular totales
  let subtotal = 0;
  const processedItems = items.map(item => {
    const menuItem = db.data.menu.find(m => m.id === item.id);
    if (!menuItem) {
      throw new Error(`Producto ID #${item.id} no existe en el menú`);
    }
    const itemTotal = menuItem.price * item.quantity;
    subtotal += itemTotal;
    return {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
      itemTotal
    };
  });

  const serviceFee = parseFloat((subtotal * 0.10).toFixed(2)); // 10% servicio opcional
  const total = parseFloat((subtotal + serviceFee).toFixed(2));

  const newOrder = {
    orderId: `ORD-${db.data.nextOrderId++}`,
    customerName: customerName.trim(),
    phone: phone ? phone.trim() : '',
    address: address ? address.trim() : 'Consumo en Local',
    items: processedItems,
    subtotal,
    serviceFee,
    total,
    notes: notes || '',
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  };

  db.data.orders.push(newOrder);
  db.save();

  res.status(201).json({
    message: 'Pedido realizado con éxito',
    order: newOrder
  });
});

// GET /api/orders/:id - Consultar estado de pedido
router.get('/orders/:id', (req, res) => {
  const order = db.data.orders.find(o => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  res.json(order);
});

module.exports = router;
