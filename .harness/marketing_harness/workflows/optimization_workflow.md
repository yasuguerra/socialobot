# WORKFLOW: AUDITORÍA Y OPTIMIZACIÓN DE CANALES (CRO)
# Usar para: Revisiones periódicas mensuales, caídas de conversión, auditorías de SEO o re-ajuste de embudos de venta (CRO: Conversion Rate Optimization).
# Tiempo estimado: de 3 a 5 días para diagnosticar, planear e implementar cambios tácticos.

---

## DIAGRAMA DE FLUJO DE OPTIMIZACIÓN

```
                Reunión Mensual de Rendimiento o Alerta de Caída
                                       ↓
                [Director] Convoca al equipo para diagnóstico
                                       ↓
         ¿Qué canal presenta problemas o requiere optimización?
             ↙                         ↓                         ↘
     [SEO Specialist]           [Trafficker SEM]           [Social Media Manager]
    Audita Google Search       Audita conversiones,       Audita tasa de engagement,
    Console, sitemaps,         audiencias y gasto de      alcance y flujo de DMs.
    ranks y site speed         anuncios en Meta/Google.              ↓
             ↓                         ↓                   Genera reporte cualitativo
     Genera 'seo_audit.md'     Genera 'sem_performance.md'           ↓
             ↘                         ↓                         ↙
                 [Content + Diseñador] Proponen mejoras de copy,
                 maquetación visual y flujo de conversión (CRO)
                                       ↓
                  [Director] Reúne optimizaciones y compila
                             plan de acción unificado
                                       ↓
                  ⛔ STOP — Esperar aprobación del usuario
                                       ↓
                                ¿Aprobado?
                               ↙          ↘
                              No           Sí
                              ↓             ↓
                           Iterar    [Especialistas] Aplican optimizaciones:
                                     - Ajustes de puja, segmentación (SEM)
                                     - Cambios de copy o metadata (Content/SEO)
                                     - Nuevos banners optimizados (Diseño)
                                            ↓
                                     [Director] Firma y valida cambios
                                            ↓
                                     Monitoreo a 14 días
                                     (Medir impacto de optimización)
```

---

## PASO 1 — DETECCIÓN Y CONVOCATORIA DE OPTIMIZACIÓN

**Rol activo: Digital Marketing Manager / Director**
**Cargar: `roles/director.md` + `company_context.md`**

```
1. El Director de Marketing realiza una evaluación periódica de los resultados o detecta un cuello de botella urgente (ej. "el tráfico de la web sube, pero nadie hace clic para reservar por WhatsApp").
2. El Director convoca a una sesión extraordinaria de optimización de tasa de conversión (CRO) a todo el equipo.
3. Se definen las metas prioritarias de la auditoría:
   - Reducir el Coste por Lead (CPL) de eventos.
   - Corregir pérdida de tráfico orgánico en una página clave.
   - Reactivar el engagement decaído de Instagram.
```

**Output requerido:** Objetivos claros de optimización y responsabilidades de diagnóstico asignadas.

---

## PASO 2 — AUDITORÍA Y DIAGNÓSTICO INDEPENDIENTE (Por Canal)

**Roles activos: Especialista SEO + Especialista SEM + SMM + Community Manager**
**Cargar: Roles correspondientes + `company_context.md`**

```
1. El Especialista SEO audita la web:
   - Inspecciona Search Console para detectar caídas de impresiones.
   - Revisa velocidad de carga (Core Web Vitals) en dispositivos móviles.
   - Genera el informe técnico: `.harness_marketing/reports/seo_audit.md`.

2. El Especialista SEM audita las cuentas publicitarias:
   - Detecta anuncios con CTR menor al 1% o frecuencia mayor a 4 (fatiga de creatividades).
   - Analiza el costo de adquisición (CAC) y desactiva palabras clave de alto costo sin conversiones.
   - Genera el informe financiero: `.harness_marketing/reports/sem_performance.md`.

3. El Social Media Manager & Community Manager auditan las redes:
   - Miden el engagement orgánico del mes e identifican qué contenidos pasaron desapercibidos.
   - Analizan el flujo de mensajes directos (DMs) para ver en qué parte del guión de ventas se pierden los prospectos.
   - Generan las notas de comunidad.
```

**Outputs requeridos:** Informes `seo_audit.md` y `sem_performance.md` actualizados y con diagnósticos precisos.

---

## PASO 3 — DISEÑO DEL PLAN DE ACCIÓN CREATIVO Y DE CONVERSIÓN (CRO)

**Roles activos: Content Manager + Diseñador Gráfico liderados por el Director**
**Cargar: `roles/content_manager.md` + `roles/designer.md` + `roles/director.md` + `conflict_resolution.md`**

```
1. El Content Manager propone optimizaciones en el mensaje:
   - Re-escribir títulos de anuncios o títulos SEO de la web para hacerlos más persuasivos.
   - Simplificar los textos de la landing page para eliminar fricción de lectura.
   - Desarrollar nuevos guiones de ventas más directos para las respuestas de DMs.

2. El Diseñador Gráfico propone optimizaciones visuales:
   - Diseñar variaciones de banners para reemplazar los anuncios fatigados de SEM.
   - Optimizar el contraste, tamaño de botones de llamado a la acción (CTA) y distribución visual de la web para teléfonos móviles.

3. El Director consolida todas estas tácticas de optimización en una propuesta estructurada.
```

---

## PASO 4 — PRESENTACIÓN DE OPTIMIZACIONES AL USUARIO

**Rol activo: Digital Marketing Manager / Director**
**Cargar: `roles/director.md`**

```
1. El Director presenta el diagnóstico del problema detectado y el plan de optimización de conversión al usuario.
2. Explica la relación causa-efecto: (ej. "el menú digital móvil tardaba 5 segundos en cargar por el peso de las fotos de stock; el Diseñador las ha comprimido a WebP y el SEO resolvió la caché. Esto bajará el rebote y subirá las visitas en sitio").
3. ⛔ STOP — ESPERAR APROBACIÓN EXPLÍCITA DEL USUARIO.
4. Si el usuario aprueba → continuar al Paso 5.
```

---

## PASO 5 — IMPLEMENTACIÓN DE CAMBIOS DE OPTIMIZACIÓN

**Roles activos: Especialistas Técnicos (SEM / SEO / Diseñador / SMM)**
**Cargar: Roles correspondientes + `conflict_resolution.md`**

```
1. El Especialista SEM edita las campañas: pausa anuncios ineficientes, agrega las nuevas variaciones de creativos y ajusta pujas.
2. El Especialista SEO y el Desarrollador aplican los cambios de metatítulos, velocidad, compresión y UX en el código de la web.
3. El Content Manager y el SMM actualizan el tono o las pautas de captación en stories de redes sociales.
4. El Community Manager adopta los nuevos guiones simplificados para responder DMs.
```

---

## PASO 6 — CONTROL Y MEDICIÓN A 14 DÍAS (Post-Optimización)

**Roles activos: Todo el equipo**
**Cargar: `roles/director.md` + `company_context.md`**

```
1. Durante las siguientes dos semanas, el equipo monitorea de cerca las métricas clave modificadas.
2. Se evalúa el impacto directo de la optimización:
   - ¿Aumentó la tasa de conversión global del sitio?
   - ¿Disminuyó el costo por lead (CPL) de las campañas de pago?
   - ¿Aumentó el tiempo de permanencia en la página web?
3. El Director documenta los resultados del experimento en `director_approval.md` para cerrar el ciclo de aprendizaje.
```
