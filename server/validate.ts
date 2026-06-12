import type { Request, Response, NextFunction } from "express";
import { z, type ZodTypeAny } from "zod";

/**
 * Express middleware that validates `req.body` against the provided Zod
 * schema. On failure, returns 400 with the formatted issue list. On success,
 * replaces `req.body` with the parsed (and stripped) value so handlers can
 * trust the shape.
 */
export function validateBody<S extends ZodTypeAny>(schema: S) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: parsed.error.issues.map(i => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    req.body = parsed.data;
    next();
  };
}

// ---------- Reusable primitives ----------

const trimmedString = (max = 500) => z.string().trim().max(max);
const optionalUrl = z.string().url().max(2048).optional().or(z.literal("").transform(() => undefined));

// ---------- Domain schemas ----------

export const BrandProfileInputSchema = z
  .object({
    name: trimmedString(120).optional(),
    website: optionalUrl,
    socialHandles: z
      .object({
        instagram: trimmedString(80).optional(),
        facebook: trimmedString(80).optional(),
        linkedin: trimmedString(120).optional(),
        tiktok: trimmedString(80).optional(),
      })
      .partial()
      .optional(),
    industry: trimmedString(120).optional(),
    tone: trimmedString(120).optional(),
    targetBuyers: trimmedString(2000).optional(),
    keyProducts: trimmedString(4000).optional(),
    additionalContext: trimmedString(4000).optional(),
  })
  .refine(v => v.name || v.website, {
    message: "Name or website is required",
  });

export const IdeasGenerateSchema = z.object({
  count: z.number().int().min(1).max(20).optional(),
  theme: trimmedString(500).optional(),
});

export const PostsCreateSchema = z.object({
  platform: z.enum(["Instagram", "Facebook", "LinkedIn", "TikTok"]),
  title: trimmedString(200).optional().default("Manual Post"),
  caption: trimmedString(2500).optional().default(""),
  mediaType: z.enum(["image", "video", "text"]).default("image"),
  mediaUrl: optionalUrl.default(""),
  scheduledTime: trimmedString(64).optional(),
  status: z.enum(["Draft", "Scheduled", "Posted", "Failed", "Simulated"]).optional(),
});

export const PostsGenerateSchema = z.object({
  platform: z.enum(["Instagram", "Facebook", "LinkedIn", "TikTok"]),
  ideaId: trimmedString(128).optional(),
  prompt: trimmedString(4000).optional(),
  title: trimmedString(200).optional(),
  format: trimmedString(100).optional(),
  customPrompt: trimmedString(4000).optional(),
  themePrompt: trimmedString(4000).optional(),
  referenceMediaUploaded: z.string().optional(),
});

export const PostsPublishSchema = z.object({
  postId: trimmedString(128),
});

export const PostsScheduleSchema = z.object({
  postId: trimmedString(128),
  scheduledTime: trimmedString(64).optional(),
});

export const AbCampaignCreateSchema = z.object({
  name: trimmedString(200),
  hypothesis: trimmedString(2000).optional(),
  variantAId: trimmedString(128).optional(),
  variantBId: trimmedString(128).optional(),
});

export const MediaUploadSchema = z.object({
  dataUri: z.string().min(8).max(160_000_000), // up to ~120MB base64
  mimeType: trimmedString(120).optional(),
  filename: trimmedString(200).optional(),
});

export const AiImageSchema = z.object({
  prompt: trimmedString(4000),
  aspectRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]).optional(),
});

export const NanoBananaSchema = z.object({
  prompt: trimmedString(4000),
  aspectRatio: trimmedString(20).optional(),
  imageSize: trimmedString(20).optional(),
  enableGrounding: z.boolean().optional(),
  model: trimmedString(100).optional(),
});

export const VeoGenerateSchema = z.object({
  prompt: trimmedString(4000),
  aspectRatio: trimmedString(20).optional(),
  resolution: trimmedString(20).optional(),
  starterImageBase64: z.string().optional().nullable(),
  starterImageMimeType: trimmedString(100).optional().nullable(),
  durationSeconds: z.number().int().min(1).max(120).optional(),
  model: trimmedString(100).optional(),
});

export const VeoStatusSchema = z.object({
  operationName: trimmedString(500),
});

export const VeoExtendSchema = z.object({
  operationName: trimmedString(500),
  prompt: trimmedString(4000),
});

export const RemodelSpaceSchema = z.object({
  dataUri: z.string().min(8).max(160_000_000), // up to ~120MB base64
  mimeType: trimmedString(120).optional(),
  filename: trimmedString(200).optional(),
  instruction: trimmedString(4000),
});
