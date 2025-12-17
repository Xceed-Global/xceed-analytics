// src/components/Header.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { name: "Home", to: "/" },
    { name: "Departments", to: "/departments" },
    { name: "Data Manager", to: "/data-manager" },
    { name: "Docs", to: "/docs" },
  ];

  return (
    <header id="site-header" className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-10">
        {/* MAIN HEADER */}
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Logo + Name */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-xceed-500 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-md">
              X
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">Xceed Analytics</div>
            </div>
          </Link>

          {/* CENTER NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <NavLink
                key={n.name}
                to={n.to}
                className={({ isActive }) =>
                  `text-[15px] font-semibold tracking-wide px-3 py-2 rounded-md transition ${
                    isActive ? "text-xceed-600 border-b-2 border-xceed-500" : "text-slate-700 hover:text-xceed-600"
                  }`
                }
              >
                {n.name}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4">
            

            <Link to="/departments" className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-md bg-xceed-500 hover:bg-xceed-600 text-white text-[15px] font-semibold shadow-sm transition">
              Open Portal
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md hover:bg-slate-100" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <XMarkIcon className="w-7 h-7 text-slate-700" /> : <Bars3Icon className="w-7 h-7 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 space-y-2">
            {nav.map((n) => (
              <NavLink
                key={n.name}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block text-[16px] font-medium px-3 py-2 rounded-md ${isActive ? "text-xceed-600 bg-xceed-50" : "text-slate-700 hover:bg-slate-50"}`}
              >
                {n.name}
              </NavLink>
            ))}
            <Link to="/departments/finance" onClick={() => setOpen(false)} className="block mt-2 px-4 py-2 rounded-md bg-xceed-500 text-white text-[15px] font-semibold text-center shadow-sm">Open Portal</Link>
          </div>
        </div>
      )}
    </header>
  );
}
