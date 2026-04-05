"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/site-data";

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({
  data,
  children,
}: {
  data: SiteData;
  children: React.ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData(): SiteData | null {
  return useContext(SiteDataContext);
}
