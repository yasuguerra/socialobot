import dotenv from "dotenv";
dotenv.config();

import "../server/admin";
import { saveSocialPost } from "../server/store";
import type { SocialPost } from "../src/types";

async function createInstagramPost() {
  const userId = "oF5XhOnCinhfFy5c8xYm4PbPzbI3"; // UID del bypass de desarrollo local

  // Calcular fecha de programaciÃ³n (5 dÃ­as en el futuro a las 4:00 PM)
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 5);
  scheduledDate.setHours(16, 0, 0, 0);

  const post: SocialPost = {
    id: `post-skyride-${Date.now()}`,
    ideaId: null,
    platform: "Instagram",
    title: "Despega Hacia la Excelencia | Ciudad de PanamÃ¡ VIP",
    caption: `Â¿Tu tiempo es tu activo mÃ¡s valioso? Rise above the noise. ðŸšâœ¨\n\nCruzar la Ciudad de PanamÃ¡ en horas pico puede drenar tu energÃ­a y costar valiosas horas de tu dÃ­a. Â¿Por quÃ© elegir el asfalto cuando el cielo es tuyo?\n\nCon el Charter Privado VIP de Skyride Panama, transformas el trÃ¡nsito tedioso en un vuelo escÃ©nico impecable. En cuestiÃ³n de minutos, estarÃ¡s despegando de los modernos helipuertos de la ciudad con destino directo al Canal de PanamÃ¡ o hacia las paradisÃ­acas costas caribeÃ±as. ðŸï¸ðŸ‡µðŸ‡¦\n\nEsto no es solo transporte aÃ©reo; es la mÃ¡xima expresiÃ³n de eficiencia, prestigio y confort.\n\nðŸ’¼ El estÃ¡ndar Skyride incluye:\nâ€¢ Abordaje directo desde nuestra terminal privada VIP.\nâ€¢ Vuelo panorÃ¡mico de baja altitud con los pilotos mÃ¡s experimentados del paÃ­s.\nâ€¢ Flota equipada con tecnologÃ­a de punta y rigurosos protocolos internacionales de seguridad.\nâ€¢ ConserjerÃ­a exclusiva 24/7 adaptada a tu agenda corporativa o personal.\n\nNo solo llegues a tu destino, redefine la forma en que viajas.\n\nðŸ“¥ EscrÃ­benos por mensaje privado (DM) con la palabra "SKY" o haz clic en el enlace de nuestra biografÃ­a para coordinar tu prÃ³ximo charter privado. ðŸ“²\n\n---\n#SkyridePanama #LuxuryTravelPanama #HelicopterCharter #VIPAviation #PanamaCanal #PrivateCharter #AviationExperience #VisitPanama #EstiloVIP`,
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
    viralFeedback: "Â¡Excelente gancho orientado a la eficiencia del tiempo! El contraste entre el congestionamiento urbano y la libertad del helipuerto VIP resuena profundamente con audiencias corporativas de alto nivel adquisitivo. Tip: Publica esto los jueves o viernes por la tarde cuando los ejecutivos planifican su fin de semana.",
    audienceSegment: "Ejecutivos de alta direcciÃ³n, empresarios y viajeros VIP internacionales"
  };

  try {
    console.log(`-> Conectando a Firestore e insertando borrador para el usuario: ${userId}...`);
    await saveSocialPost(userId, post);
    console.log("================================================================");
    console.log("ðŸš€ Â¡Post creado exitosamente para Instagram en Firestore!");
    console.log(`ðŸ“Œ ID: "${post.id}"`);
    console.log(`ðŸ“Œ TÃ­tulo: "${post.title}"`);
    console.log(`ðŸ“… Programado para: ${post.scheduledTime}`);
    console.log(`ðŸ”— El borrador ya estÃ¡ disponible en SOCIALOBOT (Automated Schedule / Predictive Creator).`);
    console.log("================================================================");
  } catch (err: any) {
    console.error("âŒ Error al insertar el post en la base de datos:", err.message);
  }
}

createInstagramPost();

