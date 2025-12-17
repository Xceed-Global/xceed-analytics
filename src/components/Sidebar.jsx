// src/components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import datasets from "../data/datasets.json";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  BuildingLibraryIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const LS_KEY = "xceed_sidebar_expanded_v4";

/**
 * Sidebar — compact, attractive and user-friendly
 * - Adds clearer color accents for current selection (dept / section / dashboard)
 * - Uses a subtle light background for section/dashboard blocks
 * - Preserves expand/collapse, search and routing behavior
 *
 * Tailwind utility classes assume you have xceed colors (xceed-500, xceed-50).
 * If not present, replace with hex or existing color tokens.
 */

function buildStructure(manifest) {
  const out = [];
  const company = manifest?.company || {};
  Object.keys(company).forEach((deptName) => {
    const dept = company[deptName];
    const sections = Object.keys(dept || {}).map((sectionName) => {
      const dashNames = Object.keys(dept[sectionName] || {});
      const dashboards = dashNames.map((dashName) => {
        const dashObj = dept[sectionName][dashName];
        return {
          id: dashObj?.dashId || dashName,
          name: dashName,
          route: `/dash/${encodeURIComponent(dashObj?.dashId || dashName)}`,
          fileCount: (dashObj?.dataset?.files || []).length,
        };
      });
      return { sectionName, dashboards, dashCount: dashboards.length };
    });
    out.push({ deptName, sections });
  });
  return out;
}

