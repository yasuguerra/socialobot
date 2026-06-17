# PRD: Mejora de la Experiencia de Registro y Bienvenida de Tenants

## METADATA
Feature: Correo de Bienvenida Localizado y Registro de Idioma
Venture: Socialobot
Date Created: 2026-06-13
PM Owner: PM (Product Manager)
ICE Score: 85 (Impact: 9, Confidence: 8, Ease: 8)
Status: [ ] Draft  [x] Under Review  [ ] Approved by CPO

---

## 1. CONTEXTO — ¿Por qué importa esto ahora?
Actualmente, Socialobot cuenta con una experiencia de bienvenida minimalista y rígida en inglés. El correo de bienvenida y verificación se despacha únicamente en inglés utilizando una plantilla visualmente rústica que no refleja la calidad premium de Socialobot. Dado que nuestro foco principal es el crecimiento de la plataforma en mercados hispanohablantes (Latinoamérica y España), es prioritario localizar la experiencia del primer contacto del tenant y dotarle de un correo cálido, profesional y accionable que impulse la confianza en nuestra tecnología.

---

## 2. PROBLEMA
**El problema en términos del usuario:**
Cuando me registro como tenant en Socialobot, el correo que recibo para verificar mi cuenta y darme la bienvenida está en inglés, carece de un diseño institucional que me dé confianza, y no me indica cuáles son los siguientes pasos que debo tomar para configurar mi agente de IA, lo que me genera incertidumbre y puede provocar que abandone la plataforma en los primeros minutos.

**Evidencia del problema:**
Múltiples registros en LATAM no completan la verificación de su correo o tardan más de 24 horas en hacerlo. El feedback de nuestros primeros tenants es que el correo de verificación parecía genérico o automatizado de una plataforma ajena a su idioma.

**¿A quién afecta?**
Afecta a todos los nuevos tenants registrados en la plataforma. Principalmente a dueños de negocios e integradores de habla hispana en LATAM y España.

---

## 3. USUARIO OBJETIVO
**Perfil:**
Dueño de Negocio o Administrador de Operaciones (Tenant Owner) que busca implementar un agente de ventas con inteligencia artificial en su negocio para automatizar la atención al cliente en canales de mensajería (WhatsApp).

**Contexto de uso:**
Se acaba de registrar a través de la plataforma web en su computadora o dispositivo móvil, con la expectativa de activar y probar su bot de ventas rápidamente. Recibe el correo en su bandeja de entrada principal.

**Qué quiere lograr:**
Verificar su cuenta de manera segura, sentir que Socialobot es una plataforma seria y profesional, y saber exactamente cómo poner en marcha su agente de inteligencia artificial.

---

## 4. USER STORY
```text
Como dueño de negocio registrado (Tenant Owner),
Quiero recibir un correo de bienvenida profesional y bien diseñado en mi propio idioma (Español o Inglés),
Para verificar mi cuenta con confianza y entender de inmediato los siguientes pasos para activar mi agente de ventas de IA.
```

---

## 5. CRITERIOS DE ACEPTACIÓN FUNCIONALES

- [ ] **Soporte de Idioma en Registro**: La API de registro en [platform-api/src/api/routes/auth.ts](platform-api/src/api/routes/auth.ts) debe aceptar un parámetro opcional `language` (ej. `'es'`, `'en'`). Si no se provee, por defecto se asumirá `'es'` (Español).
- [ ] **Configuración Inicial del Agente**: El idioma del agente de inteligencia artificial que se crea por defecto durante el registro en [platform-api/src/services/authService.ts](platform-api/src/services/authService.ts) debe configurarse con el idioma preferido del tenant (`language`), en lugar de estar predeterminado en inglés (`en`).
- [ ] **Plantilla de Correo de Bienvenida Rediseñada y Localizada**: El servicio de correo en [platform-api/src/services/emailService.ts](platform-api/src/services/emailService.ts) debe renderizar una plantilla HTML moderna, con soporte para español e inglés:
  * El diseño debe ser limpio, con botones claros, tipografía moderna, logo y pie de página institucional.
  * Debe incluir una sección clara de "Próximos Pasos" para guiar al tenant en su onboarding.
  * Debe incluir un enlace de soporte directo.
- [ ] **Manejo del Flujo de Reenvío**: Cuando se reenvía el correo de verificación a través de la ruta `/api/auth/resend-verification` en [platform-api/src/services/authService.ts](platform-api/src/services/authService.ts), se debe detectar el idioma del agente del tenant para enviar el correo en el idioma correcto.
- [ ] **Robustez ante Errores**: El proceso de registro no debe interrumpirse si el envío del correo de bienvenida llegase a fallar de forma temporal (comportamiento no bloqueante actual con captura de logs de error).

---

## 6. LÍMITES DE ALCANCE — Qué NO incluye esta funcionalidad
- NO incluye un panel interactivo de personalización de correos transaccionales para el tenant (los inquilinos no pueden editar el diseño de estos correos en esta fase).
- NO incluye correos de marketing masivo, newsletters o campañas automatizadas (eso pertenece a un sistema externo o futura fase).
- NO incluye integraciones directas con SDK de terceros de correo fuera de Nodemailer SMTP configurado (la migración a Resend SDK o Mailgun SDK queda fuera de este alcance; nos basamos en Nodemailer SMTP).

---

## 7. FLUJO PROPUESTO (Nivel Alto)
1. El usuario completa el formulario de registro en la landing-page o el dashboard, enviando sus datos junto con el idioma detectado de su navegador o selección manual (`language`).
2. La API procesa el registro, crea el tenant y el usuario dueño.
3. El agente de IA inicial se inicializa con el idioma correspondiente en la tabla `agent_configs`.
4. El backend genera el token de verificación y llama al método `sendWelcome` del servicio de correo pasándole el idioma preferido.
5. El tenant recibe en su bandeja de entrada el correo con un diseño premium y adaptado a su idioma.
6. Al dar clic en "Verificar mi correo", es redirigido al dashboard para completar su onboarding guiado con los pasos que ya leyó en su correo.

---

## 8. DEPENDENCIAS
| Dependencia | Tipo | Estado |
|---|---|---|
| Servidor SMTP de Outlook (`info@socialobot.com`) | Técnica | Configurado (se requiere validación en prod según [docs/SMTP_OUTLOOK_SETUP.md](docs/SMTP_OUTLOOK_SETUP.md)) |

---

## 9. Métrica de Éxito
**KPI Primario:**
* Aumentar la tasa de conversión de registro a verificación completada de un 65% a un 85% en los primeros 14 días de implementación.
* Reducir el tiempo promedio de verificación del correo a menos de 5 minutos desde el registro.

**Cómo se mide:**
Eventos de base de datos (`users.is_verified` y marcas temporales de creación vs verificación).

---

## 10. APROBACIONES
```text
PM Owner: PM (Product Manager)               Date: 2026-06-13
CPO Owner: CPO (Steve)                      Date: 2026-06-13
```
