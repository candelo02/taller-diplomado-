const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { featureFlagService } = require('../config/featureFlags');

// POST /api/reservations - Crear reserva de mesa
router.post('/reservations', (req, res) => {
  if (!featureFlagService.isTableReservationEnabled()) {
    return res.status(403).json({
      error: 'El módulo de reservas de mesa está fuera de servicio (Feature Flag OFF).'
    });
  }

  const { name, email, phone, date, time, guests, specialRequests } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nombre de contacto obligatorio' });
  }

  if (!date || !time) {
    return res.status(400).json({ error: 'Fecha y hora requeridas' });
  }

  const numGuests = parseInt(guests, 10);
  if (isNaN(numGuests) || numGuests < 1 || numGuests > 20) {
    return res.status(400).json({ error: 'Número de personas debe estar entre 1 y 20' });
  }

  const newReservation = {
    reservationId: `RES-${db.data.nextReservationId++}`,
    name: name.trim(),
    email: email ? email.trim() : '',
    phone: phone ? phone.trim() : '',
    date,
    time,
    guests: numGuests,
    specialRequests: specialRequests || '',
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  };

  db.data.reservations.push(newReservation);
  db.save();

  res.status(201).json({
    message: 'Reserva confirmada exitosamente',
    reservation: newReservation
  });
});

module.exports = router;
