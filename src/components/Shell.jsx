// src/components/Shell.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

/**
 * Shell — renders a consistent layout and keeps the Sidebar fixed in place
 *
 * New: supports "desktopMode" (persisted in localStorage) which forces the app
 * to render as a fixed desktop canvas (min-width) and allows horizontal scrolling
 * on smaller devices so the 100% desktop view is preserved.
 *
 * To enable globally without the toggle, set localStorage.setItem('desktopMode','1') in console.
 *
 * Reminder: add CSS for .app-desktop-canvas / .app-desktop-center (see instructions below).
 */

const LS_DESKTOP = "xceed_desktop_mode";

export default function Shell({ children }) {
  const location = useLocation();
  const path = location.pathname || "";

  // Routes where we show the sidebar
  const sidebarRoutePrefixes = useMemo(() => [
    "/departments",
    "/dash",
    "/gallery",
    "/data-manager",
  ], []);

  const showSidebar = sidebarRoutePrefixes.some(prefix => path.startsWith(prefix));

  // mobile sidebar toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // desktop mode state (persisted)
  const [desktopMode, setDesktopMode] = useState(() => {
    try {
      return localStorage.getItem(LS_DESKTOP) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(LS_DESKTOP, desktopMode ? "1" : "0"); } catch {}
  }, [desktopMode]);

  // compute content height style (used for sticky sidebar & main content)
  const contentStyle = {
    // subtract header (var), footer (64px) and vertical margins (2rem)
    height: `calc(100vh - var(--header-height, 80px) - 64px - 2rem)`,
  };

  function toggleDesktopMode() {
    setDesktopMode(v => !v);
    // do not reload — UI updates immediately because we read state.
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${desktopMode ? "app-desktop-center" : ""}`}>
      {/* Header must set CSS variable --header-height or rely on default 80px */}
      <Header onToggleMobileSidebar={() => setMobileSidebarOpen(v => !v)} />

      {/* Desktop canvas wrapper — applied when desktopMode is true */}
      <div className={`${desktopMode ? "app-desktop-canvas w-full" : "w-full"}`}>
        <div className="flex-1 w-full">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            {showSidebar ? (
              // Desktop grid: fixed left column (280px) + flexible right content
              <div className="relative">
                <div className="grid" style={{ gridTemplateColumns: "280px 1fr", gap: "24px" }}>
                  {/* LEFT: Sidebar (fixed width) */}
                  <aside
                    aria-hidden={false}
                    className="hidden lg:block"
                    style={{ width: 280 }}
                  >
                    {/* sticky keeps sidebar in view while right content scrolls */}
                    <div
                      className="sticky top-[calc(var(--header-height,80px)+1rem)] overflow-auto"
                      style={{ height: contentStyle.height }}
                    >
                      <Sidebar />
                    </div>
                  </aside>

                  {/* RIGHT: Main content area — fixed height so internal panes use h-full */}
                  <main className="min-w-0" style={{ height: contentStyle.height }}>
                    {/* main content area should be independently scrollable if needed */}
                    <div className="h-full overflow-auto">
                      {children}
                    </div>
                  </main>
                </div>

                {/* Mobile sidebar overlay (visible on small screens when toggled) */}
                <div
                  className={`lg:hidden fixed inset-0 z-50 transition-opacity ${mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                  aria-hidden={!mobileSidebarOpen}
                >
                  <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setMobileSidebarOpen(false)}
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 overflow-auto"
                    style={{ marginTop: "var(--header-height, 80px)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold">Navigation</div>
                      <button className="px-2 py-1 rounded-md border text-xs" onClick={() => setMobileSidebarOpen(false)}>Close</button>
                    </div>
                    <Sidebar />
                  </div>
                </div>
              </div>
            ) : (
              // Single-column layout (no sidebar)
              <div>
                <main>{children}</main>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Floating Desktop Mode toggle — small unobtrusive control for testing */}
      <button
        onClick={toggleDesktopMode}
        title={desktopMode ? "Disable desktop mode" : "Enable desktop mode (force 100% desktop view)"}
        className="fixed z-60 left-4 bottom-4 bg-red-200 border px-3 py-1 rounded-md shadow-sm text-xs"
        style={{ backdropFilter: "blur(4px)" }}
      >
        {desktopMode ? "Desktop: ON" : "Desktop: OFF"}
      </button>
    </div>
  );
}
