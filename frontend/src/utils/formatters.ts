/**
 * TRANSITX — Public Data Presentation Formatters
 * Consistent, human-friendly number and string formatters for a polished product experience.
 */

export function formatCompactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toLocaleString();
}

export function formatExactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString();
}

export function formatMinutes(min: number | null | undefined): string {
  if (min === null || min === undefined || isNaN(min)) return '0.0 min';
  return `${min.toFixed(1)} min`;
}

export function formatPercentage(pct: number | null | undefined, includeSign = true): string {
  if (pct === null || pct === undefined || isNaN(pct)) return '0%';
  const rounded = Math.round(pct);
  if (includeSign && rounded > 0) return `+${rounded}%`;
  return `${rounded}%`;
}
