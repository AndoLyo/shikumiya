"use client";

import { createContext, useContext } from "react";

export type Plan = "lite" | "middle" | "premium";

export interface MemberContextType {
  plan: Plan;
  companyName: string;
  orderId: string;
  siteUrl: string;
}

export const MemberCtx = createContext<MemberContextType>({
  plan: "lite",
  companyName: "",
  orderId: "",
  siteUrl: "",
});

export function useMember() {
  return useContext(MemberCtx);
}
