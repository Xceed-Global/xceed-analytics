// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-white card p-8 hero-accent">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Xceed — Business Apps</h1>
            <p className="mt-3 text-slate-600 max-w-xl">
              A suite of lightweight business products that bring data, automation and intelligence to your teams.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/product/xceed-analytics" className="inline-flex items-center px-5 py-3 rounded-md bg-xceed-500 text-white font-semibold shadow">
                Explore Xceed Analytics
              </Link>
              <Link to="/docs" className="inline-flex items-center px-4 py-3 rounded-md border">Documentation</Link>
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

      {/* PRODUCTS GRID */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="text-sm text-slate-500">Choose a product to explore or buy</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="group bg-white border rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:-translate-y-1 transition">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{p.short}</div>
                    <div className="mt-2 text-sm text-slate-600 truncate">{p.tagline}</div>
                    <div className="mt-3 flex gap-2 items-center">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{p.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Link to={`/product/${encodeURIComponent(p.id)}`} className="px-3 py-2 rounded-md border text-sm">
                      Details
                    </Link>

                    {/* For product that uses existing portal, link to departments */}
                    <a
                      href={p.portalUrl}
                      className="px-3 py-2 rounded-md bg-xceed-500 text-white text-sm font-medium"
                    >
                      Open Portal
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROMO / BUY area (keeps main offer) */}
      <section className="card p-6 bg-gradient-to-r from-yellow-50 to-white border">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">Buy Xceed Analytics — Dashboard & Data Management</h3>
            <p className="mt-2 text-slate-600 max-w-prose">
              Get a ready-to-deploy Xceed Analytics system plus setup support for only <strong>$29.98</strong>.
              This includes dashboard development, data management, and onboarding.
            </p>
            <ul className="mt-3 text-sm text-slate-500 list-disc list-inside">
              <li>One-time fee: <strong>$29.98</strong></li>
              <li>Dashboard development & configuration</li>
              <li>Data cleaning & mapping</li>
              <li>Initial onboarding call & support</li>
            </ul>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:items-end gap-3">
            <a
              href={products[0].buyUrl}
              className="inline-flex items-center justify-center px-10 py-5 rounded-md bg-blue-600 text-white font-bold shadow hover:opacity-95"
            >
              Buy Xceed Analytics
            </a>

            <a href="mailto:hello-xceed@outlook.com?subject=Questions%20about%20Xceed" className="text-sm text-slate-600 underline">
              Contact sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
