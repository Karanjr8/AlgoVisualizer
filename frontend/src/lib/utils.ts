import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { DatasetType } from '../store/useVisualizerStore';

export const generateElements = (count: number, type: DatasetType = 'random', customData?: number[]) => {
  let values: number[] = [];
  
  if (type === 'custom' && customData) {
    values = [...customData];
  } else if (type === 'best-case') {
    values = Array.from({ length: count }, (_, i) => (i + 1) * 10);
  } else if (type === 'worst-case' || type === 'reverse-sorted') {
    values = Array.from({ length: count }, (_, i) => (count - i) * 10);
  } else if (type === 'nearly-sorted') {
    values = Array.from({ length: count }, (_, i) => (i + 1) * 10);
    // Swap a few elements to make it nearly sorted
    const swaps = Math.max(1, Math.floor(count * 0.15));
    for (let i = 0; i < swaps; i++) {
      const idx1 = Math.floor(Math.random() * count);
      const idx2 = Math.floor(Math.random() * count);
      [values[idx1], values[idx2]] = [values[idx2], values[idx1]];
    }
  } else if (type === 'duplicates-heavy') {
    const choices = [10, 20, 30, 40, 50];
    values = Array.from({ length: count }, () => choices[Math.floor(Math.random() * choices.length)]);
  } else {
    // Random
    values = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
  }

  return values.map((val, i) => ({
    id: `el-${i}-${Math.random().toString(36).substr(2, 9)}`,
    value: val,
    state: 'normal' as const,
  }));
};

export const parseCustomInput = (input: string): number[] | null => {
  if (!input.trim()) return null;
  const parts = input.split(/[\s,]+/);
  const parsed = parts.map(p => parseInt(p, 10)).filter(n => !isNaN(n));
  if (parsed.length === 0) return null;
  // Limit to reasonable size, e.g., max 30 elements
  return parsed.slice(0, 30);
};
