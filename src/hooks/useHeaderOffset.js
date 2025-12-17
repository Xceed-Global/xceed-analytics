// src/hooks/useHeaderOffset.js
import { useEffect } from "react";

export default function useHeaderOffset(headerId = "site-header", mainSelector = ".site-main") {
  useEffect(() => {
    const header = document.getElementById(headerId);
    const main = document.querySelector(mainSelector);
    if (!header || !main) return;

    function apply() {
      // add +16px (or +20px) spacing below the header
      const h = header.offsetHeight -50; 
      main.style.paddingTop = `${h}px`;
    }

    apply();

    const onResize = () => apply();
    window.addEventListener("resize", onResize);

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(apply);
      ro.observe(header);
    }

    const mo = new MutationObserver(apply);
    mo.observe(header, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      mo.disconnect();
    };
  }, [headerId, mainSelector]);
}
