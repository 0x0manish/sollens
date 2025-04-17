"use client";

import { Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DexPaidBadgeProps {
  isPaid: boolean;
  message: string;
}

export function DexPaidBadge({ isPaid, message }: DexPaidBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 py-1 px-2 rounded-full ${
            isPaid 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-600/20 text-slate-400'
          } text-xs font-medium`}>
            {isPaid ? (
              <>
                <Check className="h-3 w-3" />
                <span>DEX Paid</span>
              </>
            ) : (
              <>
                <HelpCircle className="h-3 w-3" />
                <span>DEX Status Unknown</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
