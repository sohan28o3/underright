import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1px]"
            aria-label="Close navigation"
            onClick={() =>
              setMobileSidebarOpen(
                false,
              )
            }
          />

          <div className="relative h-full">
            <Sidebar
              mobile
              onClose={() =>
                setMobileSidebarOpen(
                  false,
                )
              }
            />
          </div>
        </div>
      )}

      <div className="min-h-screen lg:pl-[260px]">
        <Header
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;