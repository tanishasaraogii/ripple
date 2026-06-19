import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GUESTS, getRecommendation, Guest, Recommendation } from '../lib/data';
import WhatsAppMessage from './WhatsAppMessage';

export default function ScreenDashboard({ onNext }: { onNext: () => void }) {
  const [startTime] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = Math.floor((now - startTime) / 1000);

  useEffect(() => {
    const triggeredGuest = [...GUESTS].reverse().find(g => elapsedSeconds >= g.fire_offset_seconds);
    if (triggeredGuest && activeMessageId !== triggeredGuest.id) {
      setActiveMessageId(triggeredGuest.id);
    }
  }, [elapsedSeconds, activeMessageId]);

  const activeGuest = GUESTS.find(g => g.id === activeMessageId);
  const activeRec = activeGuest ? getRecommendation(activeGuest) : null;

  return (
    <div className="flex flex-col h-full relative bg-[#F7F7F8]">
      <div className="px-5 py-4 border-b border-[#ECECEF] flex justify-between items-center bg-white z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="https://cdn-imgix-open.headout.com/logo/svg/Headout_purps.svg" 
            alt="headout"
            className="h-5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<span class="text-primary font-bold text-lg leading-none">headout</span>');
            }}
          />
          <div className="w-px h-4 bg-[#ECECEF]"></div>
          <h2 className="font-semibold text-sm text-[#6B6B76]">Live Console</h2>
        </div>
        <button onClick={onNext} className="text-xs text-primary font-bold tracking-wide uppercase px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors">
          Summary →
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[400px]">
        <div className="p-4 flex flex-col gap-3">
          {GUESTS.map(guest => {
            const timeUntilFire = guest.fire_offset_seconds - elapsedSeconds;
            const isFired = timeUntilFire <= 0;
            const isFiringNow = isFired && activeMessageId === guest.id;
            
            let status = "UPCOMING";
            let statusColor = "text-[#6B6B76] bg-[#F7F7F8] border border-[#ECECEF]";
            
            if (isFiringNow) {
              status = "FIRING NOW";
              statusColor = "text-[#E5006E] bg-[#E5006E]/10 border border-[#E5006E]/30";
            } else if (isFired) {
              status = "SENT";
              statusColor = "text-primary bg-primary/10 border border-primary/20";
            }

            const mm = Math.max(0, Math.floor(timeUntilFire / 60)).toString().padStart(2, '0');
            const ss = Math.max(0, timeUntilFire % 60).toString().padStart(2, '0');

            return (
              <div key={guest.id} className={`p-4 rounded-xl border bg-white transition-all duration-500 ${isFiringNow ? 'shadow-md border-[#E5006E]/40 scale-[1.02]' : 'shadow-sm border-[#ECECEF]'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-[15px] text-[#2A2A33]">{guest.guest_name}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${statusColor} ${isFiringNow ? 'animate-pulse' : ''}`}>
                    {status}
                  </div>
                </div>
                <div className="text-sm text-[#6B6B76] mb-3 truncate font-medium">{guest.experience_name}</div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-[#8A8A93]">{guest.city} · Ends {guest.end_time}</div>
                  {!isFired ? (
                    <div className="text-sm font-bold font-mono text-[#444444]">T-{mm}:{ss}</div>
                  ) : (
                    <div className="text-sm font-bold font-mono text-primary">Delivered</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeGuest && activeRec && (
          <motion.div
            key={activeGuest.id}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="absolute bottom-0 left-0 w-full h-[460px] bg-white border-t border-[#ECECEF] flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-2xl overflow-hidden"
          >
            {/* Authentic WhatsApp Header */}
            <div className="bg-[#F0F2F5] px-4 py-3 flex items-center gap-3 shrink-0 border-b border-[#D1D7DB]">
              <div className="w-10 h-10 rounded-full bg-[#DFE5E7] flex items-center justify-center overflow-hidden shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#a6b0b5]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-[16px] text-[#111B21] leading-tight">{activeGuest.guest_name}</div>
                <div className="text-[13px] text-[#667781] leading-tight mt-0.5">online</div>
              </div>
            </div>
            
            <div className="flex-1 whatsapp-bg p-4 overflow-y-auto flex flex-col justify-end">
              <WhatsAppMessage guest={activeGuest} recommendation={activeRec} />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 bg-white p-4 rounded-xl border border-[#ECECEF] shadow-sm"
              >
                <div className="text-sm font-bold text-[#2A2A33] mb-1">{activeRec.name}</div>
                <div className="text-xs text-[#6B6B76] mb-4 font-medium">{activeRec.distance_minutes} min away · {activeRec.available_slots} slots left</div>
                <button 
                  onClick={() => {
                    setBookings(b => b + 1);
                    setRevenue(r => r + activeRec.price);
                  }}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg text-sm active:scale-[0.98] transition-transform shadow-md shadow-primary/20"
                >
                  Book Now
                </button>
              </motion.div>
            </div>

            {bookings > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-white border-t border-primary/20 p-5 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#6B6B76]">Same-day second bookings:</span>
                  <span className="text-sm font-bold text-[#2A2A33]">{bookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#6B6B76]">Revenue recovered:</span>
                  <span className="text-sm font-bold text-[#2A2A33]">€{revenue}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ECECEF] flex justify-between items-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">CAC</span>
                  <span className="text-3xl font-extrabold text-primary tracking-tight">€0</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}