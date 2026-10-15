export type AppMode = 'consumer' | 'pitch';

export type ProductCategory =
  | 'Groceries'
  | 'Food & Drinks'
  | 'Beauty'
  | 'Medicine'
  | 'Print & Documents'
  | 'Electronics';

export interface CartItem {
  id: string;
  name: string;
  category: ProductCategory;
  priceINR: number;
  weightGrams: number;
  quantity: number;
  image?: string;
  isColdChain?: boolean;
  coldChain?: boolean;
  isFragile?: boolean;
  fragile?: boolean;
  badge?: string;
  description?: string;
}

export type SplitResolutionType = 'standard_drone' | 'split_drone' | 'ground_ev';

export type DropZoneId = 'rooftop' | 'community' | 'lawn' | 'tethered';

export interface DropZone {
  id: DropZoneId;
  name: string;
  description: string;
  deliveryType: 'touchdown' | 'winch_tether';
  hoverAltitudeMeters: number;
  coordinates: { x: number; y: number };
}

export type FlightStage =
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'APPROACHING'
  | 'WINCH_LOWERING'
  | 'DELIVERED';

export interface FlightSimulationState {
  orderId: string;
  stage: FlightStage;
  progressPercent: number; // 0 to 100
  elapsedSeconds: number; // 0 to 180
  timeRemainingSeconds: number; // 180 down to 0
  altitudeMeters: number; // e.g. 0 -> 45 -> 15 -> 0
  speedKmh: number; // e.g. 0 -> 40 -> 0
  batteryPercent: number; // 98% down to 88%
  winchProgressPercent: number; // 0 to 100 during WINCH_LOWERING
  speedMultiplier: 1 | 5 | 15;
  isActive: boolean;
  isMuted: boolean;
  dropZone: DropZone;
  items: CartItem[];
  totalWeightKg: number;
}

export interface FeeBreakdown {
  subtotal: number;
  discount: number;
  deliveryFee: number; // Base ₹49 or EV ₹29 or Split ₹79
  prioritySlotFee: number; // ₹79 if selected
  seedTagFee: number; // ₹5 to ₹10 (default ₹5)
  membershipFee: number; // ₹99 if opted
  taxGST: number; // 5% on food/groceries/medicine essentials, 18% on fees/print/electronics
  grandTotal: number;
  totalWeightGrams: number;
  totalWeightKg: number;
  isOverweight: boolean;
  resolutionType: 'standard_drone' | 'split_drone' | 'ground_ev';
}

export interface UnitEconomicsParams {
  dailyOrderVolume: number; // 50 to 1000
  averageOrderValue: number; // ₹200 to ₹1200
  deliveryFeeCharged: number; // ₹29 to ₹99
  batteryCycleLife: number; // 300 to 1200 cycles
}

export interface UnitEconomicsResults {
  revenuePerOrder: number;
  variableCostPerOrder: number;
  contributionMarginPerOrder: number;
  contributionMarginPercent: number;
  monthlyRevenue: number;
  monthlyVariableCosts: number;
  monthlyOpEx: number; // ₹2,45,000 baseline
  monthlyNetContribution: number;
  pilotBreakEvenDailyOrders: number;
  isProfitable: boolean;
}
