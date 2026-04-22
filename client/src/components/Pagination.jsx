export default function Pagination({ page, totalPages, onChange }) {
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
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-[13px] border border-[#E5E5E0] bg-white text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[#F7F7F5]"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#aaa] text-[13px]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-lg text-[13px] border cursor-pointer ${
              p === page
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : "border-[#E5E5E0] bg-white text-[#1a1a1a] hover:bg-[#F7F7F5]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-[13px] border border-[#E5E5E0] bg-white text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[#F7F7F5]"
      >
        →
      </button>
    </div>
  );
}
