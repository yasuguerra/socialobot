import dotenv from "dotenv";
dotenv.config();

import "../server/admin";
import { saveSocialPost } from "../server/store";
import type { SocialPost } from "../src/types";

async function createInstagramPost() {
  const userId = "oF5XhOnCinhfFy5c8xYm4PbPzbI3"; // UID del bypass de desarrollo local

  // Calcular fecha de programación (5 días en el futuro a las 4:00 PM)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 5);
  scheduledDate.setHours(16, 0, 0, 0);

  const post: SocialPost = {
    id: `post-skyride-${Date.now()}`,
    ideaId: null,
    platform: "Instagram",
    title: "Despega Hacia la Excelencia | Ciudad de Panamá VIP",
    caption: `¿Tu tiempo es tu activo más valioso? Rise above the noise. 🚁✨\n\nCruzar la Ciudad de Panamá en horas pico puede drenar tu energía y costar valiosas horas de tu día. ¿Por qué elegir el asfalto cuando el cielo es tuyo?\n\nCon el Charter Privado VIP de Skyride Panama, transformas el tránsito tedioso en un vuelo escénico impecable. En cuestión de minutos, estarás despegando de los modernos helipuertos de la ciudad con destino directo al Canal de Panamá o hacia las paradisíacas costas caribeñas. 🏝️🇵🇦\n\nEsto no es solo transporte aéreo; es la máxima expresión de eficiencia, prestigio y confort.\n\n💼 El estándar Skyride incluye:\n• Abordaje directo desde nuestra terminal privada VIP.\n• Vuelo panorámico de baja altitud con los pilotos más experimentados del país.\n• Flota equipada con tecnología de punta y rigurosos protocolos internacionales de seguridad.\n• Conserjería exclusiva 24/7 adaptada a tu agenda corporativa o personal.\n\nNo solo llegues a tu destino, redefine la forma en que viajas.\n\n📥 Escríbenos por mensaje privado (DM) con la palabra "SKY" o haz clic en el enlace de nuestra biografía para coordinar tu próximo charter privado. 📲\n\n---\n#SkyridePanama #LuxuryTravelPanama #HelicopterCharter #VIPAviation #PanamaCanal #PrivateCharter #AviationExperience #VisitPanama #EstiloVIP`,
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-helicopter-taking-off-from-a-helipad-43090-large.mp4",
    promptUsed: "Cinematic video of a modern orange-accented luxury helicopter taking off smoothly from a high-rise city helipad, warm sunlight illuminating the city, crisp 4k drone footage.",
    scheduledTime: scheduledDate.toISOString(),
    status: "Draft",
    viralScore: 97,
    viralMetrics: {
      hook: 98,
      trend: 95,
      shareability: 96,
      visualImpact: 98,
      callToAction: 96
    },
    viralFeedback: "¡Excelente gancho orientado a la eficiencia del tiempo! El contraste entre el congestionamiento urbano y la libertad del helipuerto VIP resuena profundamente con audiencias corporativas de alto nivel adquisitivo. Tip: Publica esto los jueves o viernes por la tarde cuando los ejecutivos planifican su fin de semana.",
    audienceSegment: "Ejecutivos de alta dirección, empresarios y viajeros VIP internacionales"
  };

  try {
    console.log(`-> Conectando a Firestore e insertando borrador para el usuario: ${userId}...`);
    await saveSocialPost(userId, post);
    console.log("================================================================");
    console.log("🚀 ¡Post creado exitosamente para Instagram en Firestore!");
    console.log(`📌 ID: "${post.id}"`);
    console.log(`📌 Título: "${post.title}"`);
    console.log(`📅 Programado para: ${post.scheduledTime}`);
    console.log(`🔗 El borrador ya está disponible en Social.Flow (Automated Schedule / Predictive Creator).`);
    console.log("================================================================");
  } catch (err: any) {
    console.error("❌ Error al insertar el post en la base de datos:", err.message);
  }
}

createInstagramPost();
