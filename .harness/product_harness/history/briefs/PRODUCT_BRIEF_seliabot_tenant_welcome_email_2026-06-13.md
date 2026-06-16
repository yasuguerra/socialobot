# Product Brief: Mejora de la Experiencia de Registro y Bienvenida de Tenants

## METADATA

```text
Feature: Correo de Bienvenida Localizado y Registro de Idioma
Venture: Seliabot
Handoff Date: 2026-06-13
PM: PM (Product Manager)
Recipient (Engineering): Chief Architect (Martin Fowler) & CTO (Demis Hassabis)
Target Sprint / Cycle: Ciclo de Onboarding Premium
```

---

## 1. RESUMEN EJECUTIVO
Este desarrollo mejora drásticamente la primera impresión que tienen los nuevos tenants de Seliabot al registrarse. Traducimos, localizamos y rediseñamos el flujo de bienvenida para soportar español e inglés (por defecto español). El correo de bienvenida y verificación pasa de ser un texto plano rústico en inglés a una plantilla HTML moderna y bilingüe con una guía de onboarding clara para dar confianza e impulsar el éxito del tenant. Además, el agente del tenant se configurará automáticamente con su idioma preferido al crearse.

---

## 2. DOCUMENTOS ADJUNTOS

| Documento | Ubicación del Archivo | Estado |
|---|---|---|
| Complete PRD | [PRD_seliabot_tenant_welcome_email_2026-06-13.md](PRD_seliabot_tenant_welcome_email_2026-06-13.md) | ✅ Approved by CPO |
| Guía de Configuración SMTP | [docs/SMTP_OUTLOOK_SETUP.md](docs/SMTP_OUTLOOK_SETUP.md) | ✅ Reference guide |

---

## 3. USER STORY

```text
Como dueño de negocio registrado (Tenant Owner),
Quiero recibir un correo de bienvenida profesional y bien diseñado en mi propio idioma (Español o Inglés),
Para verificar mi cuenta con confianza y entender de inmediato los siguientes pasos para activar mi agente de ventas de IA.
```

---

## 4. CRITERIOS DE ACEPTACIÓN FUNCIONALES

- [ ] **Esquema de API Extendido**: La API en [platform-api/src/api/routes/auth.ts](platform-api/src/api/routes/auth.ts) valida y procesa el parámetro `language`.
- [ ] **Configuración de Idioma de Agente**: Al registrarse, el idioma predeterminado de su agente de IA se graba como el idioma seleccionado (`language`) en la base de datos en [platform-api/src/services/authService.ts](platform-api/src/services/authService.ts).
- [ ] **Plantilla HTML Bilingüe y Profesional**: El método `sendWelcome` de [platform-api/src/services/emailService.ts](platform-api/src/services/emailService.ts) despacha correos bien diseñados, con botones accesibles, en español o inglés según corresponda.
- [ ] **Reenvío Localizado**: El reenvío de correos transaccionales de verificación utiliza el idioma configurado para el tenant.
- [ ] **Manejo No Bloqueante**: Si la entrega de correo falla por razones del servidor SMTP de destino, el registro sigue completándose de forma exitosa y se registran logs correspondientes en el sistema.

---

## 5. ALCANCE — Qué está incluido y qué NO

**Incluye:**
- Parámetro `language` en la petición de registro de API.
- Plantilla de correo `sendWelcome` adaptada y localizada en español e inglés.
- Soporte en `resendVerification` para despachar el correo en el idioma que tiene configurado el agente del tenant en la base de datos.
- Rediseño estético y de copy del correo de bienvenida para generar alta confianza institucional.

**NO incluye:**
- Panel de edición o plantillas de correo personalizables por el cliente.
- Automatizaciones de marketing masivas o correos tipo newsletters.

---

## 6. FLUJO DEL USUARIO

1. **Registro**: El usuario ingresa a la pantalla de registro, completa sus datos e implícitamente o explícitamente se envía el idioma de preferencia (`language`).
2. **Creación**: El backend procesa el registro, asigna el idioma al agente inicial en la tabla `agent_configs`, y genera el token.
3. **Despacho**: Se renderiza el correo HTML en el idioma seleccionado del usuario con el nuevo diseño institucional.
4. **Verificación**: El usuario hace clic en el enlace, es dirigido al dashboard web y se activa el agente que estará inicialmente pre-configurado en su idioma preferido.

---

## 7. UX WRITING — Copias Requeridas

### A. Versión en Español (Default)
* **Asunto**: `¡Te damos la bienvenida a Seliabot! 👋 Confirma tu correo`
* **Título**: `¡Hola, {name}! 👋`
* **Subtítulo/Cuerpo**: 
  * `Tu cuenta para la empresa **{businessName}** está casi lista.`
  * `Para activar tu agente de ventas con Inteligencia Artificial y comenzar a responder tus mensajes en piloto automático, por favor confirma tu correo electrónico:`
* **Texto del Botón CTA**: `Confirmar mi correo electrónico →`
* **Próximos Pasos (Onboarding de Confianza)**:
  * `1. **Verifica tu cuenta**: Haz clic en el botón de arriba.`
  * `2. **Conecta tu WhatsApp**: Vincula tu línea en la sección de Canales del Panel.`
  * `3. **Carga tus Productos o Servicios**: Sube tu catálogo para que tu agente pueda vender.`
* **Pie de página**: `Si tienes alguna duda o necesitas ayuda para conectar tu WhatsApp, escríbenos directamente por nuestro WhatsApp de Soporte haciendo clic aquí.`

### B. Versión en Inglés
* **Asunto**: `Welcome to Seliabot! 👋 Verify your email`
* **Título**: `Welcome, {name}! 👋`
* **Subtítulo/Cuerpo**:
  * `Your account for **{businessName}** is almost ready.`
  * `To activate your AI sales agent and start closing sales on autopilot, please verify your email address:`
* **Texto del Botón CTA**: `Verify my email address →`
* **Próximos Pasos (Onboarding de Confianza)**:
  * `1. **Verify your account**: Click the button above.`
  * `2. **Connect WhatsApp**: Link your phone number in the Channels tab.`
  * `3. **Upload Products or Services**: Add your catalog so your AI agent can sell.`
* **Pie de página**: `If you have any questions or need help setting up WhatsApp, reach out to our Support WhatsApp by clicking here.`

---

## 8. DEPENDENCIAS
| Dependencia | Estado | Propietario |
|---|---|---|
| Configuración SMTP de Outlook | Listo para configurar (según [docs/SMTP_OUTLOOK_SETUP.md](docs/SMTP_OUTLOOK_SETUP.md)) | DevOps / CTO |

---

## 9. FIRMA DE ENTREGA (HANDOFF)

```text
PM (delivery): PM (Product Manager)          Date: 2026-06-13
Chief Architect (reception):                 Date: 2026-06-13
```
