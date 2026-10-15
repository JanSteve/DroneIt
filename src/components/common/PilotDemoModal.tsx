import React, { useState } from 'react';
import { X, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_DROP_ZONES } from '../../data/dropZonesData';

export const PilotDemoModal: React.FC = () => {
  const { isDemoBookingModalOpen, setIsDemoBookingModalOpen } = useApp();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDropZone, setPreferredDropZone] = useState(DEFAULT_DROP_ZONES[0].name);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    message: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isDemoBookingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || name.trim() === '') {
      setErrorMsg('Name is required');
      return;
    }
    if (!institution || institution.trim() === '') {
      setErrorMsg('Institution or Venture Fund is required');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Valid email is required');
      return;
    }

    const bookingId = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    const result = {
      bookingId,
      message: `Campus pilot demo scheduled for ${name} (${institution})`,
    };

    setConfirmedBooking(result);
    showToast(`Pilot demo confirmed! Booking ID: ${bookingId}`, 'success', 5000);
  };

  const handleClose = () => {
    setIsDemoBookingModalOpen(false);
    setConfirmedBooking(null);
    setErrorMsg('');
    setName('');
    setInstitution('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Campus Pilot Demo Flight</h3>
              <p className="text-xs text-slate-500">DGCA Green Zone verified 3–5 min autonomous delivery</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 font-mono">
                Booking Confirmed
              </span>
              <h4 className="text-xl font-black text-slate-900 font-mono">
                {confirmedBooking.bookingId}
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto pt-1">
                {confirmedBooking.message}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <div className="flex justify-between">
                <span>Designated Safe Drop-Zone:</span>
                <span className="font-semibold text-slate-900">{preferredDropZone}</span>
              </div>
              <div className="flex justify-between">
                <span>Flight Corridors:</span>
                <span className="text-emerald-700 font-medium">Digital Sky Green Zone &lt;400ft AGL</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Email Sent:</span>
                <span className="text-slate-900 font-mono">{email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label htmlFor="demo-name" className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name & Title *
              </label>
              <input
                id="demo-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Judge Priya Sharma (Competition Jury)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="demo-institution" className="block text-xs font-bold text-slate-700 mb-1">
                Institution, University or Venture Fund *
              </label>
              <input
                id="demo-institution"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Premier Business Competition Jury / Sequoia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="demo-email" className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya.sharma@jury.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="demo-dropzone" className="block text-xs font-bold text-slate-700 mb-1">
                Preferred DGCA Verified Drop-Zone
              </label>
              <select
                id="demo-dropzone"
                value={preferredDropZone}
                onChange={(e) => setPreferredDropZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {DEFAULT_DROP_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.name} className="bg-white text-slate-900">
                    {zone.name} ({zone.deliveryType === 'touchdown' ? 'Touchdown' : 'Winch Lowering'})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Reserve Flight Slot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
