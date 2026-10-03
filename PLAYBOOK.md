# 📖 Playbook de Trabajo: Modo Oscuro con Feature Flags (Ejemplo 3)

Guía de desarrollo e integración continua para el equipo.

---

## 🚩 Estrategia de División de Historias (Ejemplo 3)

- **Ticket 1 (CSS Variables & Engine)**:
  - Definir variables CSS para temas claro y oscuro (`:root` y `[data-theme="dark"]`).
  - Proteger detrás de `dark_mode_enabled = false`.
- **Ticket 2 (Botón Switch & Rollout 10%)**:
  - Exponer el botón switch únicamente al 10% de usuarios (`dark_mode_visible_percentage = 10`). Sin persistencia.
- **Ticket 3 (Persistencia & Rollout 100%)**:
  - Persistir en `localStorage` y API del backend (`/api/user-preferences`).
  - Aumentar el porcentaje de rollout al 100%.
