"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface CommandCenterCtx {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
}

const Ctx = createContext<CommandCenterCtx>({
  enabled: false,
  toggle: () => {},
  setEnabled: () => {},
});

const STORAGE_KEY = "celestra-command-center";

export function CommandCenterProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setEnabledState(true);
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    window.localStorage.setItem(STORAGE_KEY, String(v));
    document.documentElement.classList.toggle("command-center", v);
  }, []);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  useEffect(() => {
    document.documentElement.classList.toggle("command-center", enabled);
  }, [enabled]);

  const value = useMemo(
    () => ({ enabled, toggle, setEnabled }),
    [enabled, toggle, setEnabled],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCommandCenter() {
  return useContext(Ctx);
}
