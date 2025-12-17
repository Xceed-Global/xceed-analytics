// src/pages/DashboardPlaceholder.jsx
import React, { useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import manifest from "../data/datasets.json";

/**
 * Robust DashboardPlaceholder
 * - Matches incoming :id using a slugifier against dashObj.dashId and the dashboard display name.
 * - If not found, shows helpful debug list of available slugs.
 */

function slugify(input = "") {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum -> dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

export default function DashboardPlaceholder() {
  const { id } = useParams(); // expected slug from route: /dash/:id
  const location = useLocation();

  // fallback: try to extract from path if useParams failed (some routing setups)
  const rawId = id || (() => {
    const m = location.pathname.match(/\/dash\/(.+)/);
    return m ? decodeURIComponent(m[1]) : "";
  })();

  const dashSlug = slugify(rawId || "");

  const node = useMemo(() => {
    if (!manifest || !manifest.company) return null;
    const company = manifest.company;

    // iterate all dashboards, compute candidate slug for each and compare
    for (const deptName of Object.keys(company)) {
      const dept = company[deptName];
      for (const sectionName of Object.keys(dept)) {
        const section = dept[sectionName];
        for (const dashName of Object.keys(section)) {
          const dashObj = section[dashName] || {};
          const candidates = [];

          // candidate 1: dashObj.dashId (if provided)
          if (dashObj.dashId) candidates.push(String(dashObj.dashId));
          // candidate 2: dashName (the human-friendly key in the manifest)
          candidates.push(String(dashName));
          // candidate 3: embedUrl filename (last part) as a last resort
          if (dashObj.embedUrl) {
            try {
              const urlParts = new URL(dashObj.embedUrl);
              const p = urlParts.pathname || "";
              const last = p.split("/").filter(Boolean).pop() || "";
              if (last) candidates.push(last);
            } catch (e) { /* ignore invalid URL */ }
          }

          // slugify all candidates and compare
          for (const c of candidates) {
            if (slugify(c) === dashSlug) {
              return { deptName, sectionName, dashName, dashObj };
            }
          }
        }
      }
    }

    return null;
  }, [dashSlug]);

  // useful debug: prepare available slug list
  const available = useMemo(() => {
    const list = [];
    if (!manifest || !manifest.company) return list;
    for (const deptName of Object.keys(manifest.company)) {
      const dept = manifest.company[deptName];
      for (const sectionName of Object.keys(dept)) {
        const section = dept[sectionName];
        for (const dashName of Object.keys(section)) {
          const dashObj = section[dashName] || {};
          list.push({
            title: dashName,
            dashId: dashObj.dashId || "",
            slugName: slugify(dashName),
            slugId: dashObj.dashId ? slugify(dashObj.dashId) : null,
            dept: deptName,
            section: sectionName
          });
        }
      }
    }
    return list;
  }, []);

  const embedUrl = node?.dashObj?.embedUrl || node?.dashObj?.embedUrl || "";

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            
    
            <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {node ? node.dashName : rawId || "Dashboard"}
              </h1>
              {node && <div className="text-sm text-slate-500">{node.sectionName} — {node.deptName}</div>}
            </div>

            <div>
              {node ? (
                <Link to={`/data-manager?dept=${encodeURIComponent(node.deptName)}&dash=${encodeURIComponent(node.dashObj?.dashId || node.dashName)}`} className="px-3 py-2 rounded-md border">Datasets</Link>
              ) : (
                <Link to="/data-manager" className="px-3 py-2 rounded-md border">Data Manager</Link>
              )}
            </div>
          </div>

          <div className="card p-4">
            {node ? (
              embedUrl ? (
                <iframe title={node.dashName} src={embedUrl} style={{ width: "100%", height: 640, border: 0 }} />
              ) : (
                <div className="p-6 text-sm text-slate-600">
                  Dashboard <strong>{node.dashName}</strong> is configured but <code>embedUrl</code> is missing in <code>datasets.json</code>.
                  <div className="mt-3">Open <Link to={`/data-manager?dept=${encodeURIComponent(node.deptName)}&dash=${encodeURIComponent(node.dashObj?.dashId || node.dashName)}`} className="text-xceed-600 underline">Data Manager</Link> to add an embed URL or edit the manifest.</div>
                </div>
              )
            ) : (
              <div className="p-6">
                <div className="text-sm text-slate-600 mb-4">
                  Could not find a dashboard matching: <code>{rawId}</code> (slug = <code>{dashSlug}</code>).
                </div>

                <div className="text-sm text-slate-700 font-medium mb-2">Available dashboards (slug):</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {available.map((a) => (
                    <div key={`${a.dept}-${a.section}-${a.title}`} className="p-2 rounded-md border">
                      <div className="text-sm font-medium truncate">{a.title}</div>
                      <div className="text-xs text-slate-500">dashId: {a.dashId || "—"}</div>
                      <div className="text-xs text-slate-400 mt-1">slugName: <code>{a.slugName}</code></div>
                      {a.slugId && <div className="text-xs text-slate-400">slugId: <code>{a.slugId}</code></div>}
                      <div className="mt-2">
                        <Link to={`/dash/${encodeURIComponent(a.slugId || a.slugName)}`} className="text-xs px-2 py-1 rounded-md border">Open</Link>
                        <Link to={`/data-manager?dept=${encodeURIComponent(a.dept)}&dash=${encodeURIComponent(a.dashId || a.title)}`} className="ml-2 text-xs px-2 py-1 rounded-md border">Datasets</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
