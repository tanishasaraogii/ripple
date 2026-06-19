import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Guest, Recommendation, discountedPrice } from '../lib/data';

function HeadoutIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-[22%] flex items-center justify-center shrink-0 shadow-sm"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #8000FF 0%, #E5006E 100%)' }}
    >
      <span className="text-white font-extrabold lowercase leading-none" style={{ fontSize: size * 0.5 }}>
        h
      </span>
    </div>
  );
}

type Status = 'idle' | 'processing' | 'success';

export default function PaymentGateway({
  guest,
  recommendation,
  credits,
  onPaid,
  onClose,
}: {
  guest: Guest;
  recommendation: Recommendation;
  credits: number;
  onPaid: () => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completed = useRef(false);
  const finalPrice = discountedPrice(recommendation);
  const hasDiscount = recommendation.discount_pct > 0 && finalPrice < recommendation.price;
  const savings = recommendation.price - finalPrice;
  const sufficient = credits >= finalPrice;

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const pay = () => {
    if (!sufficient || status !== 'idle') return;
    setStatus('processing');
    timers.current.push(
      setTimeout(() => {
        setStatus('success');
        timers.current.push(
          setTimeout(() => {
            if (completed.current) return;
            completed.current = true;
            onPaid();
          }, 850)
        );
      }, 1300)
    );
  };

  return (
    <motion.div
      key="payment"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
      className="absolute bottom-0 left-0 w-full h-full bg-white z-40 flex flex-col rounded-t-2xl overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.18)]"
    >
      {/* Header */}
      <div className="bg-primary px-5 py-3 flex items-center gap-3 shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div className="flex-1">
          <div className="text-white font-bold text-[15px] leading-tight">Secure checkout</div>
          <div className="text-white/70 text-[12px] leading-tight">256-bit encrypted · Headout Pay</div>
        </div>
        {status === 'idle' && (
          <button onClick={onClose} className="text-white/80 hover:text-white shrink-0" aria-label="Cancel payment">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {status === 'success' ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8000FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <div className="text-[18px] font-extrabold text-[#1A1A22] mb-1">Payment successful</div>
          <div className="text-[14px] text-[#6B6B76]">Issuing your tickets…</div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Order summary */}
          <div className="text-[11px] font-semibold tracking-[0.12em] text-[#9A9AA3] uppercase mb-2">Order summary</div>
          <div className="bg-[#F7F7F8] rounded-xl p-4 border border-[#ECECEF]">
            <div className="font-bold text-[15px] text-[#1A1A22] leading-snug">{recommendation.name}</div>
            <div className="text-[12px] text-[#6B6B76] mt-0.5">{guest.city} · Skip-the-Line Entry · {guest.solo_or_group === 'group' ? '2 Adults' : '1 Adult'}</div>

            <div className="h-px bg-[#ECECEF] my-3" />

            <div className="flex justify-between text-[13px] text-[#4A4A55] mb-1.5">
              <span>Experience price</span>
              <span>€{recommendation.price}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-[13px] text-[#E5006E] font-semibold mb-1.5">
                <span>Post-experience perk ({recommendation.discount_pct}%)</span>
                <span>−€{savings}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#ECECEF]">
              <span className="text-[14px] font-bold text-[#1A1A22]">Total due</span>
              <span className="text-[20px] font-extrabold text-[#1A1A22]">€{finalPrice}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="text-[11px] font-semibold tracking-[0.12em] text-[#9A9AA3] uppercase mt-5 mb-2">Pay with</div>
          <div className="rounded-xl p-4 border-2 border-primary bg-primary/[0.04] flex items-center gap-3">
            <HeadoutIcon size={36} />
            <div className="flex-1">
              <div className="text-[14px] font-bold text-[#1A1A22]">Headout Credits</div>
              <div className={`text-[12px] font-medium ${sufficient ? 'text-[#6B6B76]' : 'text-[#E5006E]'}`}>
                Balance €{credits}{sufficient ? '' : ' · insufficient'}
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          {sufficient && (
            <div className="text-[12px] text-[#6B6B76] mt-2 px-1">
              €{credits} → <span className="font-semibold text-[#3A3A44]">€{credits - finalPrice}</span> after this booking
            </div>
          )}
        </div>
      )}

      {/* Pay button */}
      {status !== 'success' && (
        <div className="p-5 border-t border-[#ECECEF] shrink-0">
          <button
            onClick={pay}
            disabled={!sufficient || status === 'processing'}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-transform shadow-md shadow-primary/20 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {status === 'processing' ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Processing…
              </>
            ) : sufficient ? (
              `Pay €${finalPrice} with credits`
            ) : (
              'Insufficient credits'
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
