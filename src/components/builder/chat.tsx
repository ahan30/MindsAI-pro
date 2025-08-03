'use client';

import { MessagesSquare } from 'lucide-react';

export default function Chat() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="max-w-md">
        <MessagesSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">Multi-User Chat Application</h1>
        <p className="text-muted-foreground mb-8">
            This is the foundation for your real-time chat application. We've set up Firebase, and soon you'll be able to add authentication, create chat rooms, and send messages.
        </p>
      </div>
    </div>
  );
}
