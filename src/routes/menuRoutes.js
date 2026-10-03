const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/menu - Obtener catálogo de menú con filtrado opcional por categoría o búsqueda
router.get('/menu', (req, res) => {
  let menu = db.data.menu;
  const { category, search } = req.query;

  if (category && category !== 'Todos') {
    menu = menu.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    menu = menu.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(term))
    );
  }

  res.json(menu);
});

// GET /api/menu/:id - Detalle de plato por ID
router.get('/menu/:id', (req, res) => {
  const numericId = parseInt(req.params.id, 10);
  const item = db.data.menu.find(m => m.id === numericId);

  if (!item) {
    return res.status(404).json({ error: 'Plato no encontrado' });
  }

  res.json(item);
});

module.exports = router;
