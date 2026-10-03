# 📊 Dashboard con Modo Oscuro (Dark Mode) - Ejemplo 3 (Taller 5)

Solución completa para el **Ejemplo 3: Modo oscuro (Dark Mode) en un Dashboard**, desarrollado aplicando **Trunk-Based Development (TBD)**, **Feature Toggles**, Node.js / Express, pruebas automatizadas en CI/CD (GitHub Actions), Docker y auto-despliegue en Render.

---

## 📋 Resumen de Tickets e Historias

| Ticket | Descripción | Feature Flag | Estado |
| :--- | :--- | :--- | :--- |
| **Ticket 1** | Definir variables CSS y motor de temas (`[data-theme="dark"]`) | `dark_mode_enabled` | `false` por defecto |
| **Ticket 2** | Botón switch de tema en navbar para el 10% de usuarios | `dark_mode_visible_percentage` | `10%` rollout |
| **Ticket 3** | Persistencia de preferencia (localStorage + Backend API) | `dark_mode_persistence_enabled` | `100%` rollout |

---

## ⚡ Comandos Rápidos

```bash
npm install     # Instalar dependencias
npm test        # Ejecutar suite de pruebas (12 tests)
npm run lint    # Chequeo sintáctico de código
npm start       # Iniciar servidor en http://localhost:3000
```
