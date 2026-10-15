// tests/helpers/contracts.mjs
// Authoritative specification contracts, reference datasets, and domain calculators

export const BRAND_TOKENS = {
  navyDark: '#0A192F',
  navyCard: '#0F2744',
  navyAccent: '#1E3A8A',
  greenPrimary: '#10B981',
  greenGlow: '#34D399',
  white: '#FFFFFF',
  hudCyan: '#38BDF8',
  cautionAmber: '#F59E0B',
  lockoutRed: '#EF4444'
};

export const FOUNDER_CONTACT = {
  phone: '+91 8438110297',
  phoneHref: 'tel:+918438110297',
  email: 'Droneiteco@gmail.com',
  emailHref: 'mailto:Droneiteco@gmail.com',
  instagram: '@drone.it',
  instagramUrl: 'https://instagram.com/drone.it'
};

export const PHYSICAL_LIMITS = {
  maxSafePayloadGrams: 2500,
  maxSafePayloadKg: 2.50,
  cautionThresholdGrams: 2000,
  cruiseAltitudeMeters: 45,
  cruiseSpeedKmh: 40,
  hoverAltitudeMeters: 15,
  flightDurationSeconds: 180, // 3:00
  windSpeedLimitKmh: 42,
  rainIntensityLimitMmh: 2.0
};

