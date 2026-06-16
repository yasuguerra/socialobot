# WORKFLOW: LANZAMIENTO DE CAMPAÑA DE PAGO
# Usar para: Lanzamientos de campañas en Meta Ads (Facebook/Instagram) o Google Ads.
# Tiempo estimado: de 3 a 7 días de planificación, estructuración y diseño antes de publicar.

---

## DIAGRAMA DE FLUJO DE LA CAMPAÑA

```
      Usuario solicita nueva campaña (ej. Promover Eventos)
                               ↓
          [Director] Define objetivos, KPIs y presupuesto
                               ↓
       [SEO + SEM] Keyword Research + Definición de audiencias
                               ↓
             [Content Manager] Redacta textos/copys de anuncios
                               ↓
         [Diseñador] Crea banners, creativos y adaptaciones
                               ↓
            [SEM/Trafficker] Integra todo en 'campaign_brief.md'
                               ↓
           [Director] Revisa e incluye en el acta de aprobación
                               ↓
                ¿Todo el equipo aprueba copys/artes?
                ↙                                   ↘
               No                                    Sí
               ↓                                     ↓
        Iterar propuesta                    [Director] Presenta
                                             plan y artes al usuario
                                                     ↓
                                             ¿Usuario aprueba?
                                            ↙                 ↘
                                           No                  Sí
                                           ↓                    ↓
                                        Iterar         [SEM] Configura
                                                       píxel y monta
                                                       campaña en borrador
                                                                ↓
                                                       [Director] Valida
                                                       vista previa de anuncios
                                                                ↓
                                                       Lanzamiento de campaña
                                                       (Puesta en marcha)
                                                                ↓
                                                       [SEM] Optimización
                                                       diaria de conversiones
                                                                ↓
                                                       Generación de reporte
                                                       'sem_performance.md'
```

---

## PASO 1 — RECEPCIÓN Y ESTRATEGIA INICIAL

**Rol activo: Digital Marketing Manager / Director**
**Cargar: `roles/director.md` + `company_context.md` + `conflict_resolution.md`**

```
1. El Director recibe el requerimiento de negocio del usuario (ej. "quiero alquilar más el salón de eventos de El Tercer Lugar").
2. El Director traduce ese requerimiento en objetivos específicos de marketing:
   - ¿A qué Buyer Persona nos dirigimos en esta campaña?
   - ¿Qué presupuesto asignaremos? (ej. $300 USD Meta Ads)
   - ¿Qué canales usaremos? (ej. Instagram Stories & Feed)
   - ¿Cuáles son los KPIs clave y coste por lead (CPL) objetivo? (ej. conseguir 40 leads calificados a $7.50 USD cada uno)
3. El Director convoca al Especialista SEM (Trafficker), al Content Manager y al Diseñador.
```

**Output requerido:** Brief estratégico conceptual aclarado para el equipo de producción.

---

## PASO 2 — PLANIFICACIÓN TÁCTICA Y CREATIVA

**Roles activos: Especialista SEM + Content Manager + Diseñador Gráfico**
**Cargar: `roles/sem_specialist.md` + `roles/content_manager.md` + `roles/designer.md` + `company_context.md`**

```
1. El Especialista SEM estructura el esqueleto técnico de la campaña:
   - Selección de públicos (demografía, intereses acotados).
   - Estructura de embudo de remarketing (si aplica).
   - Configuración de eventos de conversión en la landing page.

2. El Content Manager escribe los textos de los anuncios (Ad Copys):
   - Redacta titulares enganchadores (Hooks).
   - Redacta los textos del cuerpo del anuncio (Body Copy).
   - Define el llamado a la acción (CTA) y aporta sugerencias creativas para la imagen/video.

3. El Diseñador Gráfico toma las instrucciones del Content Manager y diseña las creatividades:
   - Produce los banners de campaña en los formatos requeridos (1:1 y 9:16).
   - Asegura consistencia de marca y legibilidad en pantallas móviles.

4. El Especialista SEM compila todo en un borrador unificado dentro del archivo `.harness_marketing/campaigns/campaign_brief.md`.
```

