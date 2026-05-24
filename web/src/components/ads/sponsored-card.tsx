"use client";

import { motion } from "framer-motion";
import { Building2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SponsoredCardProps {
  sponsorName: string;
  sponsorLogo: string | null;
  title: string;
  description: string | null;
  onClick?: () => void;
}

export function SponsoredCard({ sponsorName, sponsorLogo, title, description, onClick }: SponsoredCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent p-5 transition-all hover:border-[rgba(255,255,255,0.12)]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)] text-lg">
          {sponsorLogo ?? <Building2 className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{title}</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Brought to you by</span>
            <span className="font-medium text-primary/80">{sponsorName}</span>
          </div>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/40" />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground/70 line-clamp-2">{description}</p>
      )}
    </motion.div>
  );
}
