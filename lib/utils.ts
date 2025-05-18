import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSD(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return '$--';
  }

  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000) {
    return `${sign}$${(absValue / 1_000_000).toFixed(2)}M`;
  } else if (absValue >= 1_000) {
    return `${sign}$${(absValue / 1_000).toFixed(2)}K`;
  } else if (absValue < 0.01 && absValue > 0) {
    return `${sign}$${absValue.toFixed(6)}`;
  } else {
    return `${sign}$${absValue.toFixed(2)}`;
  }
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
}

export function formatPercentage(value: number): string {
  const absValue = Math.abs(value);
  const formatted = absValue < 0.01 ? absValue.toFixed(4) : absValue.toFixed(2);
  return `${value >= 0 ? '+' : '-'}${formatted}%`;
}

export function getRiskColor(riskScore: number): string {
  switch (riskScore) {
    case 1:
      return 'bg-emerald-500';
    case 2:
      return 'bg-emerald-400';
    case 3:
      return 'bg-amber-400';
    case 4:
      return 'bg-amber-500';
    case 5:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getRiskLabel(riskScore: number): string {
  switch (riskScore) {
    case 1:
      return 'Very Low Risk';
    case 2:
      return 'Low Risk';
    case 3:
      return 'Medium Risk';
    case 4:
      return 'High Risk';
    case 5:
      return 'Very High Risk';
    default:
      return 'Unknown Risk';
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}
