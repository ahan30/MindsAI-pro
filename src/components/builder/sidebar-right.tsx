'use client';

import { cn } from '@/lib/utils';
import { useProSiteAI } from './prosite-ai-provider';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader, Wand2 } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { handleRefineSite } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  success: false,
  error: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Refining...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Refine Site
        </>
      )}
    </Button>
  );
}


export default function SidebarRight() {
  const { showRightSidebar, skeletonCode, setSkeletonCode, setIsGenerating, addTokens } = useProSiteAI();
  const [state, formAction] = useActionState(handleRefineSite, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.data) {
      setSkeletonCode(state.data.refinedCode);
      addTokens(state.data.usage.totalTokens);
      formRef.current?.reset();
      toast({
        title: "Success!",
        description: "Your website has been updated.",
      });
    } else if (state.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: state.error,
      });
    }
    setIsGenerating(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onFormAction = (formData: FormData) => {
    if (!skeletonCode) {
        toast({
            variant: "destructive",
            title: "No site to refine!",
            description: "Please generate a site first.",
        });
        return;
    }
    const prompt = formData.get('prompt') as string;
    if (!prompt.trim()) {
        toast({
            variant: "destructive",
            title: "Prompt is required",
            description: "Please describe the changes you want to make.",
        });
        return;
    }
    setIsGenerating(true);
    formData.set('currentCode', skeletonCode);
    formAction(formData);
  };

  return (
    <aside
      className={cn(
        'transition-all duration-300 ease-in-out bg-card border-l',
        showRightSidebar ? 'w-72' : 'w-0 overflow-hidden'
      )}
    >
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold tracking-tight">Refine & Edit</h2>
                <p className="text-sm text-muted-foreground">Make changes to your site.</p>
            </div>
            <ScrollArea className="flex-1 px-4 py-4">
                {skeletonCode ? (
                    <form ref={formRef} action={onFormAction} className="grid gap-4">
                         <div className="grid w-full gap-1.5">
                            <Label htmlFor="prompt">Your Prompt</Label>
                            <Textarea
                                id="prompt"
                                name="prompt"
                                placeholder="e.g., Change the primary color to blue. Add a contact form with name, email, and message fields."
                                required
                                rows={8}
                            />
                        </div>
                        <SubmitButton />
                    </form>
                ) : (
                    <div className="mt-4 p-4 text-center border-dashed border-2 rounded-lg">
                        <p className="text-sm text-muted-foreground">Generate a site first to enable editing.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    </aside>
  );
}
