'use client';

import { ProSiteAIProvider, useProSiteAI } from '@/components/builder/prosite-ai-provider';
import Header from '@/components/builder/header';
import SidebarLeft from '@/components/builder/sidebar-left';
import Canvas from '@/components/builder/canvas';
import SidebarRight from '@/components/builder/sidebar-right';
import AgentBuilder from '@/components/builder/agent-builder';
import ChatbotBuilder from '@/components/builder/chatbot-builder';
import DashboardBuilder from '@/components/builder/dashboard-builder';
import Pricing from '@/components/builder/pricing';
import { Badge } from '@/components/ui/badge';
import ImageGenerator from '@/components/builder/image-generator';
import Chat from '@/components/builder/chat';

function AppContent() {
  const { activeBuilder, totalTokens } = useProSiteAI();

  return (
      <div className="flex flex-col h-screen bg-background text-foreground font-body">
        <Header />
         <div className="flex justify-center items-center py-2 border-b">
            <Badge variant="outline">Token Usage: {totalTokens}</Badge>
        </div>
        <main className="flex flex-1 overflow-hidden">
          <SidebarLeft />
          <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-4 bg-muted/40">
            {activeBuilder === 'website' && <Canvas />}
            {activeBuilder === 'dashboard' && <DashboardBuilder />}
            {activeBuilder === 'chatbot' && <ChatbotBuilder />}
            {activeBuilder === 'agent' && <AgentBuilder />}
            {activeBuilder === 'pricing' && <Pricing />}
            {activeBuilder === 'image' && <ImageGenerator />}
            {activeBuilder === 'chat' && <Chat />}
          </div>
          <SidebarRight />
        </main>
      </div>
  )
}

export default function Home() {
  return (
    <ProSiteAIProvider>
      <AppContent />
    </ProSiteAIProvider>
  );
}
