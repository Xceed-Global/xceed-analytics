// src/components/ResponsiveContainer.jsx
import React from "react";

/**
 * ResponsiveContainer
 * - provides consistent max-width, padding and responsive behavior
 * - on lg screens it enables a fixed-height explorer if children use h-full / overflow-auto
 */
export default function ResponsiveContainer({ children, desktopExplorer = false, className = "" }) {
  // if desktopExplorer true, apply a desktop-only fixed height helper
  return (
    <div className={`w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className={`bg-transparent ${desktopExplorer ? "lg:desktop-explorer-height lg:overflow-hidden" : ""}`}>
        {children}
      </div>
    </div>
  );
}
