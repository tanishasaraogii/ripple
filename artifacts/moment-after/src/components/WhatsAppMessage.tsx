import { Guest, Recommendation } from '../lib/data';
import { motion } from 'framer-motion';

export default function WhatsAppMessage({ guest, recommendation }: { guest: Guest, recommendation: Recommendation }) {
  const priceLine = recommendation.price === 0 
    ? "Free · Books in 30 seconds 👇" 
    : `€${recommendation.price} · Books in 30 seconds 👇`;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, x: 20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="self-end max-w-[85%] bg-[#005c4b] rounded-lg p-2.5 relative shadow-sm text-[#e9edef] text-[15px] leading-relaxed mb-4"
    >
      <div className="wa-bubble-tail"></div>
      
      <div className="whitespace-pre-wrap font-sans">
        {guest.guest_name}! Your {guest.experience_name} just wrapped 🎉{'\n\n'}
        {recommendation.name} is {recommendation.distance_minutes} min away and has {recommendation.available_slots} slots left today.{'\n\n'}
        {recommendation.highlight_line}{'\n\n'}
        {priceLine}{'\n'}
        <span className="text-[#53bdeb] hover:underline cursor-pointer">headout.com/book/{recommendation.id}</span>
      </div>

      <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
        <span className="text-[11px] text-[#8696a0]">{time}</span>
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.91 3.51L5.59 8.84L3.09 6.34L2 7.41L5.59 11L12 4.58L10.91 3.51Z" fill="#53bdeb"/>
          <path d="M15 4.58L13.91 3.51L8.59 8.84L8.03 8.28L6.96 9.35L8.59 11L15 4.58Z" fill="#53bdeb"/>
        </svg>
      </div>
    </motion.div>
  );
}
