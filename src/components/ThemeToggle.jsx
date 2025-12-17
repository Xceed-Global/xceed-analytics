// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("xceed_theme") || "light");

  useEffect(() => {
    localStorage.setItem("xceed_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="px-3 py-2 rounded-md border">
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </div>
  );
}
