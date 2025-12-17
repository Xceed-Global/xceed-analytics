// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-slate-600 mt-4">Page not found.</p>
      <div className="mt-6">
        <Link to="/" className="px-4 py-2 rounded-md border">Return home</Link>
      </div>
    </div>
  );
}
