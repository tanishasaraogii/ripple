import { Guest, Recommendation } from '../lib/data';
import { motion } from 'framer-motion';

export default function WhatsAppTicket({ guest, recommendation, onOpenVoucher }: { guest: Guest, recommendation: Recommendation, onOpenVoucher: () => void }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, x: 20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="self-end max-w-[85%] bg-[#d9fdd3] rounded-lg p-2.5 relative shadow-sm text-[#111b21] text-[15px] leading-[20px] mt-2 mb-2"
      style={{ borderTopRightRadius: 0 }}
    >
      <div className="wa-bubble-tail"></div>

      {/* Ticket link card preview */}
      <button
        onClick={onOpenVoucher}
        className="block w-full text-left bg-white/70 rounded-md overflow-hidden mb-2 hover:bg-white transition-colors"
      >
        <div className="h-24 w-full overflow-hidden bg-[#ECECEF]">
          <img
            src={recommendation.image_url}
            alt={recommendation.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="px-2.5 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8000FF] mb-0.5">Headout · e-Ticket</div>
          <div className="text-[13px] font-bold text-[#111b21] leading-snug truncate">{recommendation.name}</div>
          <div className="text-[11px] text-[#667781] mt-0.5">Tap to view your voucher</div>
        </div>
      </button>

      <div className="whitespace-pre-wrap font-sans">
        🎫 You're all set, {guest.guest_name}! Your tickets are confirmed and saved to your Headout account.{'\n\n'}
        Show the QR at the entrance — see you there!
      </div>

      <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
        <span className="text-[11px] text-[#667781] leading-none">{time}</span>
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.91 3.51L5.59 8.84L3.09 6.34L2 7.41L5.59 11L12 4.58L10.91 3.51Z" fill="#53bdeb"/>
          <path d="M15 4.58L13.91 3.51L8.59 8.84L8.03 8.28L6.96 9.35L8.59 11L15 4.58Z" fill="#53bdeb"/>
        </svg>
      </div>
    </motion.div>
  );
}