export const PRODUCT_CATALOGUE = [
  // Category 1: Groceries
  { id: 'groc-1', name: 'Organic Farm Fresh Whole Milk (500 ml)', category: 'Groceries', priceINR: 38, weightGrams: 520, coldChain: true, fragile: false, badge: 'Express 3-Min' },
  { id: 'groc-2', name: 'Fresh Hass Avocado (Pack of 2)', category: 'Groceries', priceINR: 199, weightGrams: 340, coldChain: false, fragile: true, badge: 'Bestseller' },
  { id: 'groc-3', name: 'Whole Wheat Multigrain Bread (400 g)', category: 'Groceries', priceINR: 55, weightGrams: 420, coldChain: false, fragile: false, badge: 'GreenLoop' },
  { id: 'groc-4', name: 'Aashirvaad Select Sharbati Atta (1 kg)', category: 'Groceries', priceINR: 82, weightGrams: 1050, coldChain: false, fragile: false, badge: 'Heavy Item' },
  { id: 'groc-5', name: 'Extra Virgin Cold-Pressed Olive Oil (250 ml)', category: 'Groceries', priceINR: 349, weightGrams: 380, coldChain: false, fragile: true, badge: 'Fragile' },
  { id: 'groc-6', name: 'Farm Fresh Organic Brown Eggs (6 Pack)', category: 'Groceries', priceINR: 85, weightGrams: 360, coldChain: true, fragile: true, badge: 'Fragile' },

  // Category 2: Food & Drinks
  { id: 'food-1', name: 'Nitro Cold Brew Artisanal Coffee (250 ml can)', category: 'Food & Drinks', priceINR: 160, weightGrams: 290, coldChain: true, fragile: false, badge: 'Express 3-Min' },
  { id: 'food-2', name: 'Grilled Truffle Chicken & Cheese Sourdough', category: 'Food & Drinks', priceINR: 249, weightGrams: 280, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'food-3', name: 'Fresh Japanese Salmon Maki Roll (6 pcs)', category: 'Food & Drinks', priceINR: 380, weightGrams: 260, coldChain: true, fragile: true, badge: 'Cold-Chain' },
  { id: 'food-4', name: 'Belgian Dark Chocolate Croissant', category: 'Food & Drinks', priceINR: 145, weightGrams: 140, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'food-5', name: 'Hydrating Tender Coconut Water (200 ml Tetra)', category: 'Food & Drinks', priceINR: 65, weightGrams: 230, coldChain: true, fragile: false, badge: 'GreenLoop' },

  // Category 3: Beauty
  { id: 'beau-1', name: 'Minimalist Niacinamide 10% Serum (30 ml)', category: 'Beauty', priceINR: 599, weightGrams: 110, coldChain: false, fragile: true, badge: 'Bestseller' },
  { id: 'beau-2', name: 'Bioderma Sensibio H2O Micellar Water (100 ml)', category: 'Beauty', priceINR: 395, weightGrams: 140, coldChain: false, fragile: true, badge: 'Express 3-Min' },
  { id: 'beau-3', name: 'Maybelline SuperStay Matte Ink Lipstick', category: 'Beauty', priceINR: 549, weightGrams: 45, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'beau-4', name: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen (80 g)', category: 'Beauty', priceINR: 675, weightGrams: 115, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'beau-5', name: 'Forest Essentials Organic Rose Water Facial Mist', category: 'Beauty', priceINR: 475, weightGrams: 165, coldChain: false, fragile: true, badge: 'Fragile' },

  // Category 4: Medicine
  { id: 'med-1', name: 'Dolo 650mg Paracetamol (15 Tablets strip)', category: 'Medicine', priceINR: 34, weightGrams: 22, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'med-2', name: 'Hansaplast Waterproof Bandages (Pack of 20)', category: 'Medicine', priceINR: 75, weightGrams: 35, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'med-3', name: 'Digene Antacid Oral Suspension Gel (200 ml)', category: 'Medicine', priceINR: 152, weightGrams: 250, coldChain: false, fragile: true, badge: 'Fragile' },
  { id: 'med-4', name: 'Accu-Chek Instant Blood Glucose Test Strips (25s)', category: 'Medicine', priceINR: 849, weightGrams: 60, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'med-5', name: 'Volini Rapid Pain Relief Spray (100 g)', category: 'Medicine', priceINR: 230, weightGrams: 145, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'med-6', name: 'Vicks Inhaler & Vaporub Travel Kit', category: 'Medicine', priceINR: 110, weightGrams: 70, coldChain: false, fragile: false, badge: 'Express 3-Min' },

  // Category 5: Print & Documents
  { id: 'prnt-1', name: 'Urgent Black & White Document Dossier (Up to 30 Pages)', category: 'Print & Documents', priceINR: 49, weightGrams: 120, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'prnt-2', name: 'Premium Color Project Presentation Binding (Spiral 40 Pages)', category: 'Print & Documents', priceINR: 179, weightGrams: 240, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'prnt-3', name: 'Legal Stamp Paper Affidavits & Notary Pack (Single Set)', category: 'Print & Documents', priceINR: 120, weightGrams: 55, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'prnt-4', name: 'High-Resolution Passport Photo Sheet (Set of 8)', category: 'Print & Documents', priceINR: 99, weightGrams: 25, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'prnt-5', name: 'Hardcover Thesis / Pitch Deck Portfolio Binding', category: 'Print & Documents', priceINR: 349, weightGrams: 480, coldChain: false, fragile: false, badge: 'GreenLoop' },

  // Category 6: Electronics
  { id: 'elec-1', name: 'Anker PowerPort 20W USB-C Fast GaN Wall Charger', category: 'Electronics', priceINR: 899, weightGrams: 85, coldChain: false, fragile: true, badge: 'Express 3-Min' },
  { id: 'elec-2', name: 'Braided 100W USB-C to USB-C Fast Charging Cable (1.5 m)', category: 'Electronics', priceINR: 349, weightGrams: 65, coldChain: false, fragile: false, badge: 'Bestseller' },
  { id: 'elec-3', name: 'Ultra-Slim 10,000mAh Magnetic Wireless Power Bank', category: 'Electronics', priceINR: 1799, weightGrams: 230, coldChain: false, fragile: true, badge: 'Bestseller' },
  { id: 'elec-4', name: 'SanDisk Ultra Dual 64GB USB 3.1 Flash Drive', category: 'Electronics', priceINR: 549, weightGrams: 20, coldChain: false, fragile: false, badge: 'Express 3-Min' },
  { id: 'elec-5', name: 'Noise Buds TWS Low-Latency Earbuds with Pod', category: 'Electronics', priceINR: 1299, weightGrams: 115, coldChain: false, fragile: true, badge: 'Express 3-Min' }
];

export const CATEGORIES = [
  'Groceries',
  'Food & Drinks',
  'Beauty',
  'Medicine',
  'Print & Documents',
  'Electronics'
];

export const DROP_ZONES = [
  {
    id: 'rooftop',
    name: 'Campus Rooftop Pad',
    description: 'High-rise rooftop helipad, clearance elevation +35m',
    deliveryType: 'touchdown',
    hoverAltitudeMeters: 35,
    coordinates: { x: 77.6245, y: 12.9352 }
  },
  {
    id: 'community',
    name: 'Society Community Center',
    description: 'Central gated residential square, ground level open plaza',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6321, y: 12.9410 }
  },
  {
    id: 'lawn',
    name: 'Verified Open Lawn',
    description: 'Geo-fenced soft turf clearing, unobstructed sky corridor',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6180, y: 12.9290 }
  },
  {
    id: 'tethered',
    name: 'Tethered Drop Point',
    description: 'Dedicated kerbside autonomous pickup pillar',
    deliveryType: 'winch_tether',
    hoverAltitudeMeters: 15,
    coordinates: { x: 77.6290, y: 12.9375 }
  }
];

export const FLIGHT_STAGES = [
  'DISPATCHED',
  'EN_ROUTE',
  'APPROACHING',
  'WINCH_LOWERING',
  'DELIVERED'
];

