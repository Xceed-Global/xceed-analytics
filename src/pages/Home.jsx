// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import datasets from "../data/datasets.json";

export default function Home() {
  // derive departments list from manifest (keys)
  const departments = Object.keys((datasets && datasets.company) || {});

  return (
    <div className="space-y-8">
      <section className="bg-white card p-8 hero-accent">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Xceed Analytics</h1>
            <p className="mt-3 text-slate-600 max-w-xl">
              Empowering organisations with data, automation and AI. Explore departmental dashboards, generate reports, and trigger automations from a single portal.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/departments" className="inline-flex items-center px-5 py-3 rounded-md bg-xceed-500 text-white font-semibold shadow">Open Portal</Link>
              <a href="mailto:hello-xceed@outlook.com" className="inline-flex items-center px-4 py-3 rounded-md border">Request a dashboard</a>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 card">
                <div className="text-xs text-slate-400">Monthly Revenue</div>
                <div className="mt-1 text-xl font-bold">₨ 12.3M</div>
                <div className="text-sm text-emerald-600 mt-1">+8% vs last month</div>
              </div>
              <div className="p-4 card">
                <div className="text-xs text-slate-400">Active Users</div>
                <div className="mt-1 text-xl font-bold">1,240</div>
                <div className="text-sm text-slate-500 mt-1">Platform-wide</div>
              </div>
              <div className="p-4 card">
                <div className="text-xs text-slate-400">Model Accuracy</div>
                <div className="mt-1 text-xl font-bold">92%</div>
                <div className="text-sm text-slate-500 mt-1">Sales forecast model</div>
              </div>
              <div className="p-4 card">
                <div className="text-xs text-slate-400">Automations</div>
                <div className="mt-1 text-xl font-bold">18</div>
                <div className="text-sm text-slate-500 mt-1">Active flows</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO / PURCHASE SECTION */}
      <section className="card p-6 bg-gradient-to-r from-yellow-50 to-white border">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">Buy this system — Dashboard & Data Management</h3>
            <p className="mt-2 text-slate-600 max-w-prose">
              Get a ready-to-deploy Xceed Analytics system plus setup support for only <strong>$29.98</strong>.
              This includes dashboard development, data management, and a short onboarding call to get your datasets connected.
            </p>
            <ul className="mt-3 text-sm text-slate-500 list-disc list-inside">
              <li>One-time fee: <strong>$29.98</strong></li>
              <li>Dashboard development & configuration</li>
              <li>Data cleaning & mapping</li>
              <li>Support: initial onboarding call & Customize System</li>
            </ul>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:items-end gap-3">
            {/* Buy button: mailto fallback / replace href with payment link when ready */}
            <a
              href="mailto:hello-xceed@outlook.com?subject=Buy%20Xceed%20System%20-%20$29.98&body=Hi%2C%0A%0AI%20would%20like%20to%20purchase%20the%20Xceed%20Analytics%20System%20for%20%2429.98.%20Please%20send%20me%20the%20next%20steps%20and%20payment%20details.%0A%0AOrganisation%3A%0AContact%20Number%3A%0A%0AThanks%2C"
              className="inline-flex items-center justify-center px-10 py-5 rounded-md bg-blue-600 text-white font-bold shadow hover:opacity-95"
            >
              Buy for $29.98
            </a>

            <a href="mailto:hello-xceed@outlook.com?subject=Questions%20about%20Xceed" className="text-sm text-slate-600 underline">
              Contact sales
            </a>

            
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Departments</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((deptKey) => (
            <Link key={deptKey} to={`/departments/${encodeURIComponent(deptKey)}`} className="card p-4 hover:shadow-lg transition">
              <div className="font-semibold">{deptKey}</div>
              <div className="text-sm text-slate-500 mt-1">Explore dashboards & datasets</div>
              <div className="mt-3 text-xs text-slate-400">Open {deptKey}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
