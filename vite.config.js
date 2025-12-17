import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: "dist/stats.html", open: false })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lodash')) return 'vendor-lodash';
            if (id.includes('recharts') || id.includes('chart.js')) return 'vendor-charts';
            if (id.includes('powerbi-client') || id.includes('powerbi')) return 'vendor-powerbi';
            if (id.includes('xlsx') || id.includes('exceljs')) return 'vendor-excel';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800 // increase temporarily if you want
  }
});
