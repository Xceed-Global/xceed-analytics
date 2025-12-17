// src/pages/Departments.jsx
import React from "react";
import { Link } from "react-router-dom";
import datasets from "../data/datasets.json";
import Sidebar from "../components/Sidebar";

export default function Departments() {
  const company = datasets.company || {};
  const deptKeys = Object.keys(company);

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        

        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Departments</h1>
            <p className="text-sm text-slate-500 mt-1">Browse departments and their dashboards.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptKeys.map((k) => {
              // count dashboards under this dept
              const sections = company[k];
              let dashCount = 0;
              Object.keys(sections || {}).forEach(sec => dashCount += Object.keys(sections[sec] || {}).length);

              return (
                <div key={k} className="card p-4 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{k}</div>
                      <div className="text-sm text-slate-500 mt-1">{Object.keys(sections || {}).length} sections • {dashCount} dashboards</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link to={`/departments/${encodeURIComponent(k)}`} className="px-3 py-2 rounded-md border text-sm">Open</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