export function calculateFeeBreakdown({
  items = [],
  deliveryResolution = 'standard_drone',
  hasPrioritySlot = false,
  hasSeedTag = true,
  seedTagPrice = 5,
  isGreenLoopMember = false
}) {
  if (!items || items.length === 0) {
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
      resolutionType: deliveryResolution
    };
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceINR * item.quantity, 0);
  const totalWeightGrams = items.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  const totalWeightKg = Number((totalWeightGrams / 1000).toFixed(3));
  const isOverweight = totalWeightGrams > PHYSICAL_LIMITS.maxSafePayloadGrams;

  let deliveryFee = 0;
  if (deliveryResolution === 'ground_ev') {
    deliveryFee = 29;
  } else if (deliveryResolution === 'split_drone') {
    deliveryFee = 79;
  } else {
    deliveryFee = 49;
  }

  const prioritySlotFee = hasPrioritySlot ? 79 : 0;
  const seedTagFee = hasSeedTag ? seedTagPrice : 0;
  const membershipFee = isGreenLoopMember ? 99 : 0;

  // GST Calculation: 5% on food/groceries/medicine essentials, 18% on fees/print/electronics
  let itemGst = 0;
  items.forEach(item => {
    const rate = (item.category === 'Groceries' || item.category === 'Food & Drinks' || item.category === 'Medicine') ? 0.05 : 0.18;
    itemGst += (item.priceINR * item.quantity) * rate;
  });

  const feeGst = (deliveryFee + prioritySlotFee + seedTagFee + membershipFee) * 0.18;
  const taxGST = Math.round((itemGst + feeGst) * 100) / 100;
  const grandTotal = Math.round((subtotal + deliveryFee + prioritySlotFee + seedTagFee + membershipFee + taxGST) * 100) / 100;

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
    resolutionType: deliveryResolution
  };
}

export function calculateUnitEconomics({
  dailyOrderVolume = 350,
  averageOrderValue = 380,
  deliveryFeeCharged = 49,
  batteryCycleLife = 600
}) {
  const monthlyOrders = dailyOrderVolume * 30;
  const merchantTakeRate = 0.18;
  const seedTagContribution = 4.50;
  const batteryPackCost = 36000;
  const tripsPerCycle = 1.5;

  const revenuePerOrder = deliveryFeeCharged + (averageOrderValue * merchantTakeRate) + seedTagContribution;
  const monthlyRevenue = monthlyOrders * revenuePerOrder;

  const batteryCostPerOrder = batteryPackCost / (batteryCycleLife * tripsPerCycle);
  const electricityCost = 2.80;
  const maintenanceCost = 6.50;
  const podAmortization = 5.20;
  const telemetryCost = 2.50;
  const insurancePaymentGateway = (averageOrderValue * 0.012) + 3.00;

  const variableCostPerOrder = electricityCost + batteryCostPerOrder + maintenanceCost + podAmortization + telemetryCost + insurancePaymentGateway;
  const contributionMarginPerOrder = revenuePerOrder - variableCostPerOrder;
  const contributionMarginPercent = (contributionMarginPerOrder / revenuePerOrder) * 100;

  const monthlyVariableCosts = monthlyOrders * variableCostPerOrder;
  const monthlyOpEx = 245000; // Baseline fixed monthly costs for 1 hub
  const monthlyNetContribution = (monthlyOrders * contributionMarginPerOrder) - monthlyOpEx;

  const pilotBreakEvenDailyOrders = contributionMarginPerOrder > 0
    ? Math.ceil(monthlyOpEx / (contributionMarginPerOrder * 30))
    : Infinity;

  const isProfitable = monthlyNetContribution > 0;

  return {
    revenuePerOrder: Number(revenuePerOrder.toFixed(2)),
    variableCostPerOrder: Number(variableCostPerOrder.toFixed(2)),
    contributionMarginPerOrder: Number(contributionMarginPerOrder.toFixed(2)),
    contributionMarginPercent: Number(contributionMarginPercent.toFixed(1)),
    monthlyRevenue: Math.round(monthlyRevenue),
    monthlyVariableCosts: Math.round(monthlyVariableCosts),
    monthlyOpEx,
    monthlyNetContribution: Math.round(monthlyNetContribution),
    pilotBreakEvenDailyOrders,
    isProfitable
  };
}

export const FINANCIAL_PRESETS = {
  conservative: {
    dailyOrderVolume: 150,
    averageOrderValue: 300,
    deliveryFeeCharged: 39,
    batteryCycleLife: 450
  },
  baseCase: {
    dailyOrderVolume: 350,
    averageOrderValue: 380,
    deliveryFeeCharged: 49,
    batteryCycleLife: 600
  },
  aggressive: {
    dailyOrderVolume: 800,
    averageOrderValue: 450,
    deliveryFeeCharged: 59,
    batteryCycleLife: 800
  }
};

export function greedyBinPacking(items, maxCapacityGrams = PHYSICAL_LIMITS.maxSafePayloadGrams) {
  const expanded = [];
  items.forEach(it => {
    for (let i = 0; i < it.quantity; i++) {
      expanded.push({ ...it, quantity: 1 });
    }
  });
  expanded.sort((a, b) => b.weightGrams - a.weightGrams);

  const bins = [];
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
