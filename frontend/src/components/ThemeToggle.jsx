import React, { useEffect, useState, useRef } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        className="text-primary hover:text-accent transition focus:outline-none flex items-center justify-center"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü öffnen"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 bg-secondary text-primary rounded-lg z-50 p-3 min-w-[180px] shadow-lg "
        >
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={() => setIsDark(!isDark)}
              />
              {/* Custom toggle track with border */}
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${isDark ? "bg-accent" : ""}`}
                style={!isDark ? { backgroundColor: "var(--text-secondary)" } : undefined}
              ></div>
              {/* Custom toggle thumb */}
              <div
                className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                style={{
                  transform: isDark ? "translateX(1.25rem)" : "translateX(0)",
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.10)",
                }}
              ></div>
              <span className="ml-3 text-sm font-medium">Dunkelmodus</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
