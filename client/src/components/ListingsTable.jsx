import React, { useState, useEffect } from "react";
import { ChevronDown, ExternalLink, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fmtPrice, fmtDate, truncate, getFreshness } from "../utils/format";
import { useT } from "../lang/LanguageContext";

const SOURCE_COLORS = {
  huarenjie: { bg: "#FFF0E6", text: "#C05010", border: "#F5C09A" },
  cessionpme: { bg: "#E6F0FF", text: "#1A55B0", border: "#9AB8F5" },
  seloger:    { bg: "#E6F9EE", text: "#0F6E56", border: "#9AE0C0" },
  default:    { bg: "#F0F0EE", text: "#555",    border: "#CCC" },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function FreshBadge({ date }) {
  const { t } = useT();
  const f = getFreshness(date);
  if (!f) return null;
  return f === "new"
    ? <span className="self-start text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200 leading-none">{t.badgeNew}</span>
    : <span className="self-start text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 leading-none">{t.badgeRecent}</span>;
}

function SourceBadge({ source }) {
  const c = SOURCE_COLORS[source] || SOURCE_COLORS.default;
  return (
    <span
      className="inline-block rounded-[5px] text-[11px] font-semibold px-2 py-0.5 tracking-[0.03em] whitespace-nowrap border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {source}
    </span>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <span className="text-[11px] text-[#888] block mb-0.5">{label}</span>
      <span className={`text-[13px] font-medium text-[#1a1a1a] break-words ${mono ? "font-mono text-[#666]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function ExpandedDetail({ listing }) {
  const { t } = useT();
  return (
    <div className="bg-[#F2F2EE] rounded-lg p-4 mt-2.5 flex flex-col gap-2.5">
      <div>
        <p className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold mb-1.5 mt-0">{t.description}</p>
        <p className="text-[12.5px] text-[#444] leading-[1.65] m-0 break-all">{truncate(listing.description)}</p>
      </div>
      <div className="flex flex-col gap-2">
        {listing.region     && <Field label={t.region}     value={listing.region} />}
        {listing.department && <Field label={t.department} value={listing.department} />}
        {listing.address    && <Field label={t.address}    value={listing.address} />}
        <Field label="ID" value={`#${listing.id}`} mono />
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sm-primary no-underline"
        >
          {t.seeAd}
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

// ─── Vue mobile : cards ────────────────────────────────────────────────────

function MobileCard({ listing, expanded, onToggle, isFav, onToggleFav }) {
  const loc = [listing.city, listing.department, listing.region].filter(Boolean)[0];
  return (
    <div
      id={`listing-${listing.id}`}
      className="bg-white border border-[#E8E8E3] rounded-[10px] p-3.5 mb-2.5 cursor-pointer overflow-hidden"
      onClick={onToggle}
    >
      <div className="flex justify-between items-start gap-2.5">
        <div className="flex flex-col gap-1 flex-1">
          <p className="font-medium text-[13px] leading-[1.45] m-0">{listing.title}</p>
          <FreshBadge date={listing.created_at} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(listing.id); }}
            className="text-[#ccc] hover:text-rose-400 cursor-pointer transition-colors"
          >
            <Heart size={14} fill={isFav ? "#fb7185" : "none"} stroke={isFav ? "#fb7185" : "currentColor"} />
          </button>
          <ChevronDown
            size={14}
            className={`text-[#aaa] transition-transform mt-0.5 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <span className="font-mono font-semibold text-[13px]">
          {listing.price ? fmtPrice(listing.price) : <span className="text-[#ccc]">—</span>}
        </span>
        {loc && <span className="text-[12px] text-[#777]">· {loc}</span>}
        <span className="ml-auto"><SourceBadge source={listing.source} /></span>
      </div>

      <p className="mt-2 text-[11px] text-[#bbb] font-mono mb-0">{fmtDate(listing.created_at)}</p>

      {expanded && <ExpandedDetail listing={listing} />}
    </div>
  );
}

// ─── Vue desktop : tableau ─────────────────────────────────────────────────

function ExpandedRow({ listing }) {
  const { t } = useT();
  return (
    <tr>
      <td colSpan={6} className="px-3.5 pb-4 bg-[#FAFAF8]">
        <div className="bg-[#F2F2EE] rounded-lg p-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
          <div>
            <p className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold mb-1.5 mt-0">{t.description}</p>
            <p className="text-[12.5px] text-[#444] leading-[1.65] m-0 break-all">{truncate(listing.description)}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {listing.region     && <Field label={t.region}     value={listing.region} />}
            {listing.department && <Field label={t.department} value={listing.department} />}
            {listing.address    && <Field label={t.address}    value={listing.address} />}
            <Field label="ID" value={`#${listing.id}`} mono />
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sm-primary no-underline self-start mt-1"
            >
              {t.seeAd}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
}

const TH = ({ children }) => (
  <th className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-[#888] tracking-[0.06em] uppercase whitespace-nowrap">
    {children}
  </th>
);

function DesktopTable({ listings, expanded, toggle, favoriteIds, onToggleFavorite }) {
  const { t } = useT();
  return (
    <div className="border border-[#E8E8E3] rounded-xl overflow-hidden">
      <table className="w-full border-collapse text-[13px]">
        <thead className="bg-[#F7F7F5] border-b border-[#E8E8E3]">
          <tr>
            <TH>{t.colTitle}</TH><TH>{t.colPrice}</TH><TH>{t.colLocation}</TH><TH>{t.colSource}</TH><TH>{t.colDate}</TH><TH />
          </tr>
        </thead>
        <tbody>
          {listings.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-[#aaa] text-[13px]">
                {t.noListings}
              </td>
            </tr>
          )}
          {listings.map((l, idx) => (
            <React.Fragment key={l.id}>
              <tr
                id={`listing-${l.id}`}
                onClick={() => toggle(l.id)}
                className={`border-b cursor-pointer transition-colors ${
                  expanded === l.id
                    ? "border-b-0 bg-[#FAFAF8]"
                    : idx % 2 === 0
                    ? "border-[#F0F0EA] bg-white hover:bg-[#FAFAF8]"
                    : "border-[#F0F0EA] bg-[#FDFDFB] hover:bg-[#FAFAF8]"
                }`}
              >
                <td className="px-3.5 py-3 max-w-[340px]">
                  <div className="flex items-center gap-2">
                    <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]">
                      {l.title}
                    </div>
                    <FreshBadge date={l.created_at} />
                  </div>
                </td>
                <td className="px-3.5 py-3 font-mono font-medium whitespace-nowrap">
                  {l.price ? fmtPrice(l.price) : <span className="text-[#ccc]">—</span>}
                </td>
                <td className="px-3.5 py-3 text-[#555] whitespace-nowrap">
                  {[l.city, l.department, l.region].filter(Boolean)[0] || <span className="text-[#ccc]">—</span>}
                </td>
                <td className="px-3.5 py-3"><SourceBadge source={l.source} /></td>
                <td className="px-3.5 py-3 text-[#999] font-mono text-[12px] whitespace-nowrap">
                  {fmtDate(l.created_at)}
                </td>
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(l.id); }}
                      className="text-[#ccc] hover:text-rose-400 cursor-pointer transition-colors"
                    >
                      <Heart size={13} fill={favoriteIds.has(l.id) ? "#fb7185" : "none"} stroke={favoriteIds.has(l.id) ? "#fb7185" : "currentColor"} />
                    </button>
                    <ChevronDown
                      size={14}
                      className={`text-[#aaa] transition-transform ${expanded === l.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </td>
              </tr>
              {expanded === l.id && <ExpandedRow key={`${l.id}-exp`} listing={l} />}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Export principal ──────────────────────────────────────────────────────

export default function ListingsTable({ listings, expandedId, onExpand, favoriteIds = new Set(), onToggleFavorite, isAuthenticated }) {
  const { t } = useT();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const handleFav = (listingId) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    onToggleFavorite(listingId);
  };
  const expanded = expandedId ?? null;
  const toggle = (id) => onExpand(expanded === id ? null : id);

  useEffect(() => {
    if (!expandedId) return;
    const el = document.getElementById(`listing-${expandedId}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [expandedId]);

  if (isMobile) {
    return (
      <div>
        {listings.length === 0 && (
          <p className="text-center py-10 text-[#aaa] text-[13px]">{t.noListings}</p>
        )}
        {listings.map((l) => (
          <MobileCard
            key={l.id} listing={l} expanded={expanded === l.id} onToggle={() => toggle(l.id)}
            isFav={favoriteIds.has(l.id)} onToggleFav={handleFav}
          />
        ))}
      </div>
    );
  }

  return <DesktopTable listings={listings} expanded={expanded} toggle={toggle} favoriteIds={favoriteIds} onToggleFavorite={handleFav} />;
}
