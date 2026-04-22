const HEADERS = ["id", "title", "price", "city", "department", "region", "source", "url", "created_at"];

export function exportCSV(data, filename = "listings") {
  const rows = data.map((r) =>
    HEADERS.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  const csv = [HEADERS.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
