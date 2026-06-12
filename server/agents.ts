/**
 * Google ADK Agent setup for Social.Flow
 *
 * Creates a multi-tool LlmAgent backed by Vertex AI (using Application
 * Default Credentials) or the Gemini API key as fallback.
 * The agent is exposed via /api/agent/run and can autonomously:
 *   - Research trends with Google Search
 *   - Generate content ideas and captions
 *   - Analyze brand strategy
 *   - Schedule and plan social media calendars
 */

import {
  LlmAgent,
  Gemini,
  Runner,
  InMemorySessionService,
  FunctionTool,
  GoogleSearchTool,
  type InvocationContext,
} from "@google/adk";
import { Content, type Schema, Type } from "@google/genai";
import { getArsenalMedia } from "./store";

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "socialobot";
const GCP_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const USE_VERTEX =
  !GEMINI_API_KEY || GEMINI_API_KEY === "MY_GEMINI_API_KEY";

function buildGeminiModel(model = "gemini-3.5-flash"): Gemini {
  if (USE_VERTEX) {
    return new Gemini({
      model,
      vertexai: true,
      project: GCP_PROJECT,
      location: GCP_LOCATION,
    });
  }
  return new Gemini({ model, apiKey: GEMINI_API_KEY });
}

// ---------------------------------------------------------------------------
// Tools available to the agent
// ---------------------------------------------------------------------------

const generateContentIdeasTool = new FunctionTool<Schema>({
  name: "generate_content_ideas",
  description:
    "Generates 3 viral social media content ideas for a given brand profile and target platform.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brandName: { type: Type.STRING, description: "Name of the brand" },
      industry: { type: Type.STRING, description: "Brand industry or niche" },
      tone: { type: Type.STRING, description: "Brand tone of voice" },
      targetBuyers: { type: Type.STRING, description: "Description of target audience" },
      platform: {
        type: Type.STRING,
        enum: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
        description: "Social platform to target",
      },
    },
    required: ["brandName", "industry", "platform"],
  },
  execute: async (params: Record<string, unknown>) => {
    // This tool body is intentionally lightweight — the LLM generates the
    // ideas itself using its knowledge; this gives the agent a structured
    // function-call path to surface structured output.
    return {
      status: "success",
      message: `Ideas framework ready for ${params.brandName} on ${params.platform}. Use your content expertise to generate 3 viral ideas with hooks, visual prompts, and optimal posting times.`,
      brand: params,
    };
  },
});

const analyzeViralScoreTool = new FunctionTool<Schema>({
  name: "analyze_viral_score",
  description:
    "Analyzes a social media post caption and returns a viral score with breakdown metrics.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      caption: { type: Type.STRING, description: "The post caption to analyze" },
      platform: {
        type: Type.STRING,
        enum: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
      },
      industry: { type: Type.STRING, description: "Brand industry for context" },
    },
    required: ["caption", "platform"],
  },
  execute: async (params: Record<string, unknown>) => {
    return {
      status: "ready_for_analysis",
      caption: params.caption,
      platform: params.platform,
      instruction:
        "Score hook (0-100), trend alignment (0-100), shareability (0-100), visual impact (0-100), CTA strength (0-100). Return as JSON with overall viralScore.",
    };
  },
});

const schedulingAdvisorTool = new FunctionTool<Schema>({
  name: "get_optimal_schedule",
  description:
    "Returns the optimal posting schedule for a brand on a given platform based on industry and audience.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      platform: {
        type: Type.STRING,
        enum: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
      },
      industry: { type: Type.STRING },
      targetBuyers: { type: Type.STRING },
      postsPerWeek: {
        type: Type.NUMBER,
        description: "Desired posts per week (1-7)",
      },
    },
    required: ["platform", "industry"],
  },
  execute: async (params: Record<string, unknown>) => {
    return {
      status: "ready",
      platform: params.platform,
      industry: params.industry,
      instruction:
        "Provide a weekly posting calendar with specific days and times (e.g. Mon 9AM, Wed 12PM, Fri 6PM) with reasoning per slot based on platform algorithm patterns for this industry.",
    };
  },
});

const hashtagResearchTool = new FunctionTool<Schema>({
  name: "research_hashtags",
  description:
    "Researches and recommends optimal hashtags for a social media post in a given niche.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: "The post topic or concept" },
      platform: {
        type: Type.STRING,
        enum: ["Instagram", "TikTok", "LinkedIn", "Facebook"],
      },
      niche: { type: Type.STRING, description: "The brand niche or industry" },
      count: {
        type: Type.NUMBER,
        description: "Number of hashtags to return (5-30)",
      },
    },
    required: ["topic", "platform"],
  },
  execute: async (params: Record<string, unknown>) => {
    return {
      status: "ready",
      topic: params.topic,
      platform: params.platform,
      instruction: `Generate ${params.count || 15} high-performing hashtags for ${params.platform} in the ${params.niche || "general"} niche. Mix viral (#fyp, #viral), niche-specific, and branded hashtag tiers.`,
    };
  },
});

