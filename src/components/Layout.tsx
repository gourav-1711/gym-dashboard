"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../store/uiStore";
import { useLogout } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Dumbbell,
  Bell,
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/members", label: "Members", icon: Users },
  { path: "/income", label: "Income Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const logout = useLogout();
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  // Don't show the sidebar/header layout on the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <motion.aside
              initial={isMobile ? { x: -280 } : false}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -280 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "flex flex-col w-64 bg-[#111111] border-r border-white/5 z-40",
                isMobile ? "fixed inset-y-0 left-0" : "relative border-r"
              )}
            >
              <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-[#c8f65d] flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">GymPro</p>
                  <p className="text-xs text-white/40">Management Suite</p>
                </div>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => isMobile && setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                          active
                            ? "bg-[#c8f65d]/10 text-[#c8f65d]"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <item.icon className={cn("w-4.5 h-4.5", active ? "text-[#c8f65d]" : "")} size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8f65d]"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <div className="px-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#c8f65d]/20 flex items-center justify-center text-[#c8f65d] text-xs font-bold">
                    {user?.email?.[0]?.toUpperCase() ?? "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">Admin</p>
                    <p className="text-xs text-white/40 truncate">{user?.email ?? "admin@gym.com"}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => logout()}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#111111]/50 backdrop-blur-sm sticky top-0 z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {sidebarOpen && !isMobile ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
          <div className="flex-1" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8f65d] rounded-full" />
          </motion.button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
