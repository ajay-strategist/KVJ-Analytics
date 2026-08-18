"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, RotateCcw, Pipette } from "lucide-react";

interface ColorPickerProps {
  color?: string;
  onChange: (color: string | undefined) => void;
  label?: string;
  defaultLabel?: string;
}

const PREDEFINED_COLORS = [
  "#08A88A", // Theme Teal
  "#0E7490", // Theme Cyan
  "#10233F", // Dark Navy
  "#132238", // Ink Body
  "#E11D48", // Rose Accent
  "#D97706", // Amber / Warning
  "#526477", // Slate Gray
  "#DCE5E8", // Light Border
  "#F4F9FD", // Light Blue BG
  "#F0FBF7", // Pale Teal BG
  "#FFF2F4", // Pale Red BG
  "#FFF7E6", // Pale Amber BG
];

const LOCAL_STORAGE_KEY = "kvj-material-recent-colors";

export function ColorPicker({ color, onChange, label, defaultLabel = "Default/Theme" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Load recent colors from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentColors(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent colors", e);
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const addRecentColor = (c: string) => {
    if (!c || PREDEFINED_COLORS.includes(c)) return;
    setRecentColors((prev) => {
      const filtered = prev.filter((x) => x !== c);
      const updated = [c, ...filtered].slice(0, 8); // Keep last 8 recent colors
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleColorSelect = (c: string | undefined) => {
    onChange(c);
    if (c) {
      addRecentColor(c);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {label && <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">{label}</label>}
      
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 border border-line bg-white dark:bg-slate-900 rounded-lg shadow-sm text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer font-medium text-slate-700 dark:text-slate-200"
        >
          <span
            className="w-4 h-4 rounded-md border border-line shrink-0 shadow-sm"
            style={{
              backgroundColor: color || "transparent",
              backgroundImage: !color ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)" : "none",
              backgroundSize: "6px 6px",
              backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0"
            }}
          />
          <span className="truncate max-w-[80px] font-mono">{color || "Default"}</span>
        </button>

        {color && (
          <button
            type="button"
            onClick={() => handleColorSelect(undefined)}
            title="Reset to default theme"
            className="p-1.5 border border-line rounded-lg text-slate hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-slate-950 border border-line rounded-xl shadow-xl z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Default / Reset Option */}
          <button
            type="button"
            onClick={() => {
              handleColorSelect(undefined);
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-md border border-dashed border-slate-350 flex items-center justify-center text-[10px] text-slate-400">×</span>
              <span>{defaultLabel}</span>
            </div>
            {!color && <Check className="w-3.5 h-3.5 text-brand" />}
          </button>

          {/* Predefined Colors Grid */}
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-slate uppercase tracking-wider pl-1">Theme Palette</span>
            <div className="grid grid-cols-6 gap-1.5">
              {PREDEFINED_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    handleColorSelect(c);
                    setIsOpen(false);
                  }}
                  title={c}
                  className="w-7 h-7 rounded-md border border-line hover:scale-110 active:scale-95 transition-all cursor-pointer relative flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: c }}
                >
                  {color?.toLowerCase() === c.toLowerCase() && (
                    <Check className={`w-3.5 h-3.5 ${c.toLowerCase() === "#fff7e6" || c.toLowerCase() === "#f4f9fd" || c.toLowerCase() === "#f0fbf7" || c.toLowerCase() === "#fff2f4" || c.toLowerCase() === "#dce5e8" ? "text-slate-800" : "text-white"}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Colors Grid */}
          {recentColors.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-line/60">
              <span className="block text-[9px] font-bold text-slate uppercase tracking-wider pl-1">Recent Colors</span>
              <div className="flex flex-wrap gap-1.5">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      handleColorSelect(c);
                      setIsOpen(false);
                    }}
                    title={c}
                    className="w-6 h-6 rounded-md border border-line hover:scale-110 active:scale-95 transition-all cursor-pointer relative flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: c }}
                  >
                    {color?.toLowerCase() === c.toLowerCase() && (
                      <Check className="w-3 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Selection */}
          <div className="pt-2 border-t border-line/60 flex items-center gap-2">
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-brand hover:underline font-bold cursor-pointer"
            >
              <Pipette className="w-3.5 h-3.5" />
              <span>Color Picker</span>
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={color || "#08A88A"}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="hidden"
            />
            <input
              type="text"
              placeholder="#HEX"
              value={color || ""}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-24 px-1.5 py-1 border border-line rounded bg-white dark:bg-slate-900 text-xxs font-mono uppercase"
            />
          </div>
        </div>
      )}
    </div>
  );
}
