# 📋 Definition of Ready (DoR) — Scrum + TBD

Este documento formaliza los criterios que debe cumplir cualquier Historia de Usuario o Incremento antes de ingresar al **Sprint Backlog** y ser elegida para desarrollo (Taller 2 / Prerrequisito Taller 5).

---

## 🎯 Criterios de Aceptación para entrar al Sprint (DoR Checklist)

1. **Tamaño Integrable (≤ 1 día de trabajo)**:
   - [x] La historia está sliceada de forma vertical de tal manera que se puede fusionar a `main` en menos de 24 horas de trabajo.

2. **Verticalidad (Valor de Negocio)**:
   - [x] Cada incremento ofrece valor de negocio independiente o es un esqueleto de funcionalidad operable.

3. **Estrategia de Feature Toggle**:
   - [x] Se ha definido explícitamente si la funcionalidad requiere un Feature Toggle, se especificó su nombre (`online_ordering_enabled`, `table_reservation_enabled`, etc.) y su estado por defecto en producción.

4. **Validación en Entorno Real / Staging**:
   - [x] Los Acceptance Criteria (AC) se pueden verificar y probar una vez desplegado el código en el entorno de destino.

5. **Sin Dependencias Bloqueantes Externas**:
   - [x] El equipo comprende el requerimiento, no existen bloqueos externos de diseño/infraestructura y existe un entendimiento compartido de cómo se verificará la historia.
