import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  AppMode,
  CartItem,
  DropZone,
  FlightStage,
  FlightSimulationState,
  FeeBreakdown,
  UnitEconomicsParams,
  UnitEconomicsResults,
  ProductCategory,
} from '../types';
import { DEFAULT_DROP_ZONES } from '../data/dropZonesData';
import { UNIT_ECONOMICS_PRESETS } from '../data/unitEconomicsData';
import { calculateFees } from '../utils/feeCalculator';
import { calculateUnitEconomics } from '../utils/unitEconomics';
import { soundSynth } from '../components/simulation/SoundSynthesizer';

export interface AppContextType {
  // Navigation & Mode State
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  activePitchTab: string;
  setActivePitchTab: (tab: string) => void;

  // Cart & Payload Constraints
  cart: CartItem[];
  cartItems: CartItem[]; // alias
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalWeightGrams: number;
  totalWeightKg: number;
  cartTotalWeightKg: number; // alias
  isOverweight: boolean; // totalWeightKg > 2.50
  isCautionWeight: boolean; // 2.00 < totalWeightKg <= 2.50
  splitOrderModalOpen: boolean;
  setSplitOrderModalOpen: (open: boolean) => void;
  splitResolution: 'standard_drone' | 'split_drone' | 'ground_ev';
  setSplitResolution: (res: 'standard_drone' | 'split_drone' | 'ground_ev') => void;

  // Safe Drop-Zone Selection
  selectedDropZone: DropZone;
  setSelectedDropZone: (zone: DropZone) => void;

  // Fee Engine Options
  priorityDelivery: boolean;
  setPriorityDelivery: (enabled: boolean) => void;
  seedTagOption: boolean;
  setSeedTagOption: (enabled: boolean) => void;
  greenLoopMembership: boolean;
  setGreenLoopMembership: (enabled: boolean) => void;
  feeBreakdown: FeeBreakdown;

  // Flight Simulation Engine
  flightSimulation: FlightSimulationState;
  flightSimulationState: FlightSimulationState; // alias
  isFlightModalOpen: boolean;
  setIsFlightModalOpen: (open: boolean) => void;
  startFlightSimulation: (orderId?: string) => void;
  resetFlightSimulation: () => void;
  setSpeedMultiplier: (multiplier: 1 | 5 | 15) => void;
  setFlightStage: (stage: FlightStage) => void;
  updateFlightTelemetry: (update: Partial<FlightSimulationState>) => void;

  // Investor Pitch Calculator
  calculatorParams: UnitEconomicsParams;
  setCalculatorParams: (params: Partial<UnitEconomicsParams>) => void;
  loadPreset: (presetKey: string) => void;
  calculatorResults: UnitEconomicsResults;

  // Audio Feedback
  isAudioMuted: boolean;
  toggleAudioMute: () => void;

  // Catalogue Filtering State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: 'All' | ProductCategory;
  setSelectedCategory: (cat: 'All' | ProductCategory) => void;

  // Pilot Demo Booking Modal State
  isDemoBookingModalOpen: boolean;
  setIsDemoBookingModalOpen: (open: boolean) => void;

