import { UnitEconomicsParams, UnitEconomicsResults } from '../types';

export function calculateUnitEconomics({
  dailyOrderVolume = 350,
  averageOrderValue = 380,
  deliveryFeeCharged = 49,
  batteryCycleLife = 600,
}: Partial<UnitEconomicsParams> = {}): UnitEconomicsResults {
  const monthlyOrders = dailyOrderVolume * 30;
  const merchantTakeRate = 0.18;
  const seedTagContribution = 4.5;
  const batteryPackCost = 36000;
  const tripsPerCycle = 1.5;

  const revenuePerOrder = deliveryFeeCharged + averageOrderValue * merchantTakeRate + seedTagContribution;
  const monthlyRevenue = monthlyOrders * revenuePerOrder;

  const batteryCostPerOrder = batteryPackCost / (batteryCycleLife * tripsPerCycle);
  const electricityCost = 2.8;
  const maintenanceCost = 6.5;
  const podAmortization = 5.2;
  const telemetryCost = 2.5;
  const insurancePaymentGateway = averageOrderValue * 0.012 + 3.0;

  const variableCostPerOrder =
    electricityCost +
    batteryCostPerOrder +
    maintenanceCost +
    podAmortization +
    telemetryCost +
    insurancePaymentGateway;
  const contributionMarginPerOrder = revenuePerOrder - variableCostPerOrder;
  const contributionMarginPercent = (contributionMarginPerOrder / revenuePerOrder) * 100;

  const monthlyVariableCosts = monthlyOrders * variableCostPerOrder;
  const monthlyOpEx = 245000; // Baseline fixed monthly costs for 1 hub
  const monthlyNetContribution = monthlyOrders * contributionMarginPerOrder - monthlyOpEx;

  const pilotBreakEvenDailyOrders =
    contributionMarginPerOrder > 0
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
    isProfitable,
  };
}
