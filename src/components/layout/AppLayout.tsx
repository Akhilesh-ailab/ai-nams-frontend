import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main className="min-h-screen px-4 pb-6 pt-20 sm:px-6 lg:ml-[260px]">
        <Suspense fallback={<p className="py-20 text-center text-sm text-muted-foreground">Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}