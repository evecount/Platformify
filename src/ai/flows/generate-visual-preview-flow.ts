'use server';
/**
 * @fileOverview A Visual Renderer Agent that uses Imagen to create custom product/venue previews.
 * 
 * - generateVisualPreview - Generates a data URI image based on listing metadata and user intent.
 * - VisualPreviewInput - The input context (niche, metadata, specific user request).
 * - VisualPreviewOutput - The generated image data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisualPreviewInputSchema = z.object({
  platformNiche: z.string().describe('The domain vertical (e.g., Florist, Villa).'),
  listingTitle: z.string().describe('The name of the item/space.'),
  aiMetadata: z.record(z.any()).optional().describe('High-dimensional behavioral tags from the sister schema.'),
  userIntent: z.string().describe('Specific user preference (e.g., "I want a lush red bouquet for an anniversary").'),
});
export type VisualPreviewInput = z.infer<typeof VisualPreviewInputSchema>;

const VisualPreviewOutputSchema = z.object({
  previewUrl: z.string().describe('The generated image as a base64 data URI.'),
  description: z.string().describe('AI explanation of why this visual fits the user intent.'),
});
export type VisualPreviewOutput = z.infer<typeof VisualPreviewOutputSchema>;

export async function generateVisualPreview(input: VisualPreviewInput): Promise<VisualPreviewOutput> {
  const prompt = `Generate a high-quality, professional marketing photo for a ${input.platformNiche} marketplace. 
    The item is a "${input.listingTitle}". 
    The style should match these attributes: ${JSON.stringify(input.aiMetadata || {})}. 
    The specific user request to visualize is: "${input.userIntent}". 
    Ensure it looks realistic and premium, suitable for a luxury booking platform.`;

  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt,
  });

  if (!media) {
    throw new Error('Failed to generate visual preview');
  }

  return {
    previewUrl: media.url,
    description: `Customized visualization for "${input.userIntent}" within the ${input.listingTitle} framework.`,
  };
}
