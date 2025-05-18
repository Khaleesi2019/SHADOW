import { ReactNode } from "react";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from 'wouter';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated and not on the login page, render login component alone
  if (!isAuthenticated && !location.startsWith('/login')) {
    window.location.href = '/api/login';
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark-900 text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
