const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/restaurant.json');

// Catálogo completo de platos gourmet
const initialMenu = [
  // Entradas
  {
    id: 1,
    name: "Bruschetta Trufada con Tomates Heirloom",
    category: "Entradas",
    price: 14.50,
    rating: 4.9,
    description: "Pan de masa madre tostado a la leña, tomates de huerta, albahaca fresca y aceite de trufa negra.",
    ingredients: ["Pan artesanal", "Tomate heirloom", "Albahaca", "Aceite de trufa", "Ajo rostizado"],
    badge: "Vegetariano",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Carpaccio de Salmón Noruego",
    category: "Entradas",
    price: 18.00,
    rating: 4.8,
    description: "Finas láminas de salmón fresco marinadas en eneldo, alcaparras baby, reducción de cítricos y brotes verdes.",
    ingredients: ["Salmón fresco", "Alcaparras", "Aceite de oliva extra virgen", "Limón amarillo", "Rúcula"],
    badge: "Especial Chef",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Crema de Hongos Silvestres & Porcini",
    category: "Entradas",
    price: 12.00,
    rating: 4.7,
    description: "Crema aterciopelada de portobellos y porcinis ahumados servida con crujiente de parmesano y crutones.",
    ingredients: ["Hongos porcini", "Portobello", "Crema de leche", "Parmesano 24 meses"],
    badge: "Sin Gluten Opt",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  },

  // Platos Fuertes
  {
    id: 4,
    name: "Risotto al Nero di Seppia & Mariscos Gourmet",
    category: "Platos Fuertes",
    price: 28.50,
    rating: 5.0,
    description: "Arroz Carnaroli cremoso en tinta de calamar con langostinos flameados, pulpo a la parrilla y calamares.",
    ingredients: ["Arroz Carnaroli", "Langostinos", "Pulpo", "Tinta de calamar", "Vino blanco"],
    badge: "Recomendado",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Ribeye Steak Angus Acompañado de Papas Trufadas",
    category: "Platos Fuertes",
    price: 34.00,
    rating: 4.9,
    description: "Corte Angus madurado 35 días a la parrilla de carbón, servido con mantequilla de hierbas y papas rústicas al romero.",
    ingredients: ["Ribeye 400g", "Mantequilla de romero", "Papas criollas", "Sal Maldon"],
    badge: "Especial Chef",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Raviolis Artesanales de Ricotta & Espinaca Orgánica",
    category: "Platos Fuertes",
    price: 22.00,
    rating: 4.8,
    description: "Pasta hecha a mano rellenada con queso ricotta de oveja y espinaca baby, bañada en salsa de mantequilla de salvia y nueces picadas.",
    ingredients: ["Ricotta de oveja", "Espinaca orgánica", "Salvia", "Nueces garrapiñadas"],
    badge: "Vegetariano",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80"
  },

  // Postres
  {
    id: 7,
    name: "Tiramisú Tradicional de Venecia",
    category: "Postres",
    price: 9.50,
    rating: 4.9,
    description: "Bizcochos savoiardi impregnados en espresso Illy y licor Amaretto con crema suavecísima de queso Mascarpone.",
    ingredients: ["Queso Mascarpone", "Café espresso", "Licor Amaretto", "Cacao puro en polvo"],
    badge: "Clásico Italiano",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Volcán de Chocolate Belga 70% con Helado de Vainilla",
    category: "Postres",
    price: 11.00,
    rating: 5.0,
    description: "Pastel tibio con centro líquido de chocolate negro artesanal, acompañado de helado artesanal de vainilla Bourbon.",
    ingredients: ["Chocolate Belga 70%", "Mantequilla fresca", "Vainilla Bourbon", "Coulis de frutos rojos"],
    badge: "Favorito del Público",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  },

  // Bebidas
  {
    id: 9,
    name: "Cocktail Aperol Spritz Artesanal",
    category: "Bebidas",
    price: 11.50,
    rating: 4.8,
    description: "Prosecco italiano Doc, Aperol, agua con gas purificada y rodaja de naranja fresca importada.",
    ingredients: ["Prosecco DOC", "Aperol", "Naranja de valencia", "Soda"],
    badge: "Coctelería",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Vino Tinto Chianti Classico Riserva (Copa)",
    category: "Bebidas",
    price: 15.00,
    rating: 4.9,
    description: "Vino toscano con notas a cereza madura, especias finas y madera roble. Cosecha 2019.",
    ingredients: ["Uva Sangiovese 100%"],
    badge: "Sommelier Pick",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  }
];

class Database {
  constructor() {
    this.dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.load();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        this.initSeed();
      }
    } else {
      this.initSeed();
    }
  }

  initSeed() {
    this.data = {
      menu: initialMenu,
      orders: [],
      reservations: [],
      nextOrderId: 1001,
      nextReservationId: 5001
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error guardando DB de restaurante:', err);
    }
  }

  reset() {
    this.initSeed();
  }
}

const db = new Database();

module.exports = db;
