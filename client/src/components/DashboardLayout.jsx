import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, BarChart2, Settings, Menu } from "lucide-react";
import { useT } from "../lang/LanguageContext";

const NAV = [
  { key: "listings", path: "/",      labelKey: "navListings", icon: <LayoutGrid size={16} /> },
  { key: "stats",    path: "/stats", labelKey: "navStats",    icon: <BarChart2 size={16} /> },
  { key: "settings", path: null,     labelKey: "navSettings", icon: <Settings size={16} />, disabled: true },
];


export default function DashboardLayout({ children, title, actions }) {
  const { t, lang, toggle } = useT();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex">

      {/* Sidebar 
      * On joue sur la translation pour afficher/cacher la side bar
      *
      */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#111] flex flex-col transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#222]">
          <p className="text-[10px] font-mono text-[#555] tracking-[0.12em] uppercase mb-1">scraper</p>
          <p className="text-[15px] font-semibold text-white tracking-tight m-0">Tabac · Bar · FDJ</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ key, path, labelKey, icon, disabled }) => {
            const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
            const cls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-left transition-colors ${
              disabled ? "text-[#444] cursor-not-allowed" :
              isActive ? "bg-white text-[#111]" : "text-[#999] hover:text-white hover:bg-[#1a1a1a] cursor-pointer"
            }`;
            if (disabled) {
              return (
                <button key={key} disabled className={cls}>
                  {icon}{t[labelKey]}
                  <span className="ml-auto text-[10px] text-[#333] font-mono">soon</span>
                </button>
              );
            }
            return (
              <Link key={key} to={path} className={cls} onClick={() => setMobileOpen(false)}>
                {icon}{t[labelKey]}
              </Link>
            );
          })}
        </nav>

        {/* Lang switcher */}
        <div className="px-4 py-4 border-t border-[#222]">
          <div className="flex items-center border border-[#333] rounded-lg overflow-hidden text-[11px] font-medium w-fit">
            {["fr", "zh"].map((l) => (
              <button
                key={l}
                onClick={() => l !== lang && toggle()}
                className={`px-3 py-1.5 cursor-pointer transition-colors ${lang === l ? "bg-white text-[#111]" : "bg-transparent text-[#666] hover:text-white"}`}
              >
                {l === "fr" ? "FR" : "中文"}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 
      * Mobile overlay : permet d'assombrire le contenu
      *
      */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50  lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E3] h-14 flex items-center px-6 gap-4">
          {/**
           * Menu burger caché si grand écran
           */}
          <button
            className="lg:hidden text-[#888] hover:text-[#111] cursor-pointer mr-1"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          <h1 className="text-[15px] font-semibold tracking-tight flex-1">{title}</h1>
          <div className="flex items-center gap-2.5">{actions}</div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
