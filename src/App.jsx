// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import DepartmentGallery from "./pages/DepartmentGallery";
import DataManager from "./pages/DataManager";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import ProductLanding from "./pages/ProductLanding"; // <-- new

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/:deptSlug" element={<DepartmentGallery />} />
        <Route path="/data-manager" element={<DataManager />} />
        <Route path="/dash/:id" element={<DashboardPlaceholder />} />
        <Route path="/product/:productId" element={<ProductLanding />} /> {/* new */}
        <Route path="/docs" element={<Docs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
