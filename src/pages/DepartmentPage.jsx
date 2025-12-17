// src/pages/DepartmentPage.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import datasets from "../data/datasets.json";

/**
 * deptKey is the department name key from datasets.company
 */

export default function DepartmentPage() {
  const { deptSlug } = useParams();
  // deptSlug comes from encoded department key; decode to find in manifest
  const deptKey = decodeURIComponent(deptSlug || "");
  const company = datasets.company || {};
  const deptObj = company[deptKey];

  const safeDept = useMemo(() => {
    if (!deptObj) {
      return { title: deptKey || "Unknown Department", desc: "No config found.", dashboards: [] };
    }
    // build dashboard list: iterate sections -> dashboards
    const dashboards = [];
    Object.keys(deptObj).forEach((sectionName) => {
      const section = deptObj[sectionName];
      Object.keys(section).forEach((dashName) => {
        const dashObj = section[dashName];
        dashboards.push({
          id: dashObj?.dashId || dashName,
          name: dashName,
          section: sectionName,
          embedUrl: dashObj?.embedUrl || "",
        });
      });
    });
    return { title: deptKey, desc: "", dashboards };
  }, [deptKey, deptObj]);

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{safeDept.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{safeDept.desc}</p>
            </div>

            <div className="flex gap-2 items-start">
              <Link to="/data-manager" className="px-3 py-2 rounded-md border text-sm">Data Manager</Link>
              <Link to="/departments" className="px-3 py-2 rounded-md border text-sm">All Departments</Link>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-3">Dashboards</h2>

            {safeDept.dashboards.length === 0 ? (
              <div className="card p-4">
                <div className="text-sm text-slate-500">No dashboards configured for this department yet.</div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {safeDept.dashboards.map((d) => (
                  <article key={d.id} className="card p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900">{d.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{d.section}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link to={`/dash/${encodeURIComponent(d.id)}`} className="px-3 py-2 rounded-md border text-sm text-center">Open</Link>
                        <Link to={`/data-manager?dept=${encodeURIComponent(deptKey)}&dash=${encodeURIComponent(d.id)}`} className="px-3 py-2 rounded-md border text-sm text-center">Datasets</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
