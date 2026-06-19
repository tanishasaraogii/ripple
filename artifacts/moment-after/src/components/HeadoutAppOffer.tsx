import { Guest, Recommendation, discountedPrice } from '../lib/data';
import { motion } from 'framer-motion';

function HeadoutIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-[22%] flex items-center justify-center shrink-0 shadow-sm"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #8000FF 0%, #E5006E 100%)',
      }}
    >
      <span className="text-white font-extrabold lowercase leading-none" style={{ fontSize: size * 0.5 }}>
        h
      </span>
    </div>
  );
}

export default function HeadoutAppOffer({
  guest,
  recommendation,
  countdownLabel,
  expired,
  onBook,
}: {
  guest: Guest;
  recommendation: Recommendation;
  countdownLabel: string;
  expired: boolean;
  onBook: () => void;
}) {
  const finalPrice = discountedPrice(recommendation);
  const hasDiscount = recommendation.discount_pct > 0 && finalPrice < recommendation.price;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F2F7] flex flex-col">
      {/* Push notification */}
      <div className="px-3 pt-3">
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.6 }}
          className="bg-white/85 backdrop-blur rounded-2xl p-3 shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-black/[0.04]"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <HeadoutIcon size={22} />
            <span className="text-[12px] font-semibold text-[#3A3A44] uppercase tracking-wide">Headout</span>
            <span className="text-[12px] text-[#9A9AA3] ml-auto">now</span>
          </div>
          <div className="text-[14px] font-bold text-[#1A1A22] leading-snug">
            {guest.guest_name}, your {guest.experience_name} just wrapped 🎉
          </div>
          <div className="text-[13px] text-[#4A4A55] leading-snug mt-0.5">
            {recommendation.name} is {recommendation.distance_minutes} min away
            {hasDiscount ? ` — ${recommendation.discount_pct}% off if you book now.` : '.'}
          </div>
        </motion.div>
      </div>

      {/* In-app offer screen */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="m-3 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#ECECEF]"
      >
        {/* Hero */}
        <div
          className="relative h-28 flex items-end p-4"
          style={{ background: 'linear-gradient(135deg, #8000FF 0%, #E5006E 100%)' }}
        >
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-white text-[#E5006E] text-[11px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
              {recommendation.discount_pct}% off
            </div>
          )}
          <div>
            <div className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-1">
              {recommendation.category} · {guest.city}
            </div>
            <div className="text-white font-extrabold text-[18px] leading-tight">{recommendation.name}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="text-[13px] text-[#6B6B76] font-medium mb-3">
            {recommendation.distance_minutes} min away · {recommendation.available_slots} slots left today
          </div>
          <p className="text-[13px] text-[#4A4A55] leading-relaxed mb-4">{recommendation.highlight_line}</p>

          {/* Countdown */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4 text-[13px] font-semibold ${
              expired
                ? 'bg-[#F7F7F8] text-[#9A9AA3] border border-[#ECECEF]'
                : 'bg-[#E5006E]/10 text-[#E5006E] border border-[#E5006E]/25'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            {expired ? 'This offer has expired' : `Offer expires in ${countdownLabel}`}
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-extrabold text-[#1A1A22]">€{finalPrice}</span>
            {hasDiscount && <span className="text-base text-[#9A9AA3] line-through">€{recommendation.price}</span>}
            {hasDiscount && <span className="text-xs text-[#E5006E] font-semibold">post-experience perk</span>}
          </div>

          <button
            onClick={onBook}
            disabled={expired}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-transform shadow-md shadow-primary/20 disabled:opacity-40 disabled:active:scale-100"
          >
            {expired ? 'Offer expired' : `Book Now · €${finalPrice}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
