"use client";

import { createContext, useContext } from "react";

export type Plan = "otameshi" | "omakase" | "omakase-pro";

export interface MemberContextType {
  plan: Plan;
  companyName: string;
  orderId: string;
  siteUrl: string;
}

export const MemberCtx = createContext<MemberContextType>({
  plan: "otameshi",
  companyName: "",
  orderId: "",
  siteUrl: "",
});

export function useMember() {
  return useContext(MemberCtx);
}
