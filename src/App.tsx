import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { PilotDemoModal } from './components/common/PilotDemoModal';
import { ConsumerShell } from './components/consumer/ConsumerShell';
import { PitchDeckShell } from './components/pitch/PitchDeckShell';
import { FlightTrackerModal } from './components/simulation/FlightTrackerModal';

const AppContent: React.FC = () => {
  const { mode } = useApp();

  return (
    <div className="min-h-screen bg-drone-navy text-slate-100 flex flex-col antialiased selection:bg-drone-green selection:text-drone-navy">
      {/* 1. Rigid Zero-CLS Fixed-Height Header */}
      <Header />

      {/* 2. Dual Main Views (Simultaneously Mounted in DOM to guarantee CLS = 0 and 100% State Persistence) */}
      <main className="flex-1 relative w-full overflow-hidden">
        {/* View A: Consumer Quick-Commerce App */}
        <div
          id="view-consumer"
          className={`w-full transition-opacity duration-150 ${
            mode === 'consumer' ? 'block opacity-100' : 'hidden opacity-0'
          }`}
          aria-hidden={mode !== 'consumer'}
        >
          <ConsumerShell />
        </div>

        {/* View B: Judges & Investor Pitch Room */}
        <div
          id="view-pitch"
          className={`w-full transition-opacity duration-150 ${
            mode === 'pitch' ? 'block opacity-100' : 'hidden opacity-0'
          }`}
          aria-hidden={mode !== 'pitch'}
        >
          <PitchDeckShell />
        </div>
      </main>

      {/* 3. Global Modals & Dialogs */}
      <PilotDemoModal />

      {/* Active Flight Radar Simulation & Telemetry HUD Modal */}
      <FlightTrackerModal />

      {/* 4. Mobile Bottom Navigation Sheet (Visible on viewports < 768px) */}
      <MobileNav />

      {/* 5. 4-Zone Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
