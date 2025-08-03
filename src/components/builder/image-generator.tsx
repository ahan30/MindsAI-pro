'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Loader, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateImage } from '@/lib/actions';
import Image from 'next/image';
import { useProSiteAI } from './prosite-ai-provider';
import { Label } from '../ui/label';

const initialState = {
  success: false,
  error: null,
  data: null,
  timestamp: Date.now(), // Add timestamp to ensure state is unique
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Image
        </>
      )}
    </Button>
  );
}

export default function ImageGenerator() {
  const [state, formAction] = useActionState(handleGenerateImage, initialState);
  const { addTokens } = useProSiteAI();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.success && state.data) {
      addTokens(state.data.usage.totalTokens);
      formRef.current?.reset();
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // Depend on the entire state object to detect changes

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Text-to-Image Generator</CardTitle>
          <CardDescription>Describe the image you want to create. Be as descriptive as possible for the best results.</CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-2">
                <Label htmlFor="prompt">Your Prompt</Label>
                <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="e.g., A cinematic shot of a raccoon detective in a rainy, neon-lit city street."
                    rows={3}
                    required
                />
            </div>
            <div className="aspect-square w-full rounded-lg border border-dashed flex items-center justify-center bg-muted/40">
              {pending ? (
                 <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
                    <Loader className="w-12 h-12 animate-spin" />
                    <p className="text-lg font-medium text-foreground">Conjuring your image...</p>
                </div>
              ) : state.success && state.data?.imageUrl ? (
                <Image src={state.data.imageUrl} alt="Generated image" width={512} height={512} className="object-contain rounded-lg" />
              ) : (
                <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p>Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
