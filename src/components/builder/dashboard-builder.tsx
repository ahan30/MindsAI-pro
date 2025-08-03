'use client';

import { LayoutDashboard } from "lucide-react";

export default function DashboardBuilder() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="max-w-md">
        <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard Builder</h1>
        <p className="text-muted-foreground mb-8">
            This is the workspace for creating data-rich dashboards. Describe the charts, tables, and KPIs you want to visualize, and the AI will generate the layout for you.
        </p>
      </div>
    </div>
  );
}