export default function Sidebar({ compact = false }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sectionQuery = searchParams.get("section") ? decodeURIComponent(searchParams.get("section")) : null;

  const activeDeptFromPath = useMemo(() => {
    const m = location.pathname.match(/^\/departments\/(.+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }, [location.pathname]);

  const structure = useMemo(() => buildStructure(datasets), []);
  const [expanded, setExpanded] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || {};
    } catch {
      return {};
    }
  });
  const [query, setQuery] = useState("");

  const activeDashId = useMemo(() => {
    const m = location.pathname.match(/^\/dash\/(.+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }, [location.pathname]);

  useEffect(() => {
    if (!sectionQuery) return;
    for (const dept of structure) {
      const found = dept.sections.find((s) => s.sectionName === sectionQuery);
      if (found) {
        const newState = {};
        newState[dept.deptName] = true;
        newState[`${dept.deptName}::${found.sectionName}`] = true;
        try { localStorage.setItem(LS_KEY, JSON.stringify(newState)); } catch {}
        setExpanded(newState);
        return;
      }
    }
  }, [sectionQuery, structure]);

  useEffect(() => {
    if (!activeDashId) return;
    for (const dept of structure) {
      for (const sec of dept.sections) {
        for (const dash of sec.dashboards) {
          if (dash.id === activeDashId) {
            setExpanded((prev) => {
              const next = { ...prev };
              next[dept.deptName] = true;
              next[`${dept.deptName}::${sec.sectionName}`] = true;
              try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
              return next;
            });
            return;
          }
        }
      }
    }
  }, [activeDashId, structure]);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(expanded)); } catch {}
  }, [expanded]);

  function toggleDept(deptName) {
    setExpanded((prev) => ({ ...prev, [deptName]: !prev[deptName] }));
  }
  function toggleSection(deptName, sectionName) {
    const key = `${deptName}::${sectionName}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function onSectionClick(deptName, sectionName) {
    const newState = { ...expanded };
    newState[deptName] = true;
    (structure.find(s => s.deptName === deptName)?.sections || []).forEach(sec => {
      newState[`${deptName}::${sec.sectionName}`] = false;
    });
    newState[`${deptName}::${sectionName}`] = true;
    setExpanded(newState);
    try { localStorage.setItem(LS_KEY, JSON.stringify(newState)); } catch {}
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return structure;
    const q = query.trim().toLowerCase();
    return structure
      .map((dept) => {
        const sections = dept.sections
          .map((sec) => {
            const dashboards = sec.dashboards.filter((d) =>
              d.name.toLowerCase().includes(q) ||
              sec.sectionName.toLowerCase().includes(q) ||
              dept.deptName.toLowerCase().includes(q)
            );
            if (dashboards.length === 0) return null;
            return { ...sec, dashboards };
          })
          .filter(Boolean);
        if (sections.length === 0 && dept.deptName.toLowerCase().includes(q)) {
          return dept;
        }
        if (sections.length === 0) return null;
        return { ...dept, sections };
      })
      .filter(Boolean);
  }, [structure, query]);

  const Badge = ({ children }) => (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
      {children}
    </span>
  );

  return (
    <aside className={`${compact ? "w-48" : "w-full"} h-full`}>
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-gradient-to-br from-xceed-50 to-white">
              <BuildingLibraryIcon className="w-5 h-5 text-xceed-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Xceed</div>
              <div className="text-xs text-slate-400">Departments & dashboards</div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="relative block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="w-3 h-3 text-slate-400" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dashboards..."
              className="text-[9.9px] placeholder:text-slate-400 block w-full bg-white border rounded-md py-1 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-xceed-300"
            />
          </label>
        </div>

        <nav aria-label="Sidebar navigation" className="mt-3 space-y-2">
          {filtered.length === 0 && <div className="text-sm text-slate-500 px-1">No matches found</div>}

          {filtered.map((dept) => {
            const deptOpen = !!expanded[dept.deptName];
            const deptIsActive = activeDeptFromPath === dept.deptName || dept.sections.some(s => s.dashboards.some(d => d.id === activeDashId));

            return (
              <div key={dept.deptName} className="group">
                {/* Department header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => toggleDept(dept.deptName)}
                      className="p-1 mr-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-xceed-200"
                      aria-label={`Toggle ${dept.deptName}`}
                    >
                      {deptOpen ? <ChevronDownIcon className="w-4 h-4 text-slate-500" /> : <ChevronRightIcon className="w-4 h-4 text-slate-500" />}
                    </button>

                    <Link
                      to={`/departments/${encodeURIComponent(dept.deptName)}`}
                      className={`flex-1 flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50 transition-colors ${deptIsActive ? "bg-xceed-50 ring-1 ring-xceed-100" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <FolderIcon className="w-4 h-4 text-black font-bold" />
                        <div>
                          <div className="text-[11px] font-extrabold text-slate-800 ">{dept.deptName}</div>
                          <div className="text-[10px] text-slate-400">{dept.sections.length} sections</div>
                        </div>
                      </div>
                      <Badge>{dept.sections.reduce((s, sec) => s + sec.dashCount, 0)}</Badge>
                    </Link>
                  </div>
                </div>

                {/* Sections */}
                {deptOpen && (
                  <div className="mt-2 pl-4 space-y-1">
                    {dept.sections.map((sec) => {
                      const secKey = `${dept.deptName}::${sec.sectionName}`;
                      const secOpen = !!expanded[secKey];
                      const secIsActive = sectionQuery === sec.sectionName || sec.dashboards.some(d => d.id === activeDashId);

                      return (
                        <div key={secKey}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 w-full">
                              <button
                                onClick={() => toggleSection(dept.deptName, sec.sectionName)}
                                className="p-1 mr-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-xceed-200"
                                aria-label={`Toggle ${sec.sectionName}`}
                              >
                                {secOpen ? <ChevronDownIcon className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                              </button>

                              <Link
                                to={`/departments/${encodeURIComponent(dept.deptName)}?section=${encodeURIComponent(sec.sectionName)}`}
                                onClick={() => onSectionClick(dept.deptName, sec.sectionName)}
                                className={`flex-1 flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50 transition-colors ${secIsActive ? "bg-xceed-50/70 ring-1 ring-xceed-100" : "bg-white"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <Squares2X2Icon className="w-4 h-5 text-red-900 font-extrabold" />
                                  <div>
                                    <div className="text-[10px] text-red-900 font-semibold">{sec.sectionName}</div>
                                    <div className="text-[9px] text-slate-400">{sec.dashCount} dashboards</div>
                                  </div>
                                </div>
                                <Badge>{sec.dashCount}</Badge>
                              </Link>
                            </div>
                          </div>

                          {/* Dashboards list — visible when section expanded */}
                          {secOpen && (
                            <div className="mt-1 ml-12 space-y-0.1">
                              {sec.dashboards.map((d) => {
                                const isActive = activeDashId === d.id || location.pathname === d.route;
                                // section db background light color for each dashboard item — subtle and consistent
                                return (
                                  <Link
                                    key={d.id}
                                    to={d.route}
                                    className={`block px-2 py-1 rounded-md truncate text-[9px] transition-colors ${isActive ? "bg-yellow-100 text-xceed-800 font-semibold pl-2 border-l-2 border-red-700" : "text-slate-700 hover:bg-yellow-50"}`}
                                  >
                                    {d.name}
                                    <span className="ml-2 text-[9px] text-slate-400">• {d.fileCount}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-4 px-1">
          <div className="text-xs text-slate-400 mb-2">Quick Links</div>
          <div className="flex gap-2">
            <Link to="/data-manager" className="flex-1 text-center px-2 py-2 rounded-md border text-xs hover:bg-slate-50">Data Manager</Link>
            <Link to="/docs" className="flex-1 text-center px-2 py-2 rounded-md border text-xs hover:bg-slate-50">Docs</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