const browseContentArsenalTool = new FunctionTool<Schema>({
  name: "browse_content_arsenal",
  description: "Browses the user's Content Arsenal containing pre-uploaded photos and videos with their AI descriptions and visual style prompts.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      mediaType: {
        type: Type.STRING,
        enum: ["image", "video", "all"],
        description: "Filter by image or video assets (default: all)"
      }
    }
  },
  execute: async (params: Record<string, unknown>) => {
    return {
      status: "success",
      mediaType: params.mediaType || "all",
      instruction: "Examine the list of pre-uploaded media assets available in the current context conversation history and recommend visual posts based on those files."
    };
  }
});

// ---------------------------------------------------------------------------
// Agent definition
// ---------------------------------------------------------------------------

const AGENT_INSTRUCTION = `You are Social.Flow's expert AI social media strategist agent.
You help users grow their brand on social media using data-driven insights and viral content strategies.

Your capabilities:
- Generate viral content ideas tailored to specific platforms and audiences
- Analyze post captions for viral potential with detailed scoring
- Research trending hashtags and optimal posting times
- Search Google for current trending topics and industry news
- Build complete social media calendars
- Provide A/B testing recommendations

Always respond in the same language the user writes in.
When generating content ideas, be specific, creative, and platform-aware.
When providing viral scores, give actionable feedback to improve each metric.
Structure your responses clearly with headers when providing multiple items.`;

export function createSocialAgent(): LlmAgent {
  return new LlmAgent({
    name: "social_flow_agent",
    model: buildGeminiModel("gemini-3.5-flash"),
    description: "Expert social media strategist with content generation and trend analysis capabilities",
    instruction: AGENT_INSTRUCTION,
    tools: [
      generateContentIdeasTool,
      analyzeViralScoreTool,
      schedulingAdvisorTool,
      hashtagResearchTool,
      browseContentArsenalTool,
      new GoogleSearchTool(),
    ],
  });
}

// ---------------------------------------------------------------------------
// Runner + session service (singleton per process)
// ---------------------------------------------------------------------------

let _runner: Runner | null = null;
const _sessionService = new InMemorySessionService();

export function getAgentRunner(): Runner {
  if (!_runner) {
    _runner = new Runner({
      agent: createSocialAgent(),
      appName: "social-flow",
      sessionService: _sessionService,
    });
  }
  return _runner;
}

// ---------------------------------------------------------------------------
// Public helper: run a single user turn
// ---------------------------------------------------------------------------

export interface AgentRunResult {
  text: string;
  events: unknown[];
}

export async function runAgentTurn(
  userId: string,
  sessionId: string,
  userMessage: string
): Promise<AgentRunResult> {
  const runner = getAgentRunner();

  // Ensure session exists
  await _sessionService.createSession({
    appName: "social-flow",
    userId,
    sessionId,
  }).catch(() => { /* already exists */ });

  // Pre-fetch Content Arsenal for the user so the LLM is fully aware of their actual assets
  const arsenal = await getArsenalMedia(userId).catch(() => []);
  let arsenalContext = "";
  if (arsenal && arsenal.length > 0) {
    arsenalContext = "\n\n[CONTEXTO DE TU ARSENAL DE CONTENIDO DISPONIBLE]\n" +
      "Tienes los siguientes recursos multimedia en tu biblioteca privada. Puedes sugerir usarlos en publicaciones o inspirarte en ellos:\n" +
      arsenal.map((item, idx) => {
        return `- Recurso #${idx + 1}: Filename: "${item.fileName}" | Tipo: ${item.mimeType} | ID: ${item.id}\n  Descripción visual: ${item.aiDescription}\n  Prompt de inspiración: ${item.visualPrompt}`;
      }).join("\n") +
      "\n[FIN CONTEXTO ARSENAL]";
  }

  const userContent: Content = {
    role: "user",
    parts: [{ text: userMessage + arsenalContext }],
  };

  const events: unknown[] = [];
  let finalText = "";

  for await (const event of runner.runAsync({
    userId,
    sessionId,
    newMessage: userContent,
  })) {
    events.push(event);
    // Extract final text response
    if (
      event &&
      typeof event === "object" &&
      "content" in event &&
      event.content &&
      typeof event.content === "object" &&
      "parts" in event.content
    ) {
      const parts = (event.content as Content).parts;
      if (parts) {
        for (const part of parts) {
          if (part && "text" in part && typeof part.text === "string") {
            finalText += part.text;
          }
        }
      }
    }
  }

  return { text: finalText, events };
}
