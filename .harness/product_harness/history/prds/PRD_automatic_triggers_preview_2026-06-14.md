# PRD: Vista Previa de Mensajes en Automatic Triggers

## METADATA
Feature: Vista Previa de Mensajes en Automatic Triggers
Venture: Seliabot
Date Created: 2026-06-14
PM Owner: PM (Product Manager)
ICE Score: 87 (Impact: 8, Confidence: 10, Ease: 9)
Status: [ ] Draft  [ ] Under Review  [x] Approved by CPO

---

## 1. CONTEXTO — ¿Por qué importa esto ahora?
Seliabot permite a los tenants configurar "Automatic Triggers" (Disparadores Automáticos) que reaccionan a señales del negocio (como carritos abandonados, leads atascados, o nuevas conversaciones inactivas) y encolan automáticamente una secuencia de seguimiento ("Follow-Up Sequence"). Sin embargo, en la sección de "Automatic Triggers" dentro de la configuración actual, los tenants solo ven el nombre de la secuencia (ej. "Cotización Pendiente"), pero no tienen manera de verificar cuál es el contenido exacto de los mensajes o pasos que esa secuencia va a disparar automáticamente a sus clientes finales, lo que genera desconfianza y falta de visibilidad en las operaciones automatizadas de su negocio.

---

## 2. PROBLEMA
**El problema en términos del usuario:**
Como tenant, cuando configuro un disparador automático que enviará mensajes a mis clientes sin mi intervención manual directa, me siento inseguro porque no puedo previsualizar el mensaje exacto que se enviará en cada paso desde la misma tabla de disparadores. Tengo que desplazarme hacia arriba, buscar la secuencia correspondiente, y abrir su previsualización individual, lo cual arruina la usabilidad y la agilidad de auditoría de mi negocio.

**Evidencia del problema:**
Feedback de múltiples tenants de que no logran "ver qué mensaje se envía automáticamente a sus clientes" desde la tabla de Triggers, asumiendo erróneamente que la funcionalidad no existe o que requiere un esfuerzo técnico excesivo para ser auditada.

**¿A quién afecta?**
Afecta a todos los tenants activos de Seliabot que utilizan o desean implementar disparadores automáticos para automatizar sus flujos de ventas y reactivación.

---

## 3. USUARIO OBJETIVO
**Perfil:**
Dueño de Negocio o Administrador de Operaciones (Tenant Owner) que busca máxima visibilidad y control de calidad sobre las comunicaciones automatizadas enviadas en nombre de su marca.

---

## 4. USER STORY
```text
Como dueño de negocio (Tenant Owner),
Quiero poder previsualizar los pasos y mensajes de una secuencia de seguimiento directamente desde la tabla de Automatic Triggers,
Para tener la certeza absoluta de qué mensajes se enviarán automáticamente a mis clientes según el trigger activado.
```

---

## 5. CRITERIOS DE ACEPTACIÓN FUNCIONALES

- [x] **Acción de Vista Previa Reusable**: En la tabla de "Automatic Triggers" (ubicada en [platform-dashboard/src/pages/Settings.tsx](platform-dashboard/src/pages/Settings.tsx)), se debe incorporar una nueva acción/botón de "👁 Preview" junto al botón de eliminar (`🗑️`) para cada trigger configurado.
- [x] **Reutilización del Modal Existente**: Al hacer clic en el botón "👁 Preview" del trigger, se debe llamar al método existente `openPreview(t.sequence_id)` utilizando el ID de la secuencia asociada a dicho trigger. Esto desplegará el modal de previsualización estándar que renderiza dinámicamente los pasos con variables IA sin alterar el estado actual de la página.
- [x] **Resiliencia ante Secuencias Inexistentes**: Si el disparador por alguna razón está asociado a una secuencia inexistente (huérfano), el botón "👁 Preview" debe mostrarse deshabilitado y opaco, evitando fallos de ejecución.
- [x] **Mapeo de Estilos Consistente**: El botón de vista previa debe tener el mismo diseño visual, fuentes y padding que los botones de acción del resto de la página (`btn btn-sm` con borde estándar y tamaño de letra 11).

---

## 6. LÍMITES DE ALCANCE — Qué NO incluye esta funcionalidad
- NO incluye la edición de los pasos de la secuencia desde este modal (la edición de pasos se mantiene centralizada en la tabla superior mediante el botón "📋 Steps").
- NO incluye un envío de prueba directo desde la tabla de triggers (los envíos de prueba de secuencia se realizan desde la sección de secuencias para mantener la consistencia de parámetros).

---

## 7. FLUJO PROPUESTO (Nivel Alto)
1. El usuario navega a la sección de "Automatic Triggers" en la pestaña de configuración.
2. Encuentra la lista de triggers activos e inactivos.
3. Al lado del botón eliminar (`🗑️`), hace clic en el nuevo botón `👁 Preview`.
4. El sistema abre el modal centralizado `👁 Preview Follow-Up` cargado con la secuencia seleccionada.
5. El tenant puede ver los pasos de la secuencia, ingresar un teléfono/lead opcional para probar el renderizado de variables IA, y verificar con total tranquilidad el mensaje exacto.
6. Cierra el modal y regresa a su flujo de trabajo en la misma sección sin interrupciones.

---

## 8. DEPENDENCIAS
| Dependencia | Tipo | Estado |
|---|---|---|
| Modal de Previsualización (`openPreview`) | Frontend | Ya implementado y funcional en [platform-dashboard/src/pages/Settings.tsx](platform-dashboard/src/pages/Settings.tsx) |

---

## 9. Métrica de Éxito
**KPI Primario:**
* Reducir las consultas de soporte de tenants sobre "qué mensaje envía el bot automáticamente" a cero.
* Incrementar el ratio de activación y confianza en el uso de disparadores automáticos por parte de nuevos tenants en un 30%.

---

## 10. APROBACIONES
```text
PM Owner: PM (Product Manager)               Date: 2026-06-14
CPO Approval: [ ]                             Date: 2026-06-14
```
