// src/components/PowerBIEmbed.jsx
import React from "react";

/**
 * PowerBIEmbed
 * Props:
 *  - title (string)
 *  - src (string) Power BI embed URL
 *  - height (number) optional, default 640
 *
 * Simple wrapper to keep embeds consistent.
 */
export default function PowerBIEmbed({ title = "Report", src = "", height = 640 }) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-slate-500">Interactive report</div>
        </div>
      </div>

      <div style={{ minHeight: height }}>
        {src ? (
          // no sandbox to allow auth flows
          <iframe
            title={title}
            src={src}
            style={{ width: "100%", height: height, border: 0, display: "block" }}
            allowFullScreen
          />
        ) : (
          <div className="p-6 text-sm text-slate-500">No embed URL provided for this report.</div>
        )}
      </div>
    </div>
  );
}
