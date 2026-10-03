# 🍷 Aplicación Web Real: Restaurante Gourmet "La Dolce Vita" (Taller 5)

Aplicación web completa y real para el restaurante gourmet **"La Dolce Vita"**, con flujo interactivo de menú, catálogo de productos por categorías, carrito de pedidos en línea, reservas de mesa, panel de control de **Feature Flags** (Trunk-Based Development), contenedorización con Docker y despliegue continuo en Render.

---

## 🍽️ Características Principales

- **Menú Interactivo Gourmet**: Platillos organizados por categorías (*Entradas, Platos Fuertes, Postres, Bebidas*), con precios, calificaciones, insignias (*Vegetariano, Especial del Chef, Recomendado*) y buscador en tiempo real.
- **Carrito de Pedidos**: Selección de productos, ajuste de cantidades, cálculo automático de subtotal, servicio sugerido (10%) y confirmación con código de orden (`ORD-xxxx`).
- **Reserva de Mesas**: Formulario dinámico por fecha, hora y número de comensales con comprobante instantáneo (`RES-xxxx`).
- **Panel de Feature Flags (DevOps Workshop)**: Control dinámico para activar/desactivar el carrito de compra, el módulo de reservas o el banner promocional en tiempo real.

---

## ⚡ Comandos de Ejecución

```bash
npm install     # Instalar dependencias
npm test        # Ejecutar suite de 14 pruebas unitarias e integración
npm run lint    # Chequeo sintáctico de todo el código
npm start       # Iniciar servidor web en http://localhost:3000
```

---

## 🐳 Ejecución con Docker

```bash
docker build -t restaurant-gourmet-app .
docker run -d -p 3000:3000 --name restaurant-app restaurant-gourmet-app
```
