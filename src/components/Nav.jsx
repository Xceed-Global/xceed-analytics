import React from "react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Nav(){
  return (
    <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-xceed-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
              XD
            </div>
            <div>
              <div className="font-semibold text-slate-900">Xceed Digital</div>
              <div className="text-xs text-slate-500">Data · Automation · AI</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Home</Link>
            <Link to="/departments" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Departments</Link>
            <a href="#" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Docs</a>
            <Link to="/departments/finance" className="ml-2 inline-flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-xceed-500 to-purple-500 text-white text-sm font-semibold shadow">Open Portal</Link>
          </nav>
          <Link to="/data-manager" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Data Manager</Link>


          <div className="md:hidden">
            <button className="p-2 rounded-md text-slate-600">
              <Bars3Icon className="w-6 h-6"/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
