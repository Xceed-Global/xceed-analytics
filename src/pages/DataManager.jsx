// src/pages/DataManager.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import datasetsManifest from "../data/datasets.json";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUpOnSquareIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  FolderIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

import ResponsiveContainer from "../components/ResponsiveContainer";

/**
 * DataManager — 3-column Explorer UI with URL-driven focus
 * - Reads ?dept=...&dash=... (dash can be dashId or dashName)
 * - Expands left tree, focuses middle dashboard and selects root so right shows files
 *
 * Drop-in replacement for your previous DataManager.jsx
 */

/* ---------- helpers ---------- */

function cleanNameForPath(s = "") {
  return s.toString().replace(/[^\w-]/g, "_").toLowerCase();
}
function joinPosix(...parts) {
  return parts.map(p => p.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
}
function buildPublicUrl({ deptName, sectionName, dashObj, file }) {
  if (file.publicUrl) return file.publicUrl;
  if (file.url && (file.url.startsWith("http://") || file.url.startsWith("https://"))) return file.url;
  const cleanDept = cleanNameForPath(deptName);
  const cleanSection = cleanNameForPath(sectionName);
  const cleanDb = cleanNameForPath((dashObj?.dashId || dashObj?.name || "db").toString());
  const relParts = (file.relativePath || "").split("/").filter(Boolean);
  const fileName = (file.url || file.name || "").split("/").pop();
  const path = joinPosix("data", cleanDept, cleanSection, cleanDb, ...relParts, fileName);
  return `${window.location.origin}/${path}`;
}

function buildTreeFromManifest(manifest) {
  const tree = [];
  const company = manifest?.company || {};
  Object.keys(company).forEach((deptName) => {
    const dept = company[deptName];
    const sections = Object.keys(dept || {}).map((sectionName) => {
      const section = dept[sectionName];
      const dashboards = Object.keys(section || {}).map((dashName) => {
        const dashObj = section[dashName] || {};
        const files = (dashObj.dataset?.files || []).map(f => ({ ...f }));
        const folderMap = {};
        files.forEach((f) => {
          const rel = (f.relativePath || "").trim();
          const key = rel ? rel.split("/").filter(Boolean).join("/") : "";
          if (!folderMap[key]) folderMap[key] = { files: [], folders: new Set() };
          folderMap[key].files.push(f);
          if (key) {
            const parts = key.split("/");
            for (let i = 0; i < parts.length; i++) {
              const parent = parts.slice(0, i).join("/");
              const child = parts.slice(0, i + 1).join("/");
              if (!folderMap[parent]) folderMap[parent] = { files: [], folders: new Set() };
              folderMap[parent].folders.add(child);
            }
          }
        });
        if (!folderMap[""]) folderMap[""] = folderMap[""] || { files: [], folders: new Set() };
        return { dashName, dashObj, files, folderMap };
      });
      return { sectionName, dashboards };
    });
    tree.push({ deptName, sections });
  });
  return tree;
}

function folderMapToTree(folderMap) {
  function buildNode(pathKey) {
    const entry = folderMap[pathKey] || { files: [], folders: new Set() };
    const children = Array.from(entry.folders || []).sort().map(k => buildNode(k));
    return {
      key: pathKey,
      name: pathKey === "" ? "(root)" : pathKey,
      shortName: pathKey === "" ? "(root)" : pathKey.split("/").slice(-1)[0],
      files: (entry.files || []).slice().sort((a,b) => (a.name || "").localeCompare(b.name || "")),
      children
    };
  }
  return buildNode("");
}

/* ---------- component ---------- */

export default function DataManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const [manifest, setManifest] = useState(() => JSON.parse(JSON.stringify(datasetsManifest)));
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [expanded, setExpanded] = useState({});
  const [notice, setNotice] = useState("");
  const [activeNode, setActiveNode] = useState(""); // selected node key (dept|sec|dash|path)
  const [focusedDashboard, setFocusedDashboard] = useState(null); // { dept, section, dashName, dashObj, folderTree }

  const rawTree = useMemo(() => buildTreeFromManifest(manifest), [manifest]);

  // helpers to build keys
  function deptKey(d) { return `dept:${d}`; }
  function secKey(d, s) { return `dept:${d}|sec:${s}`; }
  function dashKey(d, s, dd) { return `dept:${d}|sec:${s}|dash:${dd}`; }
  function pathNodeKey(dk, path) { return `${dk}|path:${path}`; }

  // filter tree by search query
  const visibleTree = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return rawTree;

    function fileMatches(file, dept, section, dash) {
      const name = (file.name || file.url || "").toString().toLowerCase();
      const path = (file.relativePath || "").toString().toLowerCase();
      const meta = `${dept} ${section} ${dash}`.toLowerCase();
      return name.includes(q) || path.includes(q) || meta.includes(q);
    }

    const out = [];
    for (const dept of rawTree) {
      const deptCopy = { deptName: dept.deptName, sections: [] };
      for (const sec of dept.sections) {
        const secCopy = { sectionName: sec.sectionName, dashboards: [] };
        for (const dash of sec.dashboards) {
          const fm = dash.folderMap || {};
          const filteredFolderMap = {};
          Object.keys(fm).forEach(key => {
            const files = (fm[key].files || []).filter(f => fileMatches(f, dept.deptName, sec.sectionName, dash.dashName));
            if (files.length > 0) {
              filteredFolderMap[key] = { files: files.slice(), folders: new Set([...fm[key].folders]) };
            }
          });
          Object.keys(filteredFolderMap).forEach(k => {
            const parts = k ? k.split("/") : [];
            for (let i=0;i<parts.length;i++){
              const parent = parts.slice(0,i).join("/");
              if (!filteredFolderMap[parent]) filteredFolderMap[parent] = { files: [], folders: new Set() };
              filteredFolderMap[parent].folders.add(parts.slice(0,i+1).join("/"));
            }
          });

          const hasFiles = Object.keys(filteredFolderMap).length > 0;
          if (hasFiles) {
            if (!filteredFolderMap[""]) filteredFolderMap[""] = filteredFolderMap[""] || { files: [], folders: new Set() };
            secCopy.dashboards.push({ dashName: dash.dashName, dashObj: dash.dashObj, files: dash.files, folderMap: filteredFolderMap });
          } else {
            const meta = `${dash.dashName} ${sec.sectionName} ${dept.deptName}`.toLowerCase();
            if (meta.includes(q)) {
              secCopy.dashboards.push({ dashName: dash.dashName, dashObj: dash.dashObj, files: dash.files, folderMap: dash.folderMap });
            }
          }
        }
        if (secCopy.dashboards.length > 0 || sec.sectionName.toLowerCase().includes(q)) {
          deptCopy.sections.push(secCopy);
        }
      }
      if (deptCopy.sections.length > 0 || dept.deptName.toLowerCase().includes(q)) {
        out.push(deptCopy);
      }
    }
    return out;
  }, [rawTree, query]);

  // expand/collapse helpers
  function collectVisibleKeys(treeSrc) {
    const keys = [];
    treeSrc.forEach(dept => {
      const deptKey = `dept:${dept.deptName}`; keys.push(deptKey);
      dept.sections.forEach(sec => {
        const secKey = `${deptKey}|sec:${sec.sectionName}`; keys.push(secKey);
        sec.dashboards.forEach(dash => {
          const dashKey = `${secKey}|dash:${dash.dashName}`; keys.push(dashKey);
          Object.keys(dash.folderMap || {}).forEach(pathKey => {
            keys.push(`${dashKey}|path:${pathKey}`);
          });
        });
      });
    });
    return keys;
  }

  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 3000);
      return () => clearTimeout(t);
    }
  }, [notice]);

  function expandAllVisible() {
    const keys = collectVisibleKeys(visibleTree);
    const obj = {};
    keys.forEach(k => obj[k] = true);
    setExpanded(obj);
    setNotice("Expanded all visible");
  }
  function collapseAll() {
    setExpanded({});
    setNotice("Collapsed all");
  }

  function exportManifest() {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "datasets.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Manifest exported");
  }

  function removeFileClient(deptName, sectionName, dashName, fileId) {
    const dashObj = manifest.company?.[deptName]?.[sectionName]?.[dashName];
    if (!dashObj) return;
    dashObj.dataset.files = (dashObj.dataset.files || []).filter(f => f.id !== fileId);
    setManifest({ ...manifest });
    setNotice("Removed (client-only)");
  }

  function copyLink(file, deptName, sectionName, dashName) {
    const dashObj = manifest.company?.[deptName]?.[sectionName]?.[dashName] || {};
    const url = file.publicUrl || buildPublicUrl({ deptName, sectionName, dashObj, file });
    navigator.clipboard?.writeText(url);
    setNotice("Link copied");
  }

  function sortFiles(arr) {
    const a = arr.slice();
    if (sortBy === "name-asc") a.sort((x,y)=> (x.name||"").localeCompare(y.name||""));
    if (sortBy === "name-desc") a.sort((x,y)=> (y.name||"").localeCompare(x.name||""));
    return a;
  }

  // get files for selected node
  function getFilesForNodeKey(nodeKey) {
    if (!nodeKey) return [];
    const parts = nodeKey.split("|");
    const dept = parts[0]?.replace(/^dept:/, "");
    const sec = parts[1]?.replace(/^sec:/, "");
    const dash = parts[2]?.replace(/^dash:/, "");
    const pathPart = parts.find(p => p.startsWith("path:"));
    const path = pathPart ? pathPart.replace(/^path:/, "") : null;

    if (!dept) return [];
    // dept only
    if (dept && !sec) {
      const depObj = manifest.company?.[dept] || {};
      let coll = [];
      Object.keys(depObj).forEach(s => {
        Object.keys(depObj[s] || {}).forEach(d => {
          const files = (depObj[s][d]?.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: s, _dash: d }));
          coll = coll.concat(files);
        });
      });
      return sortFiles(coll);
    }
    // dept + sec (no dash)
    if (dept && sec && !dash) {
      const secObj = manifest.company?.[dept]?.[sec] || {};
      let coll = [];
      Object.keys(secObj).forEach(d => {
        const files = (secObj[d]?.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: sec, _dash: d }));
        coll = coll.concat(files);
      });
      return sortFiles(coll);
    }

    // dept+sec+dash
    const dashObj = manifest.company?.[dept]?.[sec]?.[dash] || {};
    let files = (dashObj.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: sec, _dash: dash }));
    if (path !== null && path !== "") {
      files = files.filter(f => ((f.relativePath || "") === path || (f.relativePath || "").startsWith(path + "/")));
    }
    return sortFiles(files);
  }

  function breadcrumbsFromNodeKey(nodeKey) {
    if (!nodeKey) return [];
    const parts = nodeKey.split("|");
    const crumbs = [];
    let acc = "";
    for (let i=0;i<parts.length;i++) {
      const p = parts[i];
      if (i === 0) {
        acc = p;
        crumbs.push({ key: acc, label: p.replace(/^dept:/, "") });
      } else {
        acc = acc + "|" + p;
        crumbs.push({ key: acc, label: p.replace(/^sec:|^dash:|^path:/, "") });
      }
    }
    return crumbs;
  }

  // folder node for middle pane
  function FolderNode({ node, parentKey }) {
    const thisKey = parentKey + "|path:" + (node.key || "");
    const isExpanded = !!expanded[thisKey];
    const isActive = activeNode === thisKey;

    return (
      <div className="tree-node" key={thisKey}>
        <div
          onClick={() => setActiveNode(thisKey)}
          className={`tree-item ${isActive ? "active" : ""} hover:shadow-sm rounded-md transition`}
          style={{ paddingLeft: `${28 + (node.key === "" ? 0 : (node.key.split("/").length * 16))}px` }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [thisKey]: !prev[thisKey] })); }}
            className="toggle-btn p-1 rounded-md hover:bg-slate-100"
            aria-label="toggle"
          >
            { (node.children.length > 0)
              ? (isExpanded ? <ChevronDownIcon className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />)
              : <span style={{ display: "inline-block", width: 16 }} /> }
          </button>

          <div className="min-w-0 flex items-center gap-3">
            <FolderIcon className="w-4 h-4 text-slate-400" />
            <div>
              <div className={`text-sm font-medium truncate ${isActive ? "text-rose-700" : "text-slate-700"}`}>{node.name === "(root)" ? "(root)" : node.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{(node.files || []).length} files</div>
            </div>
          </div>
        </div>

        {isExpanded && node.children.length > 0 && (
          <div className="pl-0 mt-1 space-y-1">
            {node.children.map(child => (
              <FolderNode key={child.key} node={child} parentKey={parentKey} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // init: expand departments and select first dash (and read URL params)
  useEffect(() => {
    const obj = {};
    rawTree.forEach(d => { obj[deptKey(d.deptName)] = true; });
    setExpanded(obj);

    const params = new URLSearchParams(location.search);
    const deptParam = params.get("dept");
    const dashParam = params.get("dash"); // can be dashId or dashName

    // helper to find dashboard in manifest. returns {dept, section, dashName, dashObj, folderMap}
    function findDashboardByParams(deptName, dashIdentifier) {
      if (!manifest?.company) return null;
      // search only dept if present
      const deptList = deptName ? [deptName] : Object.keys(manifest.company);
      for (const dept of deptList) {
        const secObj = manifest.company[dept] || {};
        for (const section of Object.keys(secObj)) {
          const s = secObj[section];
          for (const dashName of Object.keys(s)) {
            const dashObj = s[dashName];
            const id = dashObj?.dashId || dashName;
            // match by either id or name (case-insensitive)
            if (!dashIdentifier) {
              // if no dashIdentifier provided, return first one
              return { dept, section, dashName, dashObj, folderMap: dashObj?.folderMap || dashObj?.dataset?.folderMap || dashObj?.dataset?.files ? dashObj?.folderMap || buildFolderMapFromFiles(dashObj?.dataset?.files || []) : {} };
            }
            if (id === dashIdentifier || dashName === dashIdentifier || id.toString().toLowerCase() === dashIdentifier.toLowerCase() || dashName.toLowerCase() === dashIdentifier.toLowerCase()) {
              return { dept, section, dashName, dashObj, folderMap: dashObj?.folderMap || dashObj?.dataset?.folderMap || dashObj?.dataset?.files ? dashObj?.folderMap || buildFolderMapFromFiles(dashObj?.dataset?.files || []) : {} };
            }
          }
        }
      }
      return null;
    }

    // fallback to build folder map from files if manifest stores files without folderMap
    function buildFolderMapFromFiles(files = []) {
      const folderMap = {};
      files.forEach(f => {
        const rel = (f.relativePath || "").trim();
        const key = rel ? rel.split("/").filter(Boolean).join("/") : "";
        if (!folderMap[key]) folderMap[key] = { files: [], folders: new Set() };
        folderMap[key].files.push(f);
        if (key) {
          const parts = key.split("/");
          for (let i = 0; i < parts.length; i++) {
            const parent = parts.slice(0, i).join("/");
            const child = parts.slice(0, i + 1).join("/");
            if (!folderMap[parent]) folderMap[parent] = { files: [], folders: new Set() };
            folderMap[parent].folders.add(child);
          }
        }
      });
      if (!folderMap[""]) folderMap[""] = folderMap[""] || { files: [], folders: new Set() };
      return folderMap;
    }

    // if URL provides dept & dash, focus that dashboard
    if (dashParam) {
      const found = findDashboardByParams(deptParam, dashParam);
      if (found) {
        const { dept, section, dashName, dashObj, folderMap } = found;
        const dk = dashKey(dept, section, dashName);
        setExpanded(prev => ({ ...prev, [deptKey(dept)]: true, [secKey(dept, section)]: true, [dk]: true }));
        setFocusedDashboard({
          dept,
          section,
          dashName,
          dashObj,
          folderTree: folderMapToTree(folderMap || {})
        });
        // set active node to dashboard root (so files show)
        setActiveNode(dk);
        return;
      }
    }

    // else default select first available dashboard (existing behavior)
    if (!activeNode && rawTree.length > 0) {
      const d = rawTree[0];
      const s = d.sections && d.sections[0];
      const dash = s && s.dashboards && s.dashboards[0];
      if (d && s && dash) {
        const k = dashKey(d.deptName, s.sectionName, dash.dashName);
        setActiveNode(k);
        setFocusedDashboard({
          dept: d.deptName,
          section: s.sectionName,
          dashName: dash.dashName,
          dashObj: dash.dashObj,
          folderTree: folderMapToTree(dash.folderMap || {})
        });
      } else if (d && s) {
        setActiveNode(secKey(d.deptName, s.sectionName));
      } else if (d) {
        setActiveNode(deptKey(d.deptName));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, rawTree]);

  // when user clicks dashboard from left explorer: focus it
  function focusDashboardFromLeft(deptName, sectionName, dashName, dashEntry) {
    const dk = dashKey(deptName, sectionName, dashName);
    const folderMap = (dashEntry && dashEntry.folderMap) || dashEntry?.dashObj?.dataset?.folderMap || dashEntry?.dashObj?.folderMap || dashEntry?.dashObj?.dataset?.files ? dashEntry.folderMap || buildFolderMapFromFiles(dashEntry?.dashObj?.dataset?.files || []) : {};
    setExpanded(prev => ({ ...prev, [deptKey(deptName)]: true, [secKey(deptName, sectionName)]: true, [dk]: true }));
    setFocusedDashboard({
      dept: deptName,
      section: sectionName,
      dashName,
      dashObj: dashEntry?.dashObj || {},
      folderTree: folderMapToTree(folderMap || {})
    });
    setActiveNode(dk);
    // update URL for shareability
    navigate(`/data-manager?dept=${encodeURIComponent(deptName)}&dash=${encodeURIComponent(dashEntry?.dashObj?.dashId || dashName)}`, { replace: true });
  }

  // helper: build folder map from files (needs to be inside component scope)
  function buildFolderMapFromFiles(files = []) {
    const folderMap = {};
    files.forEach(f => {
      const rel = (f.relativePath || "").trim();
      const key = rel ? rel.split("/").filter(Boolean).join("/") : "";
      if (!folderMap[key]) folderMap[key] = { files: [], folders: new Set() };
      folderMap[key].files.push(f);
      if (key) {
        const parts = key.split("/");
        for (let i = 0; i < parts.length; i++) {
          const parent = parts.slice(0, i).join("/");
          const child = parts.slice(0, i + 1).join("/");
          if (!folderMap[parent]) folderMap[parent] = { files: [], folders: new Set() };
          folderMap[parent].folders.add(child);
        }
      }
    });
    if (!folderMap[""]) folderMap[""] = folderMap[""] || { files: [], folders: new Set() };
    return folderMap;
  }

  // UI: files for active node
  function getFilesForNodeKey(nodeKey) {
    if (!nodeKey) return [];
    const parts = nodeKey.split("|");
    const dept = parts[0]?.replace(/^dept:/, "");
    const sec = parts[1]?.replace(/^sec:/, "");
    const dash = parts[2]?.replace(/^dash:/, "");
    const pathPart = parts.find(p => p.startsWith("path:"));
    const path = pathPart ? pathPart.replace(/^path:/, "") : null;

    if (!dept) return [];
    if (dept && !sec) {
      const depObj = manifest.company?.[dept] || {};
      let coll = [];
      Object.keys(depObj).forEach(s => {
        Object.keys(depObj[s] || {}).forEach(d => {
          const files = (depObj[s][d]?.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: s, _dash: d }));
          coll = coll.concat(files);
        });
      });
      return sortFiles(coll);
    }
    if (dept && sec && !dash) {
      const secObj = manifest.company?.[dept]?.[sec] || {};
      let coll = [];
      Object.keys(secObj).forEach(d => {
        const files = (secObj[d]?.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: sec, _dash: d }));
        coll = coll.concat(files);
      });
      return sortFiles(coll);
    }
    const dashObj = manifest.company?.[dept]?.[sec]?.[dash] || {};
    let files = (dashObj.dataset?.files || []).map(f => ({ ...f, _dept: dept, _sec: sec, _dash: dash }));
    if (path !== null && path !== "") {
      files = files.filter(f => ((f.relativePath || "") === path || (f.relativePath || "").startsWith(path + "/")));
    }
    return sortFiles(files);
  }

  function sortFiles(arr) {
    const a = arr.slice();
    if (sortBy === "name-asc") a.sort((x,y)=> (x.name||"").localeCompare(y.name||""));
    if (sortBy === "name-desc") a.sort((x,y)=> (y.name||"").localeCompare(x.name||""));
    return a;
  }

  // breadcrumbs
  function breadcrumbsFromNodeKey(nodeKey) {
    if (!nodeKey) return [];
    const parts = nodeKey.split("|");
    const crumbs = [];
    let acc = "";
    for (let i=0;i<parts.length;i++) {
      const p = parts[i];
      if (i === 0) {
        acc = p;
        crumbs.push({ key: acc, label: p.replace(/^dept:/, "") });
      } else {
        acc = acc + "|" + p;
        crumbs.push({ key: acc, label: p.replace(/^sec:|^dash:|^path:/, "") });
      }
    }
    return crumbs;
  }

  const activeFiles = useMemo(() => getFilesForNodeKey(activeNode), [activeNode, manifest, sortBy]);
  const crumbs = useMemo(() => breadcrumbsFromNodeKey(activeNode), [activeNode]);

  /* ---------- Render ---------- */
  return (
    <ResponsiveContainer>
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-md px-2 py-1 shadow-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search dept / dash / path / file"
              className="ml-2 text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1 border rounded-md text-sm">
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>

          <button onClick={expandAllVisible} className="px-2 py-1 rounded-md border text-sm flex items-center gap-2 bg-white shadow-sm">
            <ArrowUpOnSquareIcon className="w-4 h-4" /> Expand
          </button>

          <button onClick={collapseAll} className="px-2 py-1 rounded-md border text-sm bg-white shadow-sm">Collapse</button>

          <button onClick={exportManifest} className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm shadow">Export</button>
        </div>
      </div>

      {/* ---------- Fixed-size explorer card (replace your existing outer container) ---------- */}
<div className="bg-white rounded-lg shadow-sm border w-full max-w-[1600px] h-[700px] mx-auto">
  <div className="grid grid-cols-12 h-full">
    {/* LEFT: Explorer */}
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 border-r bg-slate-50">
      <div className="p-4 h-full overflow-auto tree-wrap">
        <div className="text-xs text-slate-500 mb-3">Explorer</div>

        {visibleTree.length === 0 && <div className="text-xs text-slate-500">No results</div>}

        <div className="space-y-2">
          {visibleTree.map(dept => {
            const dKey = deptKey(dept.deptName);
            return (
              <div key={dept.deptName}>
                {/* Department */}
                <div
                  onClick={() => { setActiveNode(dKey); setExpanded(prev => ({ ...prev, [dKey]: true })); }}
                  className={`tree-node root`}
                >
                  <div className={`tree-item ${activeNode === dKey ? "active" : ""} depth-0`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [dKey]: !prev[dKey] })); }}
                      className="toggle-btn p-1 rounded-md hover:bg-slate-100"
                      aria-label="toggle"
                    >
                      {expanded[dKey] ? <ChevronDownIcon className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                    </button>

                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${activeNode === dKey ? "text-emerald-700" : "text-slate-700"}`}>{dept.deptName}</div>
                      <div className="text-[11px] text-slate-400">{dept.sections.length} sections</div>
                    </div>
                  </div>
                </div>

                {expanded[dKey] && (
                  <div className="pl-0 mt-1 space-y-1">
                    {dept.sections.map(sec => {
                      const sKey = secKey(dept.deptName, sec.sectionName);
                      return (
                        <div key={sKey}>
                          {/* Section */}
                          <div
                            onClick={() => { setActiveNode(sKey); setExpanded(prev => ({ ...prev, [sKey]: true })); }}
                            className="tree-node"
                          >
                            <div className={`tree-item ${activeNode === sKey ? "active" : ""} depth-1`}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [sKey]: !prev[sKey] })); }}
                                className="toggle-btn p-1 rounded-md hover:bg-slate-100"
                              >
                                {expanded[sKey] ? <ChevronDownIcon className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                              </button>

                              <div className="min-w-0">
                                <div className={`text-xs font-semibold truncate ${activeNode === sKey ? "text-emerald-700" : "text-slate-700"}`}>{sec.sectionName}</div>
                                <div className="text-[11px] text-slate-400">{sec.dashboards.length} dashboards</div>
                              </div>
                            </div>
                          </div>

                          {expanded[sKey] && (
                            <div className="pl-0 mt-1 space-y-1">
                              {sec.dashboards.map(d => {
                                const dk = dashKey(dept.deptName, sec.sectionName, d.dashName);
                                return (
                                  <div key={dk}>
                                    {/* Dashboard (click to focus in middle) */}
                                    <div
                                      onClick={() => focusDashboardFromLeft(dept.deptName, sec.sectionName, d.dashName, d)}
                                      className="tree-node"
                                    >
                                      <div className={`tree-item ${focusedDashboard?.dashName === d.dashName ? "root-dashboard" : ""} depth-2`}>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({ ...prev, [dk]: !prev[dk] })); }}
                                          className="toggle-btn p-1 rounded-md hover:bg-slate-100"
                                        >
                                          {expanded[dk] ? <ChevronDownIcon className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
                                        </button>

                                        <div className="min-w-0">
                                          <div className={`text-xs font-medium truncate ${focusedDashboard?.dashName === d.dashName ? "text-rose-700" : "text-slate-700"}`}>{d.dashName}</div>
                                          <div className="text-[11px] text-slate-400">{(d.dashObj.dataset?.files || []).length} files</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>

    {/* MIDDLE: Focused Dashboard root + folder tree */}
    <aside className="col-span-12 md:col-span-4 lg:col-span-4 border-r bg-white">
      <div className="p-4 h-full overflow-auto">
        <div className="text-xs text-slate-500 mb-3">Focused Dashboard</div>

        {!focusedDashboard && (
          <div className="text-sm text-slate-500">Select a dashboard on the left to view its folder tree.</div>
        )}

        {focusedDashboard && (
          <div className="space-y-3">
            <div className="p-3 rounded-md border bg-rose-50 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-rose-700 truncate">{focusedDashboard.dashName}</div>
                  <div className="text-xs text-slate-400">{focusedDashboard.dept} • {focusedDashboard.section}</div>
                </div>
                <div className="text-xs text-slate-500">{(focusedDashboard.dashObj?.dataset?.files || []).length} files</div>
              </div>
            </div>

            <div className="mt-2">
              <FolderNode node={focusedDashboard.folderTree} parentKey={dashKey(focusedDashboard.dept, focusedDashboard.section, focusedDashboard.dashName)} />
            </div>
          </div>
        )}
      </div>
    </aside>

    {/* RIGHT: Files list (for activeNode) */}
    <main className="col-span-12 md:col-span-4 lg:col-span-5 p-4 h-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-slate-400">Location</div>
            <div className="mt-1 text-sm">
              {crumbs.length === 0 ? <span className="text-slate-500">No selection</span> : crumbs.map((c,i) => (
                <button key={c.key} onClick={() => setActiveNode(c.key)} className={`text-sm px-2 py-1 rounded-md ${i===crumbs.length-1 ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-100 text-slate-600"}`}>{c.label}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500">Items</div>
            <div className="text-sm font-medium px-2 py-1 bg-slate-100 rounded">{activeFiles.length}</div>
          </div>
        </div>

        <div className="bg-white border rounded-md p-3 space-y-2 shadow-sm flex-1 overflow-auto">
          {activeFiles.length === 0 && <div className="text-sm text-slate-500 p-4">No files in this location.</div>}

          <div className="grid sm:grid-cols-1 gap-3">
            {activeFiles.map(f => {
              const fileHref = f.publicUrl || buildPublicUrl({ deptName: f._dept || "", sectionName: f._sec || "", dashObj: manifest.company?.[f._dept]?.[f._sec]?.[f._dash] || {}, file: f });
              return (
                <div key={f.id || (f.name + fileHref)} className="flex items-center justify-between gap-3 p-3 border rounded-md hover:shadow-md transition">
                  <div className="min-w-0 flex items-center gap-3">
                    <DocumentIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm font-semibold truncate">{f.name || f.url || "Unnamed file"}</div>
                      <div className="text-xs text-slate-400 truncate">{f.relativePath || "(root)"} • {(f.type || "file")}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={fileHref} target="_blank" rel="noreferrer noopener" onClick={(e)=>e.stopPropagation()} className="px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1">
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" /> Open
                    </a>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {notice && <div className="mt-3 text-sm text-emerald-700">{notice}</div>}
      </div>
    </main>
  </div>
</div>

    </div>
    </ResponsiveContainer>
  );
}
