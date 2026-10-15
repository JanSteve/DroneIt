// src/components/consumer/CartDrawer.tsx
// Responsive Slide-Over Cart Drawer (Clean White Format)

import React from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Snowflake,
  AlertTriangle,
  MapPin,
  Sparkles,
  Zap,
  Truck,
  Leaf,
  Repeat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatWeight } from '../../utils/formatters';
import { WeightGauge } from './WeightGauge';
import { DropZoneSelector } from './DropZoneSelector';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalWeightKg,
    isOverweight,
    splitResolution,
    setSplitOrderModalOpen,
    selectedDropZone,
    priorityDelivery,
    setPriorityDelivery,
    seedTagOption,
    setSeedTagOption,
    greenLoopMembership,
    setGreenLoopMembership,
    feeBreakdown,
    startFlightSimulation,
  } = useApp();

  const { showToast } = useToast();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = () => {
    if (cart.length === 0) return;
    clearCart();
    showToast('Cart cleared (0 items)', 'info');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add items to order!', 'warning');
      return;
    }

    if (isOverweight && splitResolution === 'standard_drone') {
      setSplitOrderModalOpen(true);
      showToast('Payload exceeds 2.50 kg safe limit. Choose Dual Drone Split or Ground EV fallback.', 'warning');
      return;
    }

    setIsCartOpen(false);
    startFlightSimulation();
    showToast('Drone Dispatched! Tracking live 3-min flight.', 'success', 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop Scrim */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full text-slate-900">
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="text-base font-black text-slate-900 leading-tight">
                  My Drone Cart
                </h2>
                <p className="text-xs text-slate-500">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} • {totalWeightKg.toFixed(2)} kg payload
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Clear Cart"
                  aria-label="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close Cart Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Weight HUD Gauge */}
            <WeightGauge variant="full" />

            {/* Empty Cart State */}
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add groceries, meals, medicine, or prints to experience 3-minute drone delivery!
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    Items in Delivery Pod
                  </span>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0">
                            DRONE
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{formatINR(item.priceINR)}</span>
                            <span>•</span>
                            <span>{formatWeight(item.weightGrams * item.quantity)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-[18px] text-center text-xs font-bold text-slate-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Drop-Zone Selector */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">
                    Drop-Zone Destination
                  </span>
                  <DropZoneSelector variant="dropdown" />
                </div>

                {/* Add-on Options */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                    Delivery Preferences
                  </span>

                  {/* Priority Delivery */}
                  <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <div>
                        <span className="font-bold text-slate-800">Priority Direct Air Corridor</span>
                        <p className="text-[10px] text-slate-500">Guaranteed immediate drone takeoff (+₹79)</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={priorityDelivery}
                      onChange={(e) => setPriorityDelivery(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                  </label>

                  {/* Plantable Seed Tag */}
                  <label className="flex items-center justify-between text-xs cursor-pointer select-none pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800">GreenLoop Plantable Seed Tag</span>
                        <p className="text-[10px] text-slate-500">Grow wild basil/marigold plants after use (+₹5)</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={seedTagOption}
                      onChange={(e) => setSeedTagOption(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                  </label>

                  {/* GreenLoop Membership */}
                  <label className="flex items-center justify-between text-xs cursor-pointer select-none pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800">GreenLoop Monthly Club</span>
                        <p className="text-[10px] text-slate-500">Free packaging return credits & zero delivery fees (+₹99/mo)</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={greenLoopMembership}
                      onChange={(e) => setGreenLoopMembership(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                  </label>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total</span>
                    <span>{formatINR(feeBreakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Standard Drone Delivery</span>
                    <span>{formatINR(feeBreakdown.deliveryFee)}</span>
                  </div>
                  {feeBreakdown.prioritySlotFee > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>Priority Flight Slot</span>
                      <span>+{formatINR(feeBreakdown.prioritySlotFee)}</span>
                    </div>
                  )}
                  {feeBreakdown.seedTagFee > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Plantable Seed Tag</span>
                      <span>+{formatINR(feeBreakdown.seedTagFee)}</span>
                    </div>
                  )}
                  {feeBreakdown.membershipFee > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>GreenLoop Membership</span>
                      <span>+{formatINR(feeBreakdown.membershipFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST Taxes</span>
                    <span>{formatINR(feeBreakdown.taxGST)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-emerald-700">{formatINR(feeBreakdown.grandTotal)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart Footer / Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-2.5">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-98"
              >
                <span>Proceed to 3-Min Air Delivery</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="text-[11px] text-center text-slate-500 font-sans">
                🔒 Safe Tether Winch Drop at verified pad • 100% DGCA Green Zone
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
