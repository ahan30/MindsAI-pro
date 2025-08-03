'use client';

import { Code, Save, Monitor, PanelLeft, PanelRight, Smartphone, Tablet, User, LogOut, LayoutGrid, Settings, PlusCircle, ShieldAlert, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Logo } from '@/components/icons';
import { useProSiteAI } from './prosite-ai-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import PromptForm from './prompt-form';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

// Dummy user state for demonstration
const useUser = () => {
  const [user, setUser] = useState<{ name: string; email: string; image: string; } | null>(null);
  
  const signIn = async () => {
    // In a real app, this would call handleSignIn and handle the response
    setUser({ name: 'Demo User', email: 'user@example.com', image: 'https://placehold.co/100x100.png' });
  };
  
  const signOut = () => setUser(null);

  return { user, signIn, signOut };
};

export default function Header() {
  const {
    device,
    setDevice,
    showLeftSidebar,
    setShowLeftSidebar,
    showRightSidebar,
    setShowRightSidebar,
    skeletonCode,
    saveProject,
    isProUser,
    setActiveBuilder
  } = useProSiteAI();
  const { toast } = useToast();
  const { user, signIn, signOut } = useUser();
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);

  const handleCopyCode = () => {
    if (skeletonCode) {
      navigator.clipboard.writeText(skeletonCode);
      toast({
        title: "Code Copied",
        description: "The website source code has been copied to your clipboard.",
      });
    }
  };

  const handleSaveProject = () => {
    if(skeletonCode) {
      const { project, error } = saveProject(skeletonCode);
      if (error) {
         toast({
            variant: "destructive",
            title: "Save Failed",
            description: error,
            action: <Button onClick={() => setActiveBuilder('pricing')}>Upgrade</Button>
         });
      } else if (project) {
         toast({
           title: "Project Saved!",
           description: `"${project.name}" has been saved.`
         })
      }
    }
  }
  
  const handleExportClick = () => {
     if (!isProUser) {
        toast({
            variant: "destructive",
            title: "Pro Feature",
            description: "Source code export is available for Pro users.",
            action: <Button onClick={() => setActiveBuilder('pricing')}>Upgrade</Button>
        });
        return;
     }
     // If the user is Pro, the Dialog will open automatically.
  }
  
  const handleShareClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Shareable preview links are a planned Pro feature.",
    });
  }

  return (
    <header className="flex h-16 items-center justify-between px-4 shrink-0 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
           <Logo className="h-7 w-7 text-primary" />
           <h1 className="text-xl font-bold tracking-tighter text-foreground">MindsAIPro</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={device === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('mobile')}>
                <Smartphone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mobile View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={device === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('tablet')}>
                <Tablet className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tablet View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={device === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setDevice('desktop')}>
                <Monitor className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Desktop View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
         <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              New Site
            </Button>
          </DialogTrigger>
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

         <Button variant="outline" onClick={handleSaveProject} disabled={!skeletonCode}>
            <Save className="mr-2" />
            Save Project
          </Button>

        <Button variant="outline" onClick={handleShareClick} disabled={!skeletonCode}>
          <Share2 className="mr-2" />
          Share
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowLeftSidebar(!showLeftSidebar)}>
                <PanelLeft className={cn("h-5 w-5", !showLeftSidebar && "text-muted-foreground")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Left Panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <DialogTrigger asChild disabled={!isProUser} onClickCapture={handleExportClick}>
                    <Button variant="ghost" size="icon" disabled={!skeletonCode}>
                       {isProUser ? <Code className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5 text-yellow-500" />}
                    </Button>
                  </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isProUser ? "Export Code" : "Upgrade to Export Code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isProUser && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export Source Code</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] rounded-md border bg-muted">
                <pre className="p-4 text-sm"><code className="font-code">{skeletonCode}</code></pre>
              </ScrollArea>
              <Button onClick={handleCopyCode}>Copy Code</Button>
            </DialogContent>
          )}
        </Dialog>
        
        <TooltipProvider>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setShowRightSidebar(!showRightSidebar)}>
                <PanelRight className={cn("h-5 w-5", !showRightSidebar && "text-muted-foreground")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Right Panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8" />
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>My Projects</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn()}>
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
