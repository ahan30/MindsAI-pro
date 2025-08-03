'use client';

import { BrainCircuit } from "lucide-react";

export default function AgentBuilder() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="max-w-md">
        <BrainCircuit className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">AI Agent Builder</h1>
        <p className="text-muted-foreground mb-8">
            This is the workspace for building powerful AI agents. Give your agent a goal, a set of tools to use, and let it autonomously execute tasks to achieve its objectives.
        </p>
      </div>
    </div>
  );
}
