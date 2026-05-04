import { useState, useEffect } from "react";
import { Bell, Trash2, Plus } from "lucide-react";
import { useT } from "../lang/LanguageContext";
import apiUrl from "../utils/api";

const EMPTY_FORM = { name: "", keywords: "", source: "", priceMin: "", priceMax: "", region: "" };

export default function AlertsPage({ token, sources }) {
  const { t } = useT();
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${apiUrl}/api/alerts`, { headers })
      .then((r) => r.json())
      .then(({ alerts }) => setAlerts(alerts || []));
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${apiUrl}/api/alerts`, {
        method: "POST", headers,
        body: JSON.stringify({ ...form, priceMin: form.priceMin || null, priceMax: form.priceMax || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlerts((prev) => [data.alert, ...prev]);
        setForm(EMPTY_FORM);
        setShowForm(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id) => {
    const res = await fetch(`${apiUrl}/api/alerts/${id}/toggle`, { method: "PATCH", headers });
    const data = await res.json();
    if (res.ok) setAlerts((prev) => prev.map((a) => (a.id === id ? data.alert : a)));
  };

  const handleDelete = async (id) => {
    await fetch(`${apiUrl}/api/alerts/${id}`, { method: "DELETE", headers });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const criteriaLabel = (alert) => {
    const parts = [
      alert.keywords && `"${alert.keywords}"`,
      alert.source,
      alert.region,
      alert.price_min && `≥ ${alert.price_min.toLocaleString()} €`,
      alert.price_max && `≤ ${alert.price_max.toLocaleString()} €`,
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : t.alertNoCriteria;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">

      {/* Header actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary"
        >
          <Plus size={14} />
          {t.alertNew}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <section className="bg-white rounded-2xl border border-[#E8E8E3] p-6">
          <h2 className="text-[13px] font-semibold mb-4">{t.alertNew}</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertName}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertKeywords}</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder={t.alertKeywordsPlaceholder}
                className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111] placeholder:text-[#ccc]"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertSource}</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
                >
                  <option value="">{t.alertAllSources}</option>
                  {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertRegion}</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  placeholder={t.alertRegionPlaceholder}
                  className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111] placeholder:text-[#ccc]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertPriceMin}</label>
                <input
                  type="number"
                  value={form.priceMin}
                  onChange={(e) => setForm({ ...form, priceMin: e.target.value })}
                  className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.alertPriceMax}</label>
                <input
                  type="number"
                  value={form.priceMax}
                  onChange={(e) => setForm({ ...form, priceMax: e.target.value })}
                  className="h-9 w-full border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white outline-none focus:border-[#111]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? t.alertCreating : t.alertCreate}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                {t.reset}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Liste */}
      {alerts.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <Bell size={32} className="mx-auto text-[#ccc] mb-4" />
          <p className="text-[14px] font-semibold text-[#333] mb-1">{t.alertsEmpty}</p>
          <p className="text-[13px] text-[#888]">{t.alertsEmptySub}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-2xl border border-[#E8E8E3] px-5 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-semibold truncate">{alert.name || t.alertNoCriteria}</p>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${alert.active ? "bg-green-50 text-green-600" : "bg-[#F4F4F2] text-[#aaa]"}`}>
                    {alert.active ? t.alertActive : t.alertInactive}
                  </span>
                </div>
                <p className="text-[12px] text-[#888] truncate">{criteriaLabel(alert)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className={`relative shrink-0 w-9 h-5 rounded-full transition-colors cursor-pointer overflow-hidden ${alert.active ? "bg-green-500" : "bg-[#D8D8D3]"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${alert.active ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                </button>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="shrink-0 text-[#ccc] hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
