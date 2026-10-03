const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/restaurant.json');

// Catálogo completo de platillos (7 por cada categoría: Entradas, Platos Fuertes, Postres, Bebidas)
const initialMenu = [
  // ================= ENTRADAS (7 PLATOS) =================
  {
    id: 1,
    name: "Bruschetta Tradicional de Tomate y Albahaca",
    category: "Entradas",
    price: 12.50,
    rating: 4.8,
    description: "Pan de masa madre tostado a la leña, tomates frescos picados, albahaca orgánica y aceite de oliva virgen extra.",
    ingredients: ["Pan artesanal", "Tomates de huerta", "Albahaca", "Aceite de oliva", "Ajo rostizado"],
    badge: "Vegetariano",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Carpaccio de Salmón con Alcaparras y Cítricos",
    category: "Entradas",
    price: 18.00,
    rating: 4.9,
    description: "Finas láminas de salmón noruego marinadas en eneldo, alcaparras baby, reducción de cítricos y rúcula fresca.",
    ingredients: ["Salmón fresco", "Alcaparras", "Aceite de oliva", "Limón amarillo", "Rúcula"],
    badge: "Especial Chef",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Crema de Hongos Silvestres y Porcini",
    category: "Entradas",
    price: 11.50,
    rating: 4.7,
    description: "Crema aterciopelada de portobellos y hongos porcini ahumados, servida con crujiente de queso parmesano.",
    ingredients: ["Hongos porcini", "Portobello", "Crema de leche", "Parmesano 24 meses"],
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Ensalada César Gourmet con Pollo a la Parrilla",
    category: "Entradas",
    price: 14.00,
    rating: 4.8,
    description: "Lechugas romanas crujientes, pechuga de pollo marinada a la parrilla, aderezo César artesanal y crutones.",
    ingredients: ["Lechuga romana", "Pollo a la parrilla", "Parmesano", "Aderezo César", "Crutones"],
    badge: "Saludable",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Ceviche Clásico de Pescado Blanco y Camote",
    category: "Entradas",
    price: 16.50,
    rating: 4.9,
    description: "Cubos de pescado blanco marinado en leche de tigre de ají amarillo, cebolla morada, cancha crocante y choclo.",
    ingredients: ["Pescado blanco", "Leche de tigre", "Cebolla morada", "Camote glaseado", "Maíz cancha"],
    badge: "Fresco",
    image: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Empanadas Criollas Rellenas de Carne Picada",
    category: "Entradas",
    price: 10.00,
    rating: 4.6,
    description: "Masa hojaldrada horneada rellena de carne cortada a cuchillo, aceitunas, huevo duro y especias aromáticas.",
    ingredients: ["Carne vacuna", "Cebolla", "Aceitunas verdes", "Huevo duro", "Comino"],
    badge: "Tradicional",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Tabla de Quesos y Embutidos Artesanales",
    category: "Entradas",
    price: 22.00,
    rating: 5.0,
    description: "Selección de jamón serrano, salame picante, queso Brie, Manchego curado, frutos secos y mermelada de higos.",
    ingredients: ["Jamón serrano", "Queso Manchego", "Queso Brie", "Nueces", "Mermelada de higos"],
    badge: "Para Compartir",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
  },

  // ================= PLATOS FUERTES (7 PLATOS) =================
  {
    id: 8,
    name: "Risotto de Mariscos en Tinta de Calamar",
    category: "Platos Fuertes",
    price: 28.50,
    rating: 5.0,
    description: "Arroz Carnaroli cremoso elaborado con tinta de calamar, langostinos flameados, pulpo a la parrilla y calamares.",
    ingredients: ["Arroz Carnaroli", "Langostinos", "Pulpo", "Tinta de calamar", "Vino blanco"],
    badge: "Recomendado",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Ribeye Steak Angus con Papas al Romero",
    category: "Platos Fuertes",
    price: 34.00,
    rating: 4.9,
    description: "Corte Angus de 400g madurado 35 días a la parrilla de carbón, con mantequilla de hierbas y papas rústicas.",
    ingredients: ["Ribeye 400g", "Mantequilla de romero", "Papas criollas", "Sal Maldon"],
    badge: "Especial Chef",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Raviolis Artesanales de Ricotta y Espinaca",
    category: "Platos Fuertes",
    price: 22.00,
    rating: 4.8,
    description: "Pasta fresca hecha en casa rellena de queso ricotta y espinacas, bañada en mantequilla de salvia y nueces.",
    ingredients: ["Ricotta de oveja", "Espinaca orgánica", "Salvia", "Nueces garrapiñadas"],
    badge: "Vegetariano",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Hamburguesa Gourmet Angus con Cheddar y Tocineta",
    category: "Platos Fuertes",
    price: 18.50,
    rating: 4.7,
    description: "200g de carne Angus seleccionada, queso cheddar fundido, tocineta crujiente, cebolla caramelizada y papas fritas.",
    ingredients: ["Carne Angus 200g", "Cheddar de lactosa", "Tocineta ahumada", "Pan Brioche"],
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Salmón a la Plancha con Espárragos y Puré de Papa",
    category: "Platos Fuertes",
    price: 29.00,
    rating: 4.9,
    description: "Filete de salmón noruego sellado a la plancha sobre un cremoso puré de papa rústico y espárragos salteados.",
    ingredients: ["Salmón noruego", "Espárragos frescos", "Puré de papa", "Salsa de eneldo"],
    badge: "Sin Gluten",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    name: "Pollo Relleno de Albaricoque y Frutos Secos",
    category: "Platos Fuertes",
    price: 24.00,
    rating: 4.7,
    description: "Pechuga de pollo orgánica horneada rellena de frutos secos y albaricoque, servida con vegetales asados.",
    ingredients: ["Pollo orgánico", "Albaricoques seco", "Almendras", "Vegetales mixtos"],
    badge: "Gourmet",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Lasaña Boloñesa Tradicional Gratinada",
    category: "Platos Fuertes",
    price: 21.00,
    rating: 4.8,
    description: "Capas de pasta artesanal con ragú boloñés de carne vacuna y cerdo, bechamel cremosa y abundante queso mozzarella.",
    ingredients: ["Ragú boloñés", "Pasta lasagna", "Queso Mozzarella", "Salsa Bechamel"],
    badge: "Clásico Italiano",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80"
  },

  // ================= POSTRES (7 PLATOS) =================
  {
    id: 15,
    name: "Tiramisú Tradicional Veneciano",
    category: "Postres",
    price: 9.50,
    rating: 4.9,
    description: "Bizcochos savoiardi impregnados en café espresso Illy y licor Amaretto con crema de queso Mascarpone.",
    ingredients: ["Queso Mascarpone", "Café espresso", "Licor Amaretto", "Cacao puro"],
    badge: "Clásico Italiano",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Volcán de Chocolate Belga con Helado de Vainilla",
    category: "Postres",
    price: 11.00,
    rating: 5.0,
    description: "Pastel tibio con centro líquido fluido de chocolate negro 70%, servido con helado artesanal de vainilla Bourbon.",
    ingredients: ["Chocolate Belga 70%", "Helado de Vainilla", "Coulis de frutos rojos"],
    badge: "Favorito del Público",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    name: "Cheesecake de Frutos Rojos y Galleta Graham",
    category: "Postres",
    price: 10.00,
    rating: 4.8,
    description: "Pastel de queso crema estilo Nueva York sobre crujiente base de galleta Graham y salsa casera de frambuesas.",
    ingredients: ["Queso crema", "Frambuesas", "Mora silvestre", "Base de galleta"],
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 18,
    name: "Flan Casero de Caramelo con Dulce de Leche",
    category: "Postres",
    price: 8.50,
    rating: 4.7,
    description: "Flan cremoso de huevos de campo bañado en caramelo líquido rubio, acompañado de abundante dulce de leche.",
    ingredients: ["Leche entera", "Huevos frescos", "Caramelo artesanal", "Dulce de leche"],
    badge: "Casero",
    image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 19,
    name: "Tarta de Limón y Merengue Italiano",
    category: "Postres",
    price: 9.00,
    rating: 4.8,
    description: "Masa sablée crocante con crema ácida de limón amarillo recién exprimido y picos dorados de merengue suave.",
    ingredients: ["Limón amarillo", "Merengue suizo", "Masa sablée", "Mantequilla"],
    badge: "Refrescante",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 20,
    name: "Brownie con Nueces y Bola de Helado",
    category: "Postres",
    price: 9.50,
    rating: 4.7,
    description: "Brownie denso de chocolate con nueces tostadas troceadas, servido tibio con jarabe fudge de chocolate caliente.",
    ingredients: ["Chocolate amargo", "Nueces picadas", "Helado de crema", "Fudge caliente"],
    badge: "Delicioso",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 21,
    name: "Gelato Italiano Mixto (3 Sabores a Elección)",
    category: "Postres",
    price: 8.00,
    rating: 4.9,
    description: "Copa de gelato artesanal tipo italiano a elegir entre pistacho de Sicilia, avellana de Piamonte y stracciatella.",
    ingredients: ["Pistacho siciliano", "Avellana", "Chocolate stracciatella"],
    badge: "Artesanal",
    image: "https://images.unsplash.com/photo-1567206563064-6f60f4078b57?auto=format&fit=crop&w=600&q=80"
  },

  // ================= BEBIDAS (7 BEBIDAS) =================
  {
    id: 22,
    name: "Cocktail Aperol Spritz Artesanal",
    category: "Bebidas",
    price: 11.50,
    rating: 4.8,
    description: "Prosecco italiano DOC, Aperol aperitivo, agua con gas purificada y una fresca rodaja de naranja importada.",
    ingredients: ["Prosecco DOC", "Aperol", "Naranja de Valencia", "Soda"],
    badge: "Coctelería",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 23,
    name: "Vino Tinto Chianti Classico Riserva (Copa)",
    category: "Bebidas",
    price: 15.00,
    rating: 4.9,
    description: "Vino toscano de gran cuerpo con notas a cereza madura, especias finas y sutil roble. Cosecha seleccionada.",
    ingredients: ["Uva Sangiovese 100%"],
    badge: "Sommelier Pick",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 24,
    name: "Limonada de Coco y Menta Fresca",
    category: "Bebidas",
    price: 6.50,
    rating: 4.8,
    description: "Limonada frappé hecha con crema de coco orgánico, jugo de limón recién exprimido y hojas de menta fresca.",
    ingredients: ["Crema de coco", "Jugo de limón", "Hojas de menta", "Hielo picado"],
    badge: "Sin Alcohol",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 25,
    name: "Mojito Clásico de Ron y Hierbabuena",
    category: "Bebidas",
    price: 10.50,
    rating: 4.7,
    description: "Ron blanco añejo macerado con hierbabuena fresca, azúcar moreno, zumo de lima y soda helada.",
    ingredients: ["Ron Blanco 3 Años", "Hierbabuena fresca", "Lima", "Azúcar moreno"],
    badge: "Clásico",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 26,
    name: "Jugo Natural de Frutos del Bosque",
    category: "Bebidas",
    price: 5.50,
    rating: 4.6,
    description: "Bebida natural preparada al instante con fresas, moras y arándanos frescos enteros sin azúcares añadidos.",
    ingredients: ["Fresas", "Moras", "Arándanos", "Agua manantial"],
    badge: "Natural",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 27,
    name: "Cerveza Artesanal IPA Dorada (500ml)",
    category: "Bebidas",
    price: 8.50,
    rating: 4.8,
    description: "Cerveza dorada de fermentación alta con notas intensas de lúpulo floral y amargor equilibrado en boca.",
    ingredients: ["Malta de cebada", "Lúpulo Cascade", "Agua de manantial"],
    badge: "Artesanal",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 28,
    name: "Café Espresso Italiano o Cappuccino",
    category: "Bebidas",
    price: 4.50,
    rating: 4.9,
    description: "Café 100% arábica de tueste medio preparado en máquina espresso tradicional con crema de leche emulsionada.",
    ingredients: ["Granos Arábica 100%", "Leche entera cremada"],
    badge: "Cafetería",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
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
