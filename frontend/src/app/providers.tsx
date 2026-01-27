"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Waves,
  X
} from "lucide-react";

type Theme = "light" | "dark" | "blue" | "sunset" | "neon" | "forest" | "purple-haze";
type Background = "snow" | "midnight" | "ocean" | "graphite" | "sunset" | "neon" | "forest" | "purple-haze";

type AppearanceState = {
  theme: Theme;
  background: Background;
  setTheme: (t: Theme) => void;
  setBackground: (b: Background) => void;
};

const AppearanceContext = createContext<AppearanceState | null>(null);

const STORAGE_THEME = "ravix_theme";
const STORAGE_BG = "ravix_bg";

function clampTheme(v: string | null): Theme {
  const validThemes: Theme[] = ["light", "dark", "blue", "sunset", "neon", "forest", "purple-haze"];
  if (v && validThemes.includes(v as Theme)) return v as Theme;
  return "dark";
}

function clampBg(v: string | null): Background {
  const validBgs: Background[] = ["snow", "midnight", "ocean", "graphite", "sunset", "neon", "forest", "purple-haze"];
  if (v && validBgs.includes(v as Background)) return v as Background;
  return "midnight";
}

function applyAppearance(theme: Theme, background: Background) {
  const el = document.documentElement;
  el.dataset.theme = theme;
  el.dataset.bg = background;
  const scheme = theme === "light" ? "light" : "dark";
  el.style.colorScheme = scheme;
}

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [background, setBackgroundState] = useState<Background>("midnight");

  useEffect(() => {
    let initialTheme: Theme = "dark";
    try {
      const stored = clampTheme(localStorage.getItem(STORAGE_THEME));
      initialTheme = stored;
    } catch {
      initialTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    let initialBg: Background = "midnight";
    try {
      initialBg = clampBg(localStorage.getItem(STORAGE_BG));
    } catch { }

    setThemeState(initialTheme);
    setBackgroundState(initialBg);
    applyAppearance(initialTheme, initialBg);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_THEME, t);
    } catch { }
    applyAppearance(t, background);
  }

  function setBackground(b: Background) {
    setBackgroundState(b);
    try {
      localStorage.setItem(STORAGE_BG, b);
    } catch { }
    applyAppearance(theme, b);
  }

  const value = useMemo<AppearanceState>(() => ({ theme, background, setTheme, setBackground }), [theme, background]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("AppearanceContext missing");
  return ctx;
}

function IconForTheme({ theme }: { theme: Theme }) {
  if (theme === "light") return <Sun className="h-4 w-4" />;
  if (theme === "blue") return <Waves className="h-4 w-4" />;
  if (theme === "sunset") return <Sparkles className="h-4 w-4" />;
  if (theme === "neon") return <Sparkles className="h-4 w-4" />;
  if (theme === "forest") return <Sparkles className="h-4 w-4" />;
  if (theme === "purple-haze") return <Sparkles className="h-4 w-4" />;
  return <Moon className="h-4 w-4" />;
}

function bgLabel(bg: Background) {
  switch (bg) {
    case "snow":
      return "Snow";
    case "ocean":
      return "Ocean";
    case "graphite":
      return "Graphite";
    case "sunset":
      return "Sunset";
    case "neon":
      return "Neon";
    case "forest":
      return "Forest";
    case "purple-haze":
      return "Purple Haze";
    default:
      return "Midnight";
  }
}

export function AppearanceControl() {
  const { theme, background, setTheme, setBackground } = useAppearance();
  const [open, setOpen] = useState(false);

  const themes: { id: Theme; label: string }[] = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "blue", label: "Blue" },
    { id: "sunset", label: "Sunset" },
    { id: "neon", label: "Neon" },
    { id: "forest", label: "Forest" },
    { id: "purple-haze", label: "Purple" }
  ];

  const bgs: { id: Background; label: string }[] = [
    { id: "snow", label: "Snow" },
    { id: "midnight", label: "Midnight" },
    { id: "ocean", label: "Ocean" },
    { id: "graphite", label: "Graphite" },
    { id: "sunset", label: "Sunset" },
    { id: "neon", label: "Neon" },
    { id: "forest", label: "Forest" },
    { id: "purple-haze", label: "Purple" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="group flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl"
          type="button"
        >
          <Palette className="h-4 w-4 opacity-80" />
          <span className="text-sm font-medium">{bgLabel(background)}</span>
          <span className="text-xs opacity-70">·</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            <IconForTheme theme={theme} />
            {theme}
          </span>
          <ChevronDown className={`h-4 w-4 opacity-70 transition ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute bottom-14 right-0 w-[320px] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <div className="text-sm font-semibold">Apariencia</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 hover:bg-[color:var(--muted)] transition"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="text-xs font-semibold opacity-70">Tema</div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs transition hover:-translate-y-0.5 ${theme === t.id
                            ? "border-[color:var(--accent)] bg-[color:var(--muted)]"
                            : "border-[color:var(--border)] bg-transparent"
                          }`}
                      >
                        <IconForTheme theme={t.id} />
                        <span className="truncate w-full text-center">{t.label}</span>
                        {theme === t.id ? <Check className="h-3 w-3" /> : null}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold opacity-70">Fondo</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {bgs.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBackground(b.id)}
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition hover:-translate-y-0.5 ${background === b.id
                          ? "border-[color:var(--accent)] bg-[color:var(--muted)]"
                          : "border-[color:var(--border)] bg-transparent"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{b.label}</span>
                          {background === b.id ? <Check className="h-4 w-4" /> : null}
                        </div>
                        <div className={`mt-2 h-6 w-full rounded-md bg-preview-${b.id}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