  // QR Code Modal State
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mode state - initialized from URL hash or localStorage if available
  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('pitch') || hash.includes('judges')) return 'pitch';
      const saved = localStorage.getItem('droneit_mode');
      if (saved === 'pitch' || saved === 'consumer') return saved;
    }
    return 'consumer';
  });

  const [activePitchTab, setActivePitchTabState] = useState<string>('summary');

  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('droneit_mode', newMode);
      if (newMode === 'pitch') {
        window.history.replaceState(null, '', '#pitch');
      } else {
        window.history.replaceState(null, '', '#store');
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'consumer' ? 'pitch' : 'consumer';
      try {
        localStorage.setItem('droneit_mode', next);
        window.history.replaceState(null, '', next === 'pitch' ? '#pitch' : '#store');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setActivePitchTab = useCallback((tab: string) => {
    setActivePitchTabState(tab);
    try {
      window.history.replaceState(null, '', `#pitch-${tab}`);
    } catch {
      // ignore
    }
  }, []);

  // Sync mode with hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#pitch')) {
        setModeState('pitch');
        const tab = hash.replace('#pitch-', '');
        if (['summary', 'economics', 'regulatory', 'greenloop', 'competitor'].includes(tab)) {
          setActivePitchTabState(tab);
        }
      } else if (hash === '#store' || hash === '#consumer') {
        setModeState('consumer');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [splitOrderModalOpen, setSplitOrderModalOpen] = useState(false);
  const [splitResolution, setSplitResolution] = useState<'standard_drone' | 'split_drone' | 'ground_ev'>('standard_drone');

  // Drop-Zone state
  const [selectedDropZone, setSelectedDropZone] = useState<DropZone>(DEFAULT_DROP_ZONES[0]);

  // Fee engine options
  const [priorityDelivery, setPriorityDelivery] = useState(false);
  const [seedTagOption, setSeedTagOption] = useState(true);
  const [greenLoopMembership, setGreenLoopMembership] = useState(false);

  // Cart Weight & Safeguards
  const totalWeightGrams = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.weightGrams * item.quantity, 0);
  }, [cart]);

  const totalWeightKg = useMemo(() => {
    return Number((totalWeightGrams / 1000).toFixed(3));
  }, [totalWeightGrams]);

  const isOverweight = totalWeightGrams > 2500;
  const isCautionWeight = totalWeightGrams > 2000 && totalWeightGrams <= 2500;

  // Dynamic Fee Breakdown
  const feeBreakdown = useMemo(() => {
    return calculateFees({
      cart,
      totalWeightKg,
      priorityDelivery,
      seedTagOption,
      greenLoopMembership,
      resolutionType: isOverweight ? splitResolution : 'standard_drone',
    });
  }, [cart, totalWeightKg, priorityDelivery, seedTagOption, greenLoopMembership, isOverweight, splitResolution]);

  // Cart Mutators
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i));
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Flight Simulation state
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [flightSimulation, setFlightSimulation] = useState<FlightSimulationState>({
    orderId: 'DI-8821',
    stage: 'DISPATCHED',
    progressPercent: 0,
    elapsedSeconds: 0,
    timeRemainingSeconds: 180,
    altitudeMeters: 0,
    speedKmh: 0,
    batteryPercent: 98,
    winchProgressPercent: 0,
    speedMultiplier: 1,
    isActive: false,
    isMuted: false,
    dropZone: DEFAULT_DROP_ZONES[0],
    items: [],
    totalWeightKg: 0,
  });

  // Auto-revert split resolution if basket weight recovers back to safe limit (<= 2500g)
  useEffect(() => {
    if (totalWeightGrams <= 2500 && splitResolution !== 'standard_drone') {
      setSplitResolution('standard_drone');
    }
  }, [totalWeightGrams, splitResolution]);

  // Delta-timestamp simulation loop based on performance.now()
  const lastTickRef = useRef<number>(0);
  const prevStageRef = useRef<FlightStage>('DISPATCHED');
  const pingCounterRef = useRef<number>(0);

  const startFlightSimulation = useCallback(
    (orderId = `DI-${Math.floor(1000 + Math.random() * 9000)}`) => {
      if (cart.length === 0) {
        throw new Error('Cannot launch flight with empty cart');
      }
      setFlightSimulation({
        orderId,
        stage: 'DISPATCHED',
        progressPercent: 0,
        elapsedSeconds: 0,
        timeRemainingSeconds: 180,
        altitudeMeters: 0,
        speedKmh: 0,
        batteryPercent: 98,
        winchProgressPercent: 0,
        speedMultiplier: 1,
        isActive: true,
        isMuted: false,
        dropZone: selectedDropZone,
        items: [...cart],
        totalWeightKg,
      });
      setIsFlightModalOpen(true);
      lastTickRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
      prevStageRef.current = 'DISPATCHED';
      pingCounterRef.current = 0;
      soundSynth.playRotorSpool();
    },
    [selectedDropZone, cart, totalWeightKg]
  );

  const resetFlightSimulation = useCallback(() => {
    soundSynth.stopRotorHum();
    lastTickRef.current = 0;
    setFlightSimulation((prev) => ({
      ...prev,
      stage: 'DISPATCHED',
      progressPercent: 0,
      elapsedSeconds: 0,
      timeRemainingSeconds: 180,
      altitudeMeters: 0,
      speedKmh: 0,
      batteryPercent: 98,
      winchProgressPercent: 0,
      isActive: false,
    }));
    setIsFlightModalOpen(false);
  }, []);

  const setSpeedMultiplier = useCallback((multiplier: 1 | 5 | 15) => {
    setFlightSimulation((prev) => ({ ...prev, speedMultiplier: multiplier }));
  }, []);

  const setFlightStage = useCallback((stage: FlightStage) => {
    setFlightSimulation((prev) => ({ ...prev, stage }));
  }, []);

  const updateFlightTelemetry = useCallback((update: Partial<FlightSimulationState>) => {
    setFlightSimulation((prev) => ({ ...prev, ...update }));
  }, []);

  // Delta-timestamp ticker advancing simulation state smoothly even across tab backgrounding
  useEffect(() => {
    if (!flightSimulation.isActive || flightSimulation.stage === 'DELIVERED') {
      soundSynth.stopRotorHum();
      return;
    }

    lastTickRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
    soundSynth.startRotorHum();

    const intervalId = setInterval(() => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (!lastTickRef.current) lastTickRef.current = now;
      const deltaSec = Math.max(0, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      // Effective seconds advanced based on speed multiplier (1x, 5x, 15x)
      const effectiveDeltaSec = deltaSec * flightSimulation.speedMultiplier;

      setFlightSimulation((prev) => {
        if (!prev.isActive || prev.stage === 'DELIVERED') {
          return prev;
        }

        const newElapsed = Math.min(180, prev.elapsedSeconds + effectiveDeltaSec);
        const newRemaining = Math.max(0, 180 - newElapsed);
        const newProgress = Math.min(100, Math.max(0, (newElapsed / 180) * 100));

        let stage: FlightStage = 'DISPATCHED';
        let altitude = 0;
        let speed = 0;
        let winchP = 0;

        if (newProgress < 10) {
          stage = 'DISPATCHED';
          altitude = (newProgress / 10) * 45;
          speed = (newProgress / 10) * 40;
        } else if (newProgress < 75) {
          stage = 'EN_ROUTE';
          altitude = 45;
          speed = 40;
        } else if (newProgress < 85) {
          stage = 'APPROACHING';
          const factor = (newProgress - 75) / 10;
          altitude = 45 - factor * 30;
          speed = 40 - factor * 35;
        } else if (newProgress < 100 && newElapsed < 180) {
          stage = 'WINCH_LOWERING';
          altitude = 15;
          speed = 0;
          winchP = Math.min(100, Math.max(0, ((newProgress - 85) / 15) * 100));
        } else {
          stage = 'DELIVERED';
          altitude = 15;
          speed = 0;
          winchP = 100;
        }

        const battery = 98 - newProgress * 0.06;

        // Stage transition audio feedback
        if (stage !== prevStageRef.current) {
          if (stage === 'APPROACHING') {
            soundSynth.playProximityAlert();
          } else if (stage === 'WINCH_LOWERING') {
            soundSynth.playWinchWhine();
          } else if (stage === 'DELIVERED') {
            soundSynth.stopRotorHum();
            soundSynth.playDeliveryChime();
          }
          prevStageRef.current = stage;
        } else if (stage === 'EN_ROUTE') {
          pingCounterRef.current += effectiveDeltaSec;
          if (pingCounterRef.current >= 4.0) {
            pingCounterRef.current = 0;
            soundSynth.playRadarPing();
          }
        }

        const isDelivered = stage === 'DELIVERED' || newElapsed >= 180 || newProgress >= 100;

        return {
          ...prev,
          stage,
          progressPercent: isDelivered ? 100.0 : Number(newProgress.toFixed(1)),
          elapsedSeconds: isDelivered ? 180.0 : Number(newElapsed.toFixed(1)),
          timeRemainingSeconds: isDelivered ? 0 : Math.round(newRemaining),
          altitudeMeters: Number(altitude.toFixed(1)),
          speedKmh: Number(speed.toFixed(1)),
          batteryPercent: Number(battery.toFixed(1)),
          winchProgressPercent: isDelivered ? 100 : Math.round(winchP),
        };
      });
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [flightSimulation.isActive, flightSimulation.speedMultiplier, flightSimulation.stage]);

  // Investor Pitch Calculator state
  const [calculatorParams, setCalculatorParamsState] = useState<UnitEconomicsParams>(
    UNIT_ECONOMICS_PRESETS.base
  );

  const setCalculatorParams = useCallback((params: Partial<UnitEconomicsParams>) => {
    setCalculatorParamsState((prev) => ({ ...prev, ...params }));
  }, []);

  const loadPreset = useCallback((presetKey: string) => {
    const preset = UNIT_ECONOMICS_PRESETS[presetKey];
    if (preset) {
      setCalculatorParamsState(preset);
    }
  }, []);

  const calculatorResults = useMemo(() => {
    return calculateUnitEconomics(calculatorParams);
  }, [calculatorParams]);

  // Audio State
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const toggleAudioMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      soundSynth.setMuted(next);
      setFlightSimulation((f) => ({ ...f, isMuted: next }));
      return next;
    });
  }, []);

  // Catalogue Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');

  // Pilot Demo Booking Modal State
  const [isDemoBookingModalOpen, setIsDemoBookingModalOpen] = useState(false);

  // QR Code Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const contextValue = useMemo<AppContextType>(
    () => ({
      mode,
      setMode,
      toggleMode,
      activePitchTab,
      setActivePitchTab,
      cart,
      cartItems: cart, // alias
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalWeightGrams,
      totalWeightKg,
      cartTotalWeightKg: totalWeightKg, // alias
      isOverweight,
      isCautionWeight,
      splitOrderModalOpen,
      setSplitOrderModalOpen,
      splitResolution,
      setSplitResolution,
      selectedDropZone,
      setSelectedDropZone,
      priorityDelivery,
      setPriorityDelivery,
      seedTagOption,
      setSeedTagOption,
      greenLoopMembership,
      setGreenLoopMembership,
      feeBreakdown,
      flightSimulation,
      flightSimulationState: flightSimulation, // alias
      isFlightModalOpen,
      setIsFlightModalOpen,
      startFlightSimulation,
      resetFlightSimulation,
      setSpeedMultiplier,
      setFlightStage,
      updateFlightTelemetry,
      calculatorParams,
      setCalculatorParams,
      loadPreset,
      calculatorResults,
      isAudioMuted,
      toggleAudioMute,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      isDemoBookingModalOpen,
      setIsDemoBookingModalOpen,
      isQrModalOpen,
      setIsQrModalOpen,
    }),
    [
      mode,
      setMode,
      toggleMode,
      activePitchTab,
      setActivePitchTab,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      totalWeightGrams,
      totalWeightKg,
      isOverweight,
      isCautionWeight,
      splitOrderModalOpen,
      splitResolution,
      selectedDropZone,
      priorityDelivery,
      seedTagOption,
      greenLoopMembership,
      feeBreakdown,
      flightSimulation,
      isFlightModalOpen,
      startFlightSimulation,
      resetFlightSimulation,
      setSpeedMultiplier,
      setFlightStage,
      updateFlightTelemetry,
      calculatorParams,
      setCalculatorParams,
      loadPreset,
      calculatorResults,
      isAudioMuted,
      toggleAudioMute,
      searchQuery,
      selectedCategory,
      isDemoBookingModalOpen,
      isQrModalOpen,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useAppContext = useApp;
