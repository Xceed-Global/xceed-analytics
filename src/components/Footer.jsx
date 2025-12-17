// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-4 border-t bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="font-semibold text-lg">Xceed Digital</div>
             <div className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} Xceed Digital. All rights reserved.</div>
          </div>

          <div className="flex gap-6 items-center">
            <nav className="flex gap-4">
              <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">Home</Link>
              <Link to="/departments" className="text-sm text-slate-600 hover:text-slate-900">Departments</Link>
              <Link to="/data-manager" className="text-sm text-slate-600 hover:text-slate-900">Data</Link>
              <Link to="/docs" className="text-sm text-slate-600 hover:text-slate-900">Docs</Link>
            </nav>

            <a href="mailto:hello-xceed@outlook.com" className="px-3 py-2 rounded-md border text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