**Output requerido:** Archivo `.harness_marketing/campaigns/campaign_brief.md` completo con copys y enlaces a diseños.

---

## PASO 3 — EVALUACIÓN INTERNA Y VETO DE CALIDAD

**Roles activos: Todos los especialistas liderados por el Director**
**Cargar: `roles/director.md` + `conflict_resolution.md`**

```
1. El Director de Marketing revisa el 'campaign_brief.md'.
2. Se verifica que se cumpla la jerarquía de veto de calidad:
   - ¿El Diseñador aprueba el uso final de las creatividades?
   - ¿El Content Manager valida la ortografía y el tono de voz en los textos de los anuncios?
   - ¿El Especialista SEM garantiza que el diseño no infringe las políticas de anuncios de Meta/Google?
3. Si algún especialista activa su veto de calidad, se frena la presentación y se itera en el Paso 2.
4. Si todo el equipo da luz verde, el Director genera el borrador de 'director_approval.md' (sin firmar formalmente).
```

---

## PASO 4 — PRESENTACIÓN Y APROBACIÓN DEL CLIENTE

**Rol activo: Digital Marketing Manager / Director**
**Cargar: `roles/director.md`**

```
1. El Director presenta el plan detallado y las creatividades visuales al usuario (el cliente) en un formato comprensible.
2. El Director explica la justificación estratégica de las audiencias elegidas, el presupuesto sugerido y los costos estimados.
3. ⛔ STOP — ESPERAR APROBACIÓN EXPLÍCITA DEL USUARIO.
4. Si el usuario solicita modificaciones (ej. cambiar una foto o ajustar el copy) → el equipo regresa al Paso 2 y se itera.
5. Si el usuario aprueba → continuar al Paso 5.
```

**❌ Bajo ninguna circunstancia se inyecta presupuesto ni se activa la campaña en las plataformas sin la autorización explícita del usuario.**

---

## PASO 5 — CONFIGURACIÓN TÉCNICA E IMPLEMENTACIÓN (En Borrador)

**Rol activo: Especialista SEM / Trafficker Digital**
**Cargar: `roles/sem_specialist.md` + `company_context.md`**

```
1. El Trafficker Digital accede a la plataforma de anuncios (ej. Meta Ads Manager, Google Ads).
2. Sube y configura las audiencias, el presupuesto diario y las pujas autorizadas.
3. Sube las piezas visuales aprobadas y asocia los copys de texto exactos validados por el Content Manager.
4. Configura el enlace de destino con etiquetas UTM de seguimiento para medir en Google Analytics 4.
5. Guarda la campaña en modo BING / BORRADOR (Draft). NO se publica todavía.
```

---

## PASO 6 — AUDITORÍA FINAL Y FIRMA DE LANZAMIENTO

**Rol activo: Digital Marketing Manager / Director**
**Cargar: `roles/director.md`**

```
1. El Director de Marketing realiza una inspección final de la campaña configurada en borrador (vistas previas de los anuncios).
2. Valida que no haya errores de formato y que el píxel de seguimiento esté respondiendo correctamente.
3. Firma y publica oficialmente en `.harness_marketing/reports/director_approval.md` con estado APROBADO.
4. El Trafficker activa oficialmente la campaña (Publish) en las plataformas de anuncios.
```

**Output requerido:** Archivo `.harness_marketing/reports/director_approval.md` guardado con estado "APROBADO".

---

## PASO 7 — MONITOREO DIARIO, OPTIMIZACIÓN Y REPORTE

**Roles activos: Especialista SEM + Community Manager**
**Cargar: `roles/sem_specialist.md` + `roles/community_manager.md`**

```
1. El Especialista SEM monitorea diariamente el rendimiento (CTR, CPC, CPA, Gasto) para optimizar el presupuesto.
2. El Community Manager modera y responde las dudas de los clientes en los comentarios de los anuncios pagados de forma inmediata (Paso crítico para no desperdiciar leads).
3. Tras finalizar la primera semana de campaña, el Especialista SEM genera el informe 'sem_performance.md'.
```

**Output requerido:** `.harness_marketing/reports/sem_performance.md` con métricas de conversión y recomendaciones.
