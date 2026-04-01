"use client";

import { siteConfig } from "@/site.config";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080810]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-[10px] font-mono tracking-wider">
            {siteConfig.footer.copyright}
          </p>
          <p className="text-text-muted text-[10px] font-mono tracking-wider">
            {siteConfig.footer.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}
