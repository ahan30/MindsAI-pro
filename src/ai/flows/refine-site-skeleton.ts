'use server';

/**
 * @fileOverview This file defines a Genkit flow that refines an existing website skeleton based on a new prompt.
 *
 * The flow takes the current website code and a user's prompt describing the desired changes,
 * and uses a generative AI model to update the code.
 *
 * @exports `refineSiteSkeleton` - The main function to trigger the site skeleton refinement.
 * @exports `RefineSiteSkeletonInput` - The input type for the `refineSiteSkeleton` function.
 * @exports `RefineSiteSkeletonOutput` - The output type for the `refineSiteSkeleton` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RefineSiteSkeletonInputSchema = z.object({
  currentCode: z.string().describe('The current HTML and CSS code of the website.'),
  prompt: z.string().describe('A detailed description of the changes to be made to the website.'),
});
export type RefineSiteSkeletonInput = z.infer<typeof RefineSiteSkeletonInputSchema>;

const RefineSiteSkeletonOutputSchema = z.object({
  refinedCode: z.string().describe('The refined code for the website layout and structure.'),
  usage: z.object({
    totalTokens: z.number(),
  }).describe('Token usage information.')
});
export type RefineSiteSkeletonOutput = z.infer<typeof RefineSiteSkeletonOutputSchema>;

export async function refineSiteSkeleton(input: RefineSiteSkeletonInput): Promise<RefineSiteSkeletonOutput> {
  return refineSiteSkeletonFlow(input);
}

const refineSiteSkeletonPrompt = ai.definePrompt({
  name: 'refineSiteSkeletonPrompt',
  input: { schema: RefineSiteSkeletonInputSchema },
  output: { schema: RefineSiteSkeletonOutputSchema },
  prompt: `You are an expert website architect. Your job is to refine an existing website skeleton based on user input.

You will be given the current website code and a prompt with instructions for changes. You must return the FULL, updated website code. Do not just return snippets.

The footer must always be structured exactly like this, inferring the website name from the content if possible:
<footer>
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
    <span>&copy; 2025 [Website Name]. All Rights Reserved.</span>
    <span>by - MindsAI-Durai</span>
  </div>
</footer>

IMPORTANT: For any <button> or <a href="#"> elements, ensure they have an inline onclick="event.preventDefault()" to prevent them from navigating or submitting a form within the preview environment.

Current Website Code:
\`\`\`html
{{{currentCode}}}
\`\`\`

User's refinement instructions: {{{prompt}}}

Please generate the updated website skeleton code:
`,
});

const refineSiteSkeletonFlow = ai.defineFlow(
  {
    name: 'refineSiteSkeletonFlow',
    inputSchema: RefineSiteSkeletonInputSchema,
    outputSchema: RefineSiteSkeletonOutputSchema,
  },
  async (input) => {
    const { output, usage } = await refineSiteSkeletonPrompt(input);
    return {
        refinedCode: output!.refinedCode,
        usage: {
            totalTokens: usage?.totalTokens ?? 0,
        }
    };
  }
);
