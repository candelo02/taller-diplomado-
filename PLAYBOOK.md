# 📖 Scrum + Trunk-Based Development (TBD) & Continuous Deployment Playbook

Este artefacto vivo documenta los acuerdos del equipo, adaptación de roles, ceremonias, sliceado vertical y reglas de oro para mantener la rama `main` siempre verde y desplegable (Integración de Talleres 1, 2 y 5).

---

## 👥 1. Adaptación de Roles Scrum a TBD + CD (Taller 1)

| Rol | Adaptación Operativa TBD + CD |
| :--- | :--- |
| **Product Owner (PO)** | Prioriza por valor, riesgo de despliegue y tamaño reducido del batch. Decide la activación de Feature Toggles y participa en el sliceado vertical. |
| **Developers** | Responsabilidad colectiva de mantener `main` verde y releasable en todo momento. Integraciones diarias (≤ 1 día de vida por rama). Ownership del pipeline CI/CD. |
| **Scrum Master (SM)** | Facilita la disciplina de integración diaria. Elimina el miedo a romper `main` mediante redes de seguridad (CI). Protege tiempo para refactorización del pipeline. |

---

## 🔄 2. Adaptación de Ceremonias y Artefactos (Taller 1 & 2)

- **Product Backlog**: Historias sliceadas en incrementos verticales + plan de Feature Toggle + AC validables en producción.
- **Sprint Backlog**: Incrementos pequeños planeados para integrarse diariamente a `main`.
- **Incremento**: Cualquier commit en `main` que supere la suite de pruebas CI se considera un incremento potencialmente desplegable.
- **Daily Scrum**: Pregunta clave: *"¿Qué voy a integrar hoy a `main` y qué necesito para que la integración sea segura?"*
- **Sprint Review**: Demostración de lo que ya está en producción (o listo detrás de toggle) con feedback real.
- **Sprint Retrospective**: Enfoque continuo en mejorar el flujo de valor, la salud del pipeline y la disciplina de TBD.

---

## ✂️ 3. Reglas de Sliceado Vertical & DoR (Taller 2)

Para garantizar integraciones diarias sin romper el sistema:
1. **Slice por Operación (CRUD)**: Dividir en Create, Read, Update, Delete.
2. **Slice por Experiencia de Usuario**: Implementar el camino feliz primero y luego casos borde.
3. **Slice por Feature Toggle**: Construir el esqueleto de backend primero y luego la interfaz interactiva.
4. **Cumplimiento de DoR**: Consulta [DoR.md](DoD.md) para los 5 criterios de la Definition of Ready.

---

## 🏆 4. Reglas de Oro de Integración a `main` (Taller 5)

1. **Si el CI está rojo, se detiene todo desarrollo nuevo** hasta restaurar el estado verde.
2. **Ninguna rama de desarrollo debe vivir más de 24 horas**.
3. **Todo cambio desplegado debe tener un Health Check activo en `/healthz`**.
4. **Toda funcionalidad incompleta debe protegerse con un Feature Toggle**.
5. **Cumplimiento de DoD**: Consulta [DoD.md](DoD.md) para la Definition of Done en 3 dimensiones (Técnica, Negocio y Despliegue).
