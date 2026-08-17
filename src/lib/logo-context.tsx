"use client";

import { createContext, useContext, type ReactNode } from "react";

const LogoContext = createContext<string | null>(null);

export function LogoProvider({ url, children }: { url: string | null; children: ReactNode }) {
  return <LogoContext.Provider value={url}>{children}</LogoContext.Provider>;
}

export function useLogo() {
  return useContext(LogoContext);
}
