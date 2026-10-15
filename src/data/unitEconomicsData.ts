import { UnitEconomicsParams } from '../types';

export const UNIT_ECONOMICS_PRESETS: Record<string, UnitEconomicsParams> = {
  conservative: {
    dailyOrderVolume: 150,
    averageOrderValue: 300,
    deliveryFeeCharged: 39,
    batteryCycleLife: 450,
  },
  base: {
    dailyOrderVolume: 350,
    averageOrderValue: 380,
    deliveryFeeCharged: 49,
    batteryCycleLife: 600,
  },
  baseCase: {
    dailyOrderVolume: 350,
    averageOrderValue: 380,
    deliveryFeeCharged: 49,
    batteryCycleLife: 600,
  },
  scale: {
    dailyOrderVolume: 800,
    averageOrderValue: 450,
    deliveryFeeCharged: 59,
    batteryCycleLife: 800,
  },
  aggressive: {
    dailyOrderVolume: 800,
    averageOrderValue: 450,
    deliveryFeeCharged: 59,
    batteryCycleLife: 800,
  },
};
