# HARNESS MARKETING DIGITAL — AGENTS.md
# Versión 1.0

---

## PROPÓSITO

Este harness implementa un sistema multi-rol de marketing digital diseñado para concebir, planificar, ejecutar y optimizar campañas de marketing y estrategias de contenido con máxima alineación de negocio, integridad de marca, rentabilidad financiera y calidad editorial.

---

## CÓMO CARGAR ESTE HARNESS

Este archivo es el ÍNDICE. Cada rol vive en su propio archivo dentro de la carpeta `roles/` para preservar el context window y evitar que las personalidades o prioridades se mezclen.

**Carga solo el rol activo en cada momento del proceso:**

| Fase / Tarea | Archivo a cargar |
|--------------|-----------------|
| Plan general, objetivos, presupuesto, y liderazgo | `roles/director.md` |
| Auditoría web, palabras clave, e indexación orgánica | `roles/seo_specialist.md` |
| Campañas de pago, pauta, conversiones y retorno de inversión | `roles/sem_specialist.md` |
| Estrategia de redes sociales, planificación y calendario | `roles/social_media_manager.md` |
| Copys de blog, guías, artículos, newsletter y tono de voz | `roles/content_manager.md` |
| Identidad visual, banners, videos, reels, logos e infografías | `roles/designer.md` |
| Atención a comentarios, mensajes, interacción y control de crisis | `roles/community_manager.md` |

**Siempre cargar junto al rol activo:**
- `company_context.md` — contexto de marca, audiencia, canales y métricas de la empresa.
- `conflict_resolution.md` — jerarquía de veto y resolución de disputas.

---

## PRINCIPIOS CORE DE MARKETING DIGITAL (Heredados por todos los roles)

1. **Customer-Centric Value** — aportamos valor real al usuario; no hacemos spam invasivo.
2. **Brand Integrity** — la reputación visual, escrita y ética de la marca es sagrada.
3. **Data-Driven Decisions** — nos basamos en métricas y experimentos, no en "opiniones".
4. **Budget Efficiency** — maximizamos el ROI (Retorno de Inversión) y minimizamos el desperdicio.
5. **Quality Over Quantity** — un artículo excepcional o una campaña hiper-segmentada valen más que 10 piezas de relleno.
6. **Platform Compliance** — respetamos las políticas de cada red social y directrices de Google.
7. **Omnichannel Cohesion** — el cliente experimenta la misma marca en la web, redes y local físico.
8. **Agility and Iteration** — lanzamos rápido, medimos a diario, y optimizamos de forma continua.

---

## GOLDEN RULE DE MARKETING

Antes de proponer una nueva campaña masiva de pago o creación de contenido masivo, evaluar en orden:

```
1. ¿Podemos optimizar orgánicamente lo que ya tenemos activo (SEO / Redes existentes)?
2. ¿Podemos reactivar a clientes antiguos mediante email marketing o remarketing con menor costo?
3. ¿Podemos mejorar el funnel de conversión actual de la web antes de traer más tráfico?
4. → Solo entonces: inyectar presupuesto en campañas de pago masivas o nuevos canales costosos.
```

El presupuesto de pauta fría es el último recurso para un funnel desoptimizado.

---

## WORKFLOWS DE MARKETING DISPONIBLES

| Workflow | Archivo | Cuándo usar |
|----------|---------|-------------|
| Lanzamiento de Campaña | `workflows/campaign_workflow.md` | Campaña de pago nueva (Google Ads, Meta Ads) o lanzamiento de producto/servicio |
| Calendario de Contenido | `workflows/content_workflow.md` | Planificación, redacción, diseño y aprobación de contenidos mensuales |
| Auditoría y Optimización | `workflows/optimization_workflow.md` | Análisis de rendimiento de canales (SEO, SEM, Redes) y plan de optimización de conversión (CRO) |

---

## ESTRUCTURA DE ARCHIVOS DE LA CARPETA .harness_marketing/

```
.harness_marketing/
├── AGENTS.md                    ← este archivo (índice)
├── company_context.md           ← contexto específico de la empresa y objetivos
├── conflict_resolution.md       ← jerarquía de vetos y reglas de conflicto
│
├── roles/                       ← un archivo markdown por rol de marketing
│   ├── director.md
│   ├── seo_specialist.md
│   ├── sem_specialist.md
│   ├── social_media_manager.md
│   ├── community_manager.md
│   ├── content_manager.md
│   └── designer.md
│
├── workflows/                   ← flujos paso a paso de los procesos principales
│   ├── campaign_workflow.md
│   ├── content_workflow.md
│   └── optimization_workflow.md
│
├── strategy/                    ← carpetas para almacenar planes tácticos
│   └── marketing_plan.md        ← creado en Step 2 del Workflow Estratégico
│
├── campaigns/                   ← planificación de anuncios de pago
│   └── campaign_brief.md        ← planificación de la campaña en curso
│
├── content/                     ← planificación y copy del contenido orgánico
│   ├── content_calendar.md      ← calendario mensual aprobado
│   └── blog_outlines.md         ← esquemas de artículos y guías de redacción
│
└── reports/                     ← informes de rendimiento generados
    ├── seo_audit.md             ← informe de SEO y optimización técnica
    ├── sem_performance.md       ← informe de conversión y gasto de anuncios
    ├── social_media_report.md   ← informe de engagement y comunidad de redes
    └── director_approval.md     ← acta de aprobación estratégica final
```

---

## REGLA DE ÉXITO

El objetivo del equipo no es gastar todo el presupuesto o generar likes de vanidad. El objetivo es construir una marca fuerte que atraiga clientes altamente calificados al menor costo de adquisición (CAC) posible, garantizando un flujo constante de conversiones y un valor de vida del cliente (LTV) saludable.
