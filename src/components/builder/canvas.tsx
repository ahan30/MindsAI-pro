'use client';

import { cn } from '@/lib/utils';
import { useProSiteAI } from './prosite-ai-provider';
import { Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import PromptForm from './prompt-form';

export default function Canvas() {
  const { skeletonCode, device, isGenerating } = useProSiteAI();
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  
  const deviceWidths = {
    mobile: 'w-[375px] h-[667px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-full',
  };

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out flex items-center justify-center p-4 md:p-8',
         deviceWidths[device]
      )}
    >
      <div className={cn("w-full h-full bg-background rounded-lg shadow-lg border-2 overflow-hidden",
         isGenerating ? "flex items-center justify-center" : ""
      )}>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
            <Loader className="w-12 h-12 animate-spin" />
            <p className="text-lg font-medium text-foreground">Generating your masterpiece...</p>
          </div>
        ) : skeletonCode ? (
          <iframe
            srcDoc={skeletonCode}
            title="Website Preview"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-full max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to the Website Builder</h1>
              <p className="text-muted-foreground mb-6">
                Use the <span className='font-semibold text-primary'>"New Site"</span> button in the header to generate a site with a prompt or an image.
              </p>
               <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Create a new website</DialogTitle>
                      <DialogDescription>
                        Describe the website you want to build. Be as specific as you can.
                      </DialogDescription>
                    </DialogHeader>
                    <PromptForm onCompletion={() => setIsPromptDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
