import dotenv from "dotenv";
// Cargar variables de entorno del archivo .env
dotenv.config();

// Inicializar firebase-admin antes de interactuar con Firestore
import "../server/admin";
import { saveSocialPost } from "../server/store";
import type { SocialPost } from "../src/types";

async function createReelDraft() {
  const userId = "oF5XhOnCinhfFy5c8xYm4PbPzbI3"; // UID del bypass de desarrollo local

  const reelPost: SocialPost = {
    id: `post-reel-${Date.now()}`,
    ideaId: null,
    platform: "Instagram",
    title: "POV: Volando sobre las Esclusas del Canal de Panamá",
    caption: `POV: Tienes el mejor asiento de toda la casa sobre una de las 7 maravillas del mundo moderno. 🚁✨\n\n¿Por qué perder 4 horas en el tráfico de la ciudad cuando puedes reclamar el cielo? Despega de los rascacielos de la Ciudad de Panamá y vive una transición aérea perfecta hacia la historia del Canal o las paradisíacas islas de San Blas en solo minutos. 🏝️💼\n\nEsto no es solo transporte; es redefinir el valor de tu tiempo con un confort inigualable.\n\n💼 El servicio incluye:\n• Embarque en terminal privada VIP\n• Vuelo escénico y personalizado de baja altitud\n• Conserjería privada 24/7\n\n¿Listo para elevar tus estándares de viaje?\n\n📥 Envíanos un DM con la palabra "VUELO" o haz clic en el enlace de nuestra biografía para reservar tu vuelo privado hoy mismo. 📲\n\n---\n#SkyRidePanama #PanamaCanal #HelicopterCharter #LuxuryTravelPanama #PrivateAviation #VIPExperience #PanamaCity #VisitPanama #HelicopterTour`,
    mediaType: "video",
    // Mixkit de video cinemático loop de helicóptero sobre agua
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-helicopter-flying-over-ocean-sunset-10515-large.mp4",
    promptUsed: "Cinematic aerial view of a blue luxury helicopter flying over the Panama Canal Miraflores Locks, warm sunset golden hour, 4k ultra-high resolution.",
    scheduledTime: "Next Thursday, 4:00 PM",
    status: "Draft",
    viralScore: 96,
    viralMetrics: {
      hook: 98,
      trend: 93,
      shareability: 95,
      visualImpact: 98,
      callToAction: 95
    },
    viralFeedback: "¡Impacto visual impecable! El gancho cinemático inicial en helicóptero despierta de inmediato el sentido de exclusividad del viajero premium. Tip: Acompáñalo con música de fondo de tendencia ambiental y cinemática en Instagram.",
    audienceSegment: "Turistas de alto poder adquisitivo y ejecutivos corporativos"
  };

  try {
    console.log(`-> Conectando a Firestore e insertando borrador para el usuario: ${userId}...`);
    await saveSocialPost(userId, reelPost);
    console.log("================================================================");
    console.log("🚀 ¡Borrador del Reel insertado exitosamente en Firestore!");
    console.log(`📌 Título: "${reelPost.title}"`);
    console.log(`🔗 Podrás ver el borrador en la pestaña "Predictive Creator" o "Automated Schedule".`);
    console.log("================================================================");
  } catch (err: any) {
    console.error("❌ Error al insertar el borrador en la base de datos:", err.message);
  }
}

createReelDraft();
