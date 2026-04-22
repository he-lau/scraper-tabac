import { useT } from "../lang/LanguageContext";

export default function Navbar({ onRefetch, onExport, exportCount }) {
  const { t, lang, toggle } = useT();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a] text-white h-14 flex items-center px-6 gap-4">
      <div className="flex-1">
        <p className="text-[10px] font-mono text-[#666] tracking-[0.12em] uppercase leading-none mb-0.5">{t.eyebrow}</p>
        <p className="text-[15px] font-semibold tracking-tight leading-none m-0">{t.title}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefetch}
          className="flex items-center gap-1.5 border border-[#333] rounded-lg px-3 py-1.5 text-[12px] font-medium cursor-pointer bg-transparent text-[#ccc] hover:text-white hover:border-[#555] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span className="hidden sm:inline">{t.refresh}</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 border border-[#333] rounded-lg px-3 py-1.5 text-[12px] font-medium cursor-pointer bg-transparent text-[#ccc] hover:text-white hover:border-[#555] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">{t.export} ({exportCount})</span>
        </button>

        <div className="flex items-center border border-[#333] rounded-lg overflow-hidden text-[11px] font-medium">
          {["fr", "zh"].map((l) => (
            <button
              key={l}
              onClick={() => l !== lang && toggle()}
              className={`px-2.5 py-1.5 cursor-pointer transition-colors ${lang === l ? "bg-white text-[#1a1a1a]" : "bg-transparent text-[#888] hover:text-white"}`}
            >
              {l === "fr" ? "FR" : "中文"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
