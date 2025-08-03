'use server';
// @ts-nocheck

import { generateSiteSkeleton } from '@/ai/flows/generate-site-skeleton';
import { refineSiteSkeleton } from '@/ai/flows/refine-site-skeleton';
import { generateImage } from '@/ai/flows/generate-image';


export async function handleGenerateSite(prevState: any, formData: FormData) {
    const prompt = formData.get('prompt') as string | null;
    const additionalInstructions = formData.get('additionalInstructions') as string | null;
    const photoDataUri = formData.get('photoDataUri') as string | null;
    const htmlCode = formData.get('htmlCode') as string | null;

    if (!prompt?.trim() && !photoDataUri && !htmlCode?.trim()) {
        return { success: false, error: 'Prompt, image, or HTML code is required.' };
    }

    try {
        const result = await generateSiteSkeleton({ 
            prompt: prompt || '', 
            additionalInstructions: additionalInstructions || '', 
            photoDataUri, 
            htmlCode 
        });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error generating site:', error);
        return { success: false, error: 'Failed to generate site. Please try again.' };
    }
}

export async function handleRefineSite(prevState: any, formData: FormData) {
    const prompt = formData.get('prompt') as string;
    const currentCode = formData.get('currentCode') as string;

    if (!prompt) {
        return { success: false, error: 'A refinement prompt is required.' };
    }
    if (!currentCode) {
        return { success: false, error: 'Cannot refine an empty site. Please generate a site first.' };
    }

    try {
        const result = await refineSiteSkeleton({ currentCode, prompt });
        return { success: true, data: result };
    } catch (error) {
        console.error('Error refining site:', error);
        return { success: false, error: 'Failed to refine site. Please try again.' };
    }
}

export async function handleGenerateImage(prevState: any, formData: FormData) {
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
        return { success: false, error: 'A prompt is required to generate an image.', timestamp: Date.now() };
    }

    try {
        const result = await generateImage({ prompt });
        return { success: true, data: result, timestamp: Date.now() };
    } catch (error) {
        console.error('Error generating image:', error);
        return { success: false, error: 'Failed to generate image. Please try again.', timestamp: Date.now() };
    }
}

export async function handleSignIn() {
  // This is where you'd add your Firebase authentication logic.
  // For now, we'll just log to the console.
  console.log('Attempting to sign in...');
  try {
    // In a real app, you would use Firebase Auth to sign in the user.
    // e.g., const result = await signInWithPopup(auth, new GoogleAuthProvider());
    // return { success: true, user: result.user };
    return { success: true, user: { name: 'Demo User', email: 'user@example.com' } };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: 'Failed to sign in.' };
  }
}
