// src/utils/binPacking.ts
// Algorithmic order splitting for physical drone payload safeguards (2.50 kg limit)

import { CartItem } from '../types';

export const MAX_DRONE_PAYLOAD_GRAMS = 2500; // 2.50 kg certified limit
export const CAUTION_PAYLOAD_GRAMS = 2000;   // 2.00 kg caution threshold
export const MAX_DUAL_DRONE_CAPACITY_GRAMS = 5000; // 5.00 kg dual sortie ceiling
export const MAX_GROUND_EV_CAPACITY_GRAMS = 15000; // 15.00 kg partner courier ceiling

export interface PackedFlight {
  flightIndex: 1 | 2;
  callsign: string;
  items: CartItem[];
  totalWeightGrams: number;
  totalWeightKg: number;
  capacityUtilizationPercent: number;
  eta: string;
}

export interface DualSortiePartitionResult {
  isSplittable: boolean;
  totalBinsNeeded: number;
  totalWeightGrams: number;
  totalWeightKg: number;
  flights: PackedFlight[];
  overflowItems: CartItem[];
  reason?: string;
}

/**
 * Standard First-Fit Decreasing (FFD) Greedy Bin Packing.
 * Partitions unit items into the minimum number of bins <= maxCapacityGrams.
 */
export function greedyBinPacking(
  items: CartItem[],
  maxCapacityGrams: number = MAX_DRONE_PAYLOAD_GRAMS
): CartItem[][] {
  const expanded: CartItem[] = [];
  items.forEach((it) => {
    for (let i = 0; i < it.quantity; i++) {
      expanded.push({ ...it, quantity: 1 });
    }
  });

  // Sort descending by unit weight
  expanded.sort((a, b) => b.weightGrams - a.weightGrams);

  const bins: CartItem[][] = [];
  for (const item of expanded) {
    let placed = false;
    for (const bin of bins) {
      const currentBinWeight = bin.reduce((sum, i) => sum + i.weightGrams, 0);
      if (currentBinWeight + item.weightGrams <= maxCapacityGrams) {
        bin.push(item);
        placed = true;
        break;
      }
    }
    if (!placed) {
      bins.push([item]);
    }
  }

  return bins;
}

/**
 * Consolidates individual unit items back into items with quantity >= 1 for UI display.
 */
export function consolidateItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of items) {
    const existing = map.get(item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      map.set(item.id, { ...item, quantity: 1 });
    }
  }
  return Array.from(map.values());
}

/**
 * Evaluates cart for Dual Drone Sortie partitioning and produces flight manifests.
 * Handles edge cases:
 * - individual item > 2.50 kg
 * - total weight > 5.00 kg
 * - unpartitionable geometric distributions (requires >= 3 bins)
 */
export function partitionCartIntoDualFlights(
  cart: CartItem[],
  maxCapacityGrams: number = MAX_DRONE_PAYLOAD_GRAMS
): DualSortiePartitionResult {
  const totalWeightGrams = cart.reduce((sum, i) => sum + i.weightGrams * i.quantity, 0);
  const totalWeightKg = Number((totalWeightGrams / 1000).toFixed(3));

  if (!cart || cart.length === 0) {
    return {
      isSplittable: false,
      totalBinsNeeded: 0,
      totalWeightGrams: 0,
      totalWeightKg: 0,
      flights: [],
      overflowItems: [],
      reason: 'Cart is empty.',
    };
  }

  // Edge case 1: Check if any single unit item exceeds 2500g
  const oversizedItem = cart.find((i) => i.weightGrams > maxCapacityGrams);
  if (oversizedItem) {
    return {
      isSplittable: false,
      totalBinsNeeded: Infinity,
      totalWeightGrams,
      totalWeightKg,
      flights: [],
      overflowItems: [...cart],
      reason: `Single item "${oversizedItem.name}" (${(oversizedItem.weightGrams / 1000).toFixed(2)} kg) exceeds maximum drone capacity (2.50 kg). Ground EV Courier required.`,
    };
  }

  // Edge case 2: Total weight > 5000g (dual fleet capacity ceiling)
  if (totalWeightGrams > MAX_DUAL_DRONE_CAPACITY_GRAMS) {
    const rawBins = greedyBinPacking(cart, maxCapacityGrams);
    return {
      isSplittable: false,
      totalBinsNeeded: rawBins.length,
      totalWeightGrams,
      totalWeightKg,
      flights: [],
      overflowItems: [...cart],
      reason: `Total basket weight (${totalWeightKg.toFixed(2)} kg) exceeds dual-drone fleet capacity (5.00 kg). Partner Ground EV Courier required.`,
    };
  }

  const rawBins = greedyBinPacking(cart, maxCapacityGrams);
  const totalBinsNeeded = rawBins.length;

  if (totalBinsNeeded <= 2) {
    const flight1Items = rawBins[0] ? consolidateItems(rawBins[0]) : [];
    const flight2Items = rawBins[1] ? consolidateItems(rawBins[1]) : [];

    const f1Weight = rawBins[0] ? rawBins[0].reduce((s, i) => s + i.weightGrams, 0) : 0;
    const f2Weight = rawBins[1] ? rawBins[1].reduce((s, i) => s + i.weightGrams, 0) : 0;

    const flights: PackedFlight[] = [
      {
        flightIndex: 1,
        callsign: 'Sortie Alpha (Drone #1)',
        items: flight1Items,
        totalWeightGrams: f1Weight,
        totalWeightKg: Number((f1Weight / 1000).toFixed(3)),
        capacityUtilizationPercent: Number(((f1Weight / maxCapacityGrams) * 100).toFixed(1)),
        eta: '3:00 mins (Simultaneous Launch)',
      },
      {
        flightIndex: 2,
        callsign: 'Sortie Bravo (Drone #2)',
        items: flight2Items,
        totalWeightGrams: f2Weight,
        totalWeightKg: Number((f2Weight / 1000).toFixed(3)),
        capacityUtilizationPercent: Number(((f2Weight / maxCapacityGrams) * 100).toFixed(1)),
        eta: '3:30 mins (Consecutive Corridor)',
      },
    ];

    return {
      isSplittable: true,
      totalBinsNeeded,
      totalWeightGrams,
      totalWeightKg,
      flights,
      overflowItems: [],
    };
  }

  // Edge case 3: Unpartitionable distribution requiring >= 3 bins
  return {
    isSplittable: false,
    totalBinsNeeded,
    totalWeightGrams,
    totalWeightKg,
    flights: [],
    overflowItems: [...cart],
    reason: `Basket weight (${totalWeightKg.toFixed(2)} kg) requires ${totalBinsNeeded} drones, exceeding dual-sortie fleet capacity. Partner Ground EV Courier required.`,
  };
}
