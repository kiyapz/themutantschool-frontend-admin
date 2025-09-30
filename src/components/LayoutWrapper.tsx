"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--text-secondary)] mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page or home page, don't show the layout wrapper
  if (pathname === "/auth/login" || pathname === "/") {
    return <>{children}</>;
  }

  // Removed authentication check - all pages are accessible

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex w-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />

        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "var(--spacing-lg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
