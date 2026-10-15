import { CartItem, FeeBreakdown } from '../types';

export interface FeeCalculationParams {
  cart: CartItem[];
  totalWeightKg?: number;
  priorityDelivery?: boolean;
  seedTagOption?: boolean;
  seedTagPrice?: number;
  greenLoopMembership?: boolean;
  resolutionType?: 'standard_drone' | 'split_drone' | 'ground_ev';
}

export function calculateFees({
  cart = [],
  priorityDelivery = false,
  seedTagOption = true,
  seedTagPrice = 5,
  greenLoopMembership = false,
  resolutionType = 'standard_drone',
}: FeeCalculationParams): FeeBreakdown {
  if (!cart || cart.length === 0) {
    return {
      subtotal: 0,
      discount: 0,
      deliveryFee: 0,
      prioritySlotFee: 0,
      seedTagFee: 0,
      membershipFee: 0,
      taxGST: 0,
      grandTotal: 0,
      totalWeightGrams: 0,
      totalWeightKg: 0,
      isOverweight: false,
      resolutionType,
    };
  }

  const subtotal = cart.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
  const totalWeightGrams = cart.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  const totalWeightKg = Number((totalWeightGrams / 1000).toFixed(3));
  const isOverweight = totalWeightGrams > 2500;

  let deliveryFee = 49;
  if (resolutionType === 'ground_ev') {
    deliveryFee = 29;
  } else if (resolutionType === 'split_drone') {
    deliveryFee = 79;
  } else {
    deliveryFee = 49;
  }

  const prioritySlotFee = priorityDelivery ? 79 : 0;
  const seedTagFee = seedTagOption ? seedTagPrice : 0;
  const membershipFee = greenLoopMembership ? 99 : 0;

  // GST Calculation: 5% on food/groceries/medicine essentials, 18% on fees/print/electronics
  let itemGst = 0;
  cart.forEach((item) => {
    const rate =
      item.category === 'Groceries' ||
      item.category === 'Food & Drinks' ||
      item.category === 'Medicine'
        ? 0.05
        : 0.18;
    itemGst += item.priceINR * item.quantity * rate;
  });

  const feeGst = (deliveryFee + prioritySlotFee + seedTagFee + membershipFee) * 0.18;
  const taxGST = Math.round((itemGst + feeGst) * 100) / 100;
  const grandTotal =
    Math.round(
      (subtotal + deliveryFee + prioritySlotFee + seedTagFee + membershipFee + taxGST) * 100
    ) / 100;

  return {
    subtotal,
    discount: 0,
    deliveryFee,
    prioritySlotFee,
    seedTagFee,
    membershipFee,
    taxGST,
    grandTotal,
    totalWeightGrams,
    totalWeightKg,
    isOverweight,
    resolutionType,
  };
}
