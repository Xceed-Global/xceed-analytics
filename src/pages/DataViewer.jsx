import React, { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function DataViewer(){
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawUrl = searchParams.get("url") || "";
  const decodedUrl = decodeURIComponent(rawUrl);
  const [loading, setLoading] = useState(true);
  const frameRef = useRef();

  // fallback help text if no url provided
  if(!decodedUrl){
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Data Viewer</h2>
            <div className="text-sm text-slate-500">Open Excel datasets in the page for viewing and editing (if you have permission).</div>
          </div>
          <div>
            <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded-md">Back</button>
          </div>
        </div>

        <div className="card p-4">
          <div className="text-sm text-slate-700">No dataset selected. Go to the Data Manager and click "Open" on a dataset or use the department links.</div>
        </div>
      </div>
    );
  }

  // helper to open in new tab
  function openInNewTab(){
    window.open(decodedUrl, "_blank", "noopener");
  }

  // helper to download (if local file or direct link)
  function downloadFile(){
    // attempt to download by navigating to url (browser will handle)
    window.open(decodedUrl, "_blank");
  }

  function goFullscreen(){
    const el = frameRef.current;
    if(!el) return;
    if(el.requestFullscreen) el.requestFullscreen();
    else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Data Viewer</h2>
          <div className="text-sm text-slate-500">Editing is possible if your Microsoft account has edit access and the file supports web editing.</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded-md">Back</button>
          <button onClick={openInNewTab} className="px-3 py-2 border rounded-md">Open in new tab</button>
          <button onClick={downloadFile} className="px-3 py-2 border rounded-md">Download</button>
          <button onClick={goFullscreen} className="px-3 py-2 bg-xceed-500 text-white rounded-md">Fullscreen</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b">
          <div className="text-sm text-slate-600">Embedded workbook</div>
        </div>

        <div style={{ minHeight: 520 }} className="relative">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Loading workbook…</div>
                <div className="text-xs text-slate-500">If prompted, sign-in with your Microsoft account to edit.</div>
              </div>
            </div>
          )}

          {/* iframe: we intentionally do NOT use sandbox so auth flows / popups work */}
          <iframe
            ref={frameRef}
            src={decodedUrl}
            title="Excel workbook"
            onLoad={() => setLoading(false)}
            style={{width: "100%", height: 760, border: 0, display: "block"}}
          />
        </div>
      </div>

      <div className="card p-4">
        <div className="text-sm text-slate-500">
          Notes:
          <ul className="list-disc ml-5 mt-2 text-xs">
            <li>If you need to edit, make sure you are signed in to Microsoft 365 and have edit permission on the file.</li>
            <li>If the embed does not allow editing, consider using the Data Manager to open the file in a new tab or request edit permission from the file owner.</li>
            <li>For programmatic imports/exports or automated saves, we recommend integrating Microsoft Graph (MSAL) — I can add a sample if you want.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
