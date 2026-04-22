import { useState } from "react";
import { useT } from "../lang/LanguageContext";

const NAV = [
  {
    key: "listings",
    labelKey: "navListings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    key: "stats",
    labelKey: "navStats",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    key: "settings",
    labelKey: "navSettings",
    disabled: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children, title, actions, active, onNavChange }) {
  const { t, lang, toggle } = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#111] flex flex-col transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-[#222]">
          <p className="text-[10px] font-mono text-[#555] tracking-[0.12em] uppercase mb-1">scraper</p>
          <p className="text-[15px] font-semibold text-white tracking-tight m-0">Tabac · Bar · FDJ</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ key, labelKey, icon, disabled }) => (
            <button
              key={key}
              disabled={disabled}
              onClick={() => !disabled && onNavChange(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-left transition-colors
                ${disabled ? "text-[#444] cursor-not-allowed" :
                  active === key ? "bg-white text-[#111]" : "text-[#999] hover:text-white hover:bg-[#1a1a1a] cursor-pointer"
                }`}
            >
              {icon}
              {t[labelKey]}
              {disabled && <span className="ml-auto text-[10px] text-[#333] font-mono">soon</span>}
            </button>
          ))}
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

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E3] h-14 flex items-center px-6 gap-4">
          <button
            className="lg:hidden text-[#888] hover:text-[#111] cursor-pointer mr-1"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
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
