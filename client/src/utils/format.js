export function fmtPrice(price) {
  if (!price) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getFreshness(iso) {
  const hours = (Date.now() - new Date(iso)) / 36e5;
  if (hours < 24)  return "new";
  if (hours < 48)  return "recent";
  return null;
}

export function truncate(str, max = 280) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}
