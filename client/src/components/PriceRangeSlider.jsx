import { useState, useEffect } from "react";

export default function PriceRangeSlider({ min, max, valueMin, valueMax, onChangeMin, onChangeMax }) {
  if (max <= min) return null;

  const step = Math.pow(10, Math.floor(Math.log10((max - min) / 100)));
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const [inputMin, setInputMin] = useState(String(valueMin));
  const [inputMax, setInputMax] = useState(String(valueMax));

  useEffect(() => { setInputMin(String(valueMin)); }, [valueMin]);
  useEffect(() => { setInputMax(String(valueMax)); }, [valueMax]);

  const commitMin = () => {
    const v = Number(inputMin);
    if (!isNaN(v) && v >= min && v < valueMax) onChangeMin(v);
    else setInputMin(String(valueMin));
  };

  const commitMax = () => {
    const v = Number(inputMax);
    if (!isNaN(v) && v <= max && v > valueMin) onChangeMax(v);
    else setInputMax(String(valueMax));
  };

  return (
    <div className="flex flex-col gap-3 w-56">
      <div className="relative h-1.5 mx-2 mt-1">
        <div className="absolute inset-0 rounded-full bg-[#E5E5E0]" />
        <div
          className="absolute top-0 h-full rounded-full bg-[#1a1a1a]"
          style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
        />
        <input
          type="range" min={min} max={max} step={step}
          value={valueMin}
          onChange={(e) => onChangeMin(Math.min(Number(e.target.value), valueMax - step))}
          className="range-thumb"
          style={{ zIndex: valueMin > max - (max - min) / 10 ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} step={step}
          value={valueMax}
          onChange={(e) => onChangeMax(Math.max(Number(e.target.value), valueMin + step))}
          className="range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative w-full">
          <input
            type="number"
            value={inputMin}
            onChange={(e) => setInputMin(e.target.value)}
            onBlur={commitMin}
            onKeyDown={(e) => e.key === "Enter" && commitMin()}
            className="w-full h-8 border border-[#E5E5E0] rounded-lg pl-2 pr-5 text-[12px] bg-white outline-none font-mono"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#aaa] pointer-events-none">€</span>
        </div>
        <span className="text-[#ccc] text-[11px] flex-shrink-0">—</span>
        <div className="relative w-full">
          <input
            type="number"
            value={inputMax}
            onChange={(e) => setInputMax(e.target.value)}
            onBlur={commitMax}
            onKeyDown={(e) => e.key === "Enter" && commitMax()}
            className="w-full h-8 border border-[#E5E5E0] rounded-lg pl-2 pr-5 text-[12px] bg-white outline-none font-mono"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#aaa] pointer-events-none">€</span>
        </div>
      </div>
    </div>
  );
}
