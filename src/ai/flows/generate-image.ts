'use server';

/**
 * @fileOverview A Genkit flow for generating images from a text prompt.
 *
 * @exports `generateImage` - The main function to handle image generation.
 * @exports `GenerateImageInput` - The input type for the `generateImage` function.
 * @exports `GenerateImageOutput` - The output type for the `generateImage` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
  usage: z.object({
    totalTokens: z.number(),
  }).describe('Token usage information.')
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media, usage } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return {
      imageUrl: media.url,
      usage: {
        totalTokens: usage?.totalTokens ?? 0,
      }
    };
  }
);
