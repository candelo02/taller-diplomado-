const express = require('express');
const cors = require('cors');
const path = require('path');

const preferenceRoutes = require('./routes/preferenceRoutes');
const flagRoutes = require('./routes/flagRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health Check Endpoint (Requerido para Render y Kubernetes)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', preferenceRoutes);
app.use('/api', flagRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
