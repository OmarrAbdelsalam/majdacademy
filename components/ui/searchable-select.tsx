"use client";
import { useState, useEffect, useRef } from "react";

export function SearchableSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  disabled = false,
  isRTL
}: { 
  value: string; 
  onValueChange: (v: string) => void; 
  options: { value: string; label: string; sub?: string }[]; 
  placeholder: string;
  disabled?: boolean;
  isRTL?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()) || o.sub?.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find(o => o.value === value)?.label || value || placeholder;

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => !disabled && setOpen(!open)}
        className={`flex w-full items-center justify-between gap-2 bg-[#F7F7F8] rounded-2xl px-5 h-[54px] border border-transparent text-[15px] font-medium outline-none transition-all duration-200 cursor-pointer select-none hover:bg-[#f0f0f0] ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${open ? "border-[#E9C237]/60 bg-white shadow-[0_0_0_3px_rgba(233,194,55,0.08)]" : ""}`}
      >
        <span className={!value ? "text-[#888]" : "text-[#1a1a1a] truncate"}>{selectedLabel}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-[#f0f0f0] overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[#f5f5f5]">
            <input 
              type="text" 
              placeholder={isRTL ? "بحث..." : "Search..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-[#eee] rounded-xl px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#999] outline-none focus:border-[#E9C237]/60"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-5 py-4 text-center text-[#999] text-[13px]">{isRTL ? "لا توجد نتائج" : "No results found"}</div>
            ) : (
              filtered.map(o => (
                <div 
                  key={o.value} 
                  onClick={() => { onValueChange(o.value); setOpen(false); setSearch(""); }}
                  className={`flex flex-col cursor-pointer px-4 py-2.5 rounded-xl text-[14px] transition-colors hover:bg-[#f7f7f7] ${value === o.value ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/5" : "text-[#1a1a1a] font-medium"}`}
                >
                  <span className="truncate">{o.label}</span>
                  {o.sub && <span className="text-[11px] text-[#999] mt-0.5 truncate">{o.sub}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
