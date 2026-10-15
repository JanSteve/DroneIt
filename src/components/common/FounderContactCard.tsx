import React, { useState } from 'react';
import { Phone, Mail, Instagram, Copy, Check, ExternalLink, Zap, Calendar } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const FounderContactCard: React.FC<{ variant?: 'card' | 'inline' | 'compact' }> = ({
  variant = 'card',
}) => {
  const { showToast } = useToast();
  const { setIsDemoBookingModalOpen } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (label: string, text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`Copied ${label} (${text}) to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast(`Could not copy automatically. Value: ${text}`, 'warning');
    }
  };

  const contacts = [
    {
      key: 'phone',
      label: 'Direct Line / WhatsApp',
      value: '+91 8438110297',
      display: '+91 84381 10297',
      href: 'tel:+918438110297',
      icon: Phone,
      type: 'tel',
    },
    {
      key: 'email',
      label: 'Founder Email',
      value: 'Droneiteco@gmail.com',
      display: 'Droneiteco@gmail.com',
      href: 'mailto:Droneiteco@gmail.com?subject=Droneit%20Investment%20Inquiry',
      icon: Mail,
      type: 'email',
    },
    {
      key: 'instagram',
      label: 'Official Updates',
      value: '@drone.it',
      display: '@drone.it',
      href: 'https://instagram.com/drone.it',
      icon: Instagram,
      type: 'link',
      isExternal: true,
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {contacts.map((c) => (
          <div
            key={c.key}
            className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 p-1 pl-2.5 text-xs text-slate-800"
          >
            <c.icon className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
            <a
              href={c.href}
              target={c.isExternal ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="hover:text-emerald-700 transition-colors font-mono font-medium"
            >
              {c.display}
            </a>
            <button
              onClick={() => handleCopy(c.label, c.value, c.key)}
              className="ml-2 p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-colors"
              title={`Copy ${c.value}`}
              aria-label={`Copy ${c.label}`}
            >
              {copiedKey === c.key ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-2.5">
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <c.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={c.href}
                  target={c.isExternal ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 font-mono font-semibold transition-colors truncate"
                >
                  {c.display}
                </a>
              </div>
              <button
                onClick={() => handleCopy(c.label, c.value, c.key)}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition-colors shrink-0"
                title={`Copy ${c.value}`}
                aria-label={`Copy ${c.label}`}
              >
                {copiedKey === c.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsDemoBookingModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Pilot Demo Flight</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-900">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Direct Founder Channel</h4>
            <p className="text-xs text-slate-500">Instant response for pitch judges & pilot partners</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-2.5 mb-5">
        {contacts.map((c) => (
          <div
            key={c.key}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0">
                <c.icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 font-medium">{c.label}</div>
                <a
                  href={c.href}
                  target={c.isExternal ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="font-mono text-slate-900 hover:text-emerald-700 font-bold transition-colors truncate block"
                >
                  {c.display}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={() => handleCopy(c.label, c.value, c.key)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                title={`Copy ${c.value}`}
                aria-label={`Copy ${c.label}`}
              >
                {copiedKey === c.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              {c.isExternal && (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                  title="Open link"
                  aria-label="Open link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsDemoBookingModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
      >
        <Calendar className="w-4 h-4" />
        <span>Book Jury Demo Flight</span>
      </button>
    </div>
  );
};
