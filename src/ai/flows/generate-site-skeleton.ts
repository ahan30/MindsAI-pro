'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates a basic website skeleton based on a single prompt.
 *
 * The flow takes a user's prompt describing the desired website and uses a generative AI model to create a preliminary layout and structure.
 * This saves the user initial setup time by providing a foundation to build upon.
 *
 * @exports `generateSiteSkeleton` - The main function to trigger the site skeleton generation.
 * @exports `GenerateSiteSkeletonInput` - The input type for the `generateSiteSkeleton` function.
 * @exports `GenerateSiteSkeletonOutput` - The output type for the `generateSiteSkeleton` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSiteSkeletonInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the desired website.'),
  additionalInstructions: z
    .string()
    .optional()
    .describe('Any additional instructions for generating the site skeleton.'),
  photoDataUri: z
    .string()
    .optional()
    .nullable()
    .describe(
      "A photo of a website design, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  htmlCode: z
    .string()
    .optional()
    .nullable()
    .describe('Existing HTML code to be used as a starting point or for refinement.'),
});
export type GenerateSiteSkeletonInput = z.infer<typeof GenerateSiteSkeletonInputSchema>;

const GenerateSiteSkeletonOutputSchema = z.object({
  skeletonCode: z
    .string()
    .describe('The generated skeleton code for the website layout and structure.'),
  usage: z.object({
    totalTokens: z.number(),
  }).describe('Token usage information.')
});
export type GenerateSiteSkeletonOutput = z.infer<typeof GenerateSiteSkeletonOutputSchema>;

export async function generateSiteSkeleton(input: GenerateSiteSkeletonInput): Promise<GenerateSiteSkeletonOutput> {
  return generateSiteSkeletonFlow(input);
}

const generateSiteSkeletonPrompt = ai.definePrompt({
  name: 'generateSiteSkeletonPrompt',
  input: {schema: GenerateSiteSkeletonInputSchema},
  output: {schema: GenerateSiteSkeletonOutputSchema},
  prompt: `You are an expert website architect. Your job is to generate a complete, single-file HTML website skeleton based on user input. The output should be a single HTML file with embedded CSS and JavaScript if necessary.

  The footer must be structured exactly like this:
  <footer>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
      <span>&copy; 2025 [Infer a website name from the prompt or image]. All Rights Reserved.</span>
      <span>by - MindsAI-Durai</span>
    </div>
  </footer>
  
  IMPORTANT: For any <button> or <a href="#"> elements, add a simple inline onclick="event.preventDefault()" to prevent them from navigating or submitting a form within the preview environment.

  Ensure the generated code is well-structured and easy to understand, so that the user can extend it as desired.

  User Prompt: {{{prompt}}}

  {{#if photoDataUri}}
  The user has provided an image of a website they want to create. Replicate the design, layout, colors, and fonts from this image.
  Image: {{media url=photoDataUri}}
  {{/if}}

  {{#if htmlCode}}
  The user has provided existing HTML code. Use this as the primary basis for the website. You must modify, style, or complete it based on the user's prompt and additional instructions.
  Existing HTML:
  \`\`\`html
  {{{htmlCode}}}
  \`\`\`
  {{/if}}


  {{#if additionalInstructions}}
  Additional Instructions: {{{additionalInstructions}}}
  {{/if}}

  Please generate the website skeleton code:
  `,
});

const generateSiteSkeletonFlow = ai.defineFlow(
  {
    name: 'generateSiteSkeletonFlow',
    inputSchema: GenerateSiteSkeletonInputSchema,
    outputSchema: GenerateSiteSkeletonOutputSchema,
  },
  async input => {
    const {output, usage} = await generateSiteSkeletonPrompt(input);
    return {
        skeletonCode: output!.skeletonCode,
        usage: {
            totalTokens: usage?.totalTokens ?? 0,
        }
    };
  }
);
