'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGenerateSite } from '@/lib/actions';
import { useProSiteAI } from './prosite-ai-provider';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader, Wand2, Image as ImageIcon, X, Code } from 'lucide-react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const initialState = {
  success: false,
  error: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full text-base">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Site
        </>
      )}
    </Button>
  );
}

export default function PromptForm({ onCompletion }: { onCompletion?: () => void }) {
  const { setSkeletonCode, setIsGenerating, addTokens } = useProSiteAI();
  const [state, formAction] = useActionState(handleGenerateSite, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsGenerating(false);
    if (state.success && state.data) {
      setSkeletonCode(state.data.skeletonCode);
      addTokens(state.data.usage.totalTokens);
      formRef.current?.reset();
      setImagePreview(null);
      toast({
        title: "Success!",
        description: "Your website has been generated.",
      });
      if (onCompletion) {
        onCompletion();
      }
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image')) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result as string);
              // Clear the file input in case a file was selected before pasting
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            };
            reader.readAsDataURL(file);
            // Prevent the browser from also pasting the image into the textarea
            event.preventDefault(); 
          }
        }
      }
    };
    
    // This assumes the paste event should only apply when the prompt/image tab is active.
    // A more robust solution might check the active tab.
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const onFormAction = (formData: FormData) => {
    const prompt = formData.get('prompt') as string | null;
    const htmlCode = formData.get('htmlCode') as string | null;

    if (!prompt?.trim() && !imagePreview && !htmlCode?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: 'Please describe the website, upload an image, or provide HTML code.',
      });
      return;
    }
    setIsGenerating(true);
    formAction(formData);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <form ref={formRef} action={onFormAction} className="space-y-4">
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt">
            <Wand2 className="mr-2 h-4 w-4" />
            Prompt & Image
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="mr-2 h-4 w-4" />
            HTML Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="prompt" className="space-y-4 mt-4">
          <div className="grid w-full gap-2">
            {imagePreview ? (
              <div className='relative'>
                 <Image src={imagePreview} alt="Website preview" width={500} height={300} className="rounded-md object-cover w-full max-h-[200px]" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <input type="hidden" name="photoDataUri" value={imagePreview} />
              </div>
            ) : (
             <div className="w-full">
                <Label htmlFor="image-upload" className="font-semibold text-base sr-only">Upload Image</Label>
                 <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                         <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload or paste an image</span></p>
                         <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                     </div>
                     <Input id="image-upload" name="image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} ref={fileInputRef}/>
                 </label>
             </div> 
            )}
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="prompt" className="font-semibold text-base sr-only">Your Prompt</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Describe your website or add details to your image..."
              rows={3}
              className="text-base"
            />
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-4">
           <div className="grid w-full gap-2">
            <Label htmlFor="htmlCode" className="font-semibold text-base">HTML Code</Label>
            <Textarea
                id="htmlCode"
                name="htmlCode"
                placeholder="Paste your HTML code here..."
                rows={10}
                className="font-mono"
            />
            <p className='text-xs text-muted-foreground'>You can also add a prompt in the "Additional Instructions" below to guide the AI.</p>
           </div>
        </TabsContent>
      </Tabs>

      <div className="grid w-full gap-2">
        <Label htmlFor="additionalInstructions" className="font-semibold text-base sr-only">
          Additional Instructions
        </Label>
        <Textarea
          id="additionalInstructions"
          name="additionalInstructions"
          placeholder="e.g., Use a dark theme, with a focus on clean typography. (Optional)"
          rows={2}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
