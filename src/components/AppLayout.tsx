import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';

export const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
