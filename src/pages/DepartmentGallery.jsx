// src/pages/DepartmentGallery.jsx
import React, { useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import datasets from "../data/datasets.json";
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

function collectDeptDashboards(manifest, deptKey) {
  const out = [];
  if (!manifest?.company) return out;
  const dept = manifest.company[deptKey];
  if (!dept) return out;
  for (const sectionName of Object.keys(dept)) {
    const section = dept[sectionName];
    for (const dashName of Object.keys(section)) {
      const dashObj = section[dashName];
      out.push({
        id: dashObj?.dashId || dashName,
        title: dashName,
        section: sectionName,
        embedUrl: dashObj?.embedUrl || "",
        fileCount: (dashObj?.dataset?.files || []).length,
        raw: dashObj,
        dept: deptKey
      });
    }
  }
  return out;
}

export default function DepartmentGallery() {
  const { deptSlug } = useParams();
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get("section") ? decodeURIComponent(searchParams.get("section")) : null;

  const deptKey = decodeURIComponent(deptSlug || "");
  const company = datasets.company || {};
  const deptExists = !!company[deptKey];

  const allDashboards = useMemo(() => collectDeptDashboards(datasets, deptKey), [deptKey]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("alpha");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let list = allDashboards.slice();
    if (sectionQuery) list = list.filter(d => d.section === sectionQuery);
    if (q) list = list.filter(d => d.title.toLowerCase().includes(q) || d.section.toLowerCase().includes(q));
    if (sortBy === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "files") list.sort((a, b) => b.fileCount - a.fileCount);
    return list;
  }, [allDashboards, query, sortBy, sectionQuery]);

  if (!deptExists) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Department not found</h1>
          <p className="text-sm text-slate-500 mt-2">The department <strong>{deptKey}</strong> is not in the manifest.</p>
          <div className="mt-4">
            <Link to="/departments" className="px-4 py-2 rounded-md border">Back to Departments</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{deptKey}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboards & data for this department
            {sectionQuery ? ` — ${sectionQuery}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-md px-3 py-2 shadow-sm">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search dashboards"
              className="ml-5 text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="alpha">Sort: A → Z</option>
            <option value="files">Sort: Most files</option>
          </select>

          <Link
            to="/data-manager"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-md border text-sm"
          >
            Data Manager
          </Link>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {filtered.map(d => (
          <article
            key={d.id}
            className="group bg-white border rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:-translate-y-1 transition"
          >
            <div className="h-40 bg-slate-50 relative overflow-hidden rounded-t-2xl border-b">
              {d.embedUrl ? (
                <iframe
                  title={`${d.title}-preview`}
                  src={d.embedUrl}
                  className="absolute inset-0 w-full h-full border-0 scale-110 origin-top"
                  style={{
                    pointerEvents: "none", // disable interaction in small preview
                    transform: "scale(1.80)", // zoom in slightly for better framing
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-400">
                  No preview available
                </div>
              )}
            </div>


            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">{d.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{d.section}</div>
                  <div className="mt-3 flex gap-2 items-center">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                      {d.fileCount} file{d.fileCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => setPreview(d)}
                    className="px-3 py-2 rounded-md border text-sm flex items-center gap-2"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Preview
                  </button>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/dash/${encodeURIComponent(d.id)}`}
                      className="px-3 py-2 rounded-md border text-sm text-center"
                    >
                      Open
                    </Link>
                    <Link
                      to={`/data-manager?dept=${encodeURIComponent(d.dept)}&dash=${encodeURIComponent(d.id)}`}
                      className="px-3 py-2 rounded-md border text-sm text-center"
                    >
                      Datasets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-6 bg-white border rounded-md text-slate-500">
            No dashboards match your filters.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6">
          {/* background overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          />

          {/* modal content */}
          <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="text-lg font-semibold">{preview.title}</div>
                <div className="text-xs text-slate-500">
                  {preview.dept} — {preview.section}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Open datasets in new tab */}
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/xceed/#/data-manager?dept=${encodeURIComponent(preview.dept)}&dash=${encodeURIComponent(preview.id)}`;
                    window.open(url, "_blank", "noopener,noreferrer,width=1600,height=900");
                  }}
                  className="px-3 py-2 rounded-md border text-sm hover:bg-slate-50"
                >
                  Open datasets
                </button>


                {/* Close button */}
                <button
                  onClick={() => setPreview(null)}
                  className="px-3 py-2 rounded-md border text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* left: dashboard preview */}
              <div className="lg:col-span-2 p-4">
                {preview.embedUrl ? (
                  <iframe
                    title={preview.title}
                    src={preview.embedUrl}
                    style={{ width: "100%", height: "65vh", border: 0 }}
                  />
                ) : (
                  <div className="p-6 text-slate-600">
                    No embed URL configured for this dashboard. Add it via the Data Manager.
                  </div>
                )}
              </div>

              {/* right: dataset list */}
              <aside className="p-4 border-l">
                <div className="text-sm font-semibold">Files</div>
                <div className="mt-3 space-y-2">
                  {(preview.raw?.dataset?.files || []).length === 0 ? (
                    <div className="text-sm text-slate-500">No files found</div>
                  ) : (
                    (preview.raw.dataset.files || []).map((f) => (
                      <div key={f.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium truncate">{f.name}</div>
                          <div className="text-xs text-slate-400 truncate">{f.type}</div>
                        </div>
                        <div className="ml-2">
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-2 py-1 rounded-md border"
                          >
                            Open
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6">
                  <div className="text-xs text-slate-400">Actions</div>
                  <div className="mt-3 flex flex-col gap-2">
                    {preview.embedUrl ? (
                      <button
                        className="px-3 py-2 rounded-md border text-sm text-center hover:bg-slate-50"
                        onClick={() =>
                          window.open(
                            preview.embedUrl,
                            "_blank",
                            "noopener,noreferrer,width=1600,height=900"
                          )
                        }
                      >
                        Open in Power BI
                      </button>
                    ) : (
                      <div className="px-3 py-2 rounded-md border text-sm text-center text-slate-400 cursor-not-allowed">
                        No Power BI link
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
