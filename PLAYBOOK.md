# 📖 Playbook de Trabajo: Restaurante Gourmet "La Dolce Vita" (TBD & Feature Flags)

Guía de desarrollo e integración continua para el equipo de desarrollo.

---

## 🔄 Flujo de Trabajo (Trunk-Based Development)

1. **Despliegue Continuo de Funcionalidades**:
   - Todo el código se integra diariamente a la rama `main`.
   - Módulos en desarrollo se protegen mediante **Feature Flags** antes de exponerse al usuario final.

2. **Gestión de Módulos mediante Flags**:
   - `online_ordering_enabled`: Permite activar/desactivar la toma de pedidos online sin necesidad de realizar un redeploy.
   - `table_reservation_enabled`: Habilita o deshabilita la reserva de mesas según capacidad física del local.
   - `promotions_banner_enabled`: Controla la presencia de campañas publicitarias dinámicas.
