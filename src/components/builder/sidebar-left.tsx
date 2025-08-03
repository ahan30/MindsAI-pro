'use client';

import { cn } from '@/lib/utils';
import { useProSiteAI, Builder } from './prosite-ai-provider';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import {
  LayoutGrid,
  FileText,
  Clock,
  Lightbulb,
  DollarSign,
  Github,
  Globe,
  Smartphone,
  LayoutDashboard,
  MessageCircle,
  BrainCircuit,
  Gamepad2,
  Trash2,
  Image,
  MessagesSquare,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function SidebarLeft() {
  const { showLeftSidebar, savedProjects, loadProject, deleteProject, activeProject, activeBuilder, setActiveBuilder } = useProSiteAI();

  const proMenuItems = [
    { name: 'GitHub Connector', icon: Github },
  ]

  const builders = [
    { id: 'website', name: 'Website Builder', icon: Globe, enabled: true },
    { id: 'image', name: 'Image Generator', icon: Image, enabled: true },
    { id: 'chat', name: 'Chat App Builder', icon: MessagesSquare, enabled: true },
    { id: 'dashboard', name: 'Dashboard Builder', icon: LayoutDashboard, enabled: true },
    { id: 'chatbot', name: 'Chatbot Builder', icon: MessageCircle, enabled: true },
    { id: 'agent', name: 'AI Agent Builder', icon: BrainCircuit, enabled: true },
    { id: 'app', name: 'App Builder (Coming Soon)', icon: Smartphone, enabled: false },
    { id: 'game', name: '3D Game Development (Coming Soon)', icon: Gamepad2, enabled: false },
  ] as const;

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteProject(id);
  }

  return (
    <aside
      className={cn(
        'transition-all duration-300 ease-in-out bg-card border-r flex flex-col',
        showLeftSidebar ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight">
            MindsAIPro
            </h2>
        </div>
        <nav className="flex flex-col gap-1 p-2">
            <Accordion type="single" collapsible defaultValue="solutions">
              <AccordionItem value="solutions" className="border-b-0">
                <AccordionTrigger className="py-2 px-3 text-sm font-medium hover:bg-muted rounded-md hover:no-underline">
                   <div className='flex items-center gap-2'>
                     <Lightbulb className="h-4 w-4" />
                     Solutions
                   </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1">
                  <div className="flex flex-col gap-1 pl-4">
                  {builders.map((item) => (
                    <Button 
                      key={item.id} 
                      variant={activeBuilder === item.id ? "secondary" : "ghost"}
                      className="justify-start" 
                      onClick={() => setActiveBuilder(item.id)}
                      disabled={!item.enabled}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                        {!item.enabled && <Badge variant="secondary" className="ml-auto">Coming Soon</Badge>}
                    </Button>
                  ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
             <Button variant={activeBuilder === 'pricing' ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveBuilder('pricing')}>
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing
            </Button>
            {proMenuItems.map((item) => (
                <Button key={item.name} variant="ghost" className="justify-start" disabled>
                     <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    <Badge variant="secondary" className="ml-auto">Pro</Badge>
                </Button>
            ))}
        </nav>
        <Separator />
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" />
          My Projects
        </h2>
      </div>
      <ScrollArea className="flex-1">
        {savedProjects.length > 0 ? (
          <nav className="flex flex-col gap-1 p-2">
            {savedProjects.map((project) => (
              <div key={project.id} className="relative group">
                <Button
                  variant={activeProject?.id === project.id ? "secondary" : "ghost"}
                  className="justify-start h-auto w-full"
                  onClick={() => loadProject(project.id)}
                >
                  <div className='flex flex-col items-start gap-1 py-1'>
                      <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-6">
                           <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{project.timestamp.toLocaleDateString()}</span>
                      </div>
                  </div>
                </Button>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDeleteProject(e, project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
              </div>
            ))}
          </nav>
        ) : (
            <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">You have no saved projects. Generate a site and click "Save Project" to store it here.</p>
            </div>
        )}
      </ScrollArea>
       <Separator />
        <div className="p-4 border-t mt-auto">
            <Button variant="outline" className="w-full" onClick={() => setActiveBuilder('pricing')}>
                Upgrade to Pro
            </Button>
        </div>
    </aside>
  );
}
