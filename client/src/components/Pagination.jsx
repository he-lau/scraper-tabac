export default function Pagination({ page, totalPages, onChange }) {
  const handleChange = (p) => { onChange(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = page - delta;
  const right = page + delta;

  let prev = null;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      if (prev !== null && i - prev > 1) pages.push("...");
      pages.push(i);
      prev = i;
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => handleChange(page - 1)}
        disabled={page === 1}
        className="btn-sm-secondary disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#aaa] text-[13px]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={p === page ? "btn-sm-primary" : "btn-sm-secondary"}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handleChange(page + 1)}
        disabled={page === totalPages}
        className="btn-sm-secondary disabled:opacity-30 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
}
