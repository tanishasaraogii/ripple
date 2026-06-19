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

  // Auto-trigger logic
  useEffect(() => {
    // Find the latest guest whose fire_offset_seconds has passed
    const triggeredGuest = [...GUESTS].reverse().find(g => elapsedSeconds >= g.fire_offset_seconds);
    if (triggeredGuest && activeMessageId !== triggeredGuest.id) {
      setActiveMessageId(triggeredGuest.id);
    }
  }, [elapsedSeconds, activeMessageId]);

  const activeGuest = GUESTS.find(g => g.id === activeMessageId);
  const activeRec = activeGuest ? getRecommendation(activeGuest) : null;

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a] z-20">
        <h2 className="font-semibold text-lg">Live Console</h2>
        <button onClick={onNext} className="text-xs text-primary font-medium tracking-wider uppercase bg-[#1a1a1a] px-3 py-1.5 rounded-full">
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
            let statusColor = "text-yellow-500 bg-yellow-500/10";
            if (isFiringNow) {
              status = "FIRING NOW";
              statusColor = "text-primary bg-primary/10 border border-primary/30";
            } else if (isFired) {
              status = "SENT";
              statusColor = "text-green-500 bg-green-500/10";
            }

            const mm = Math.max(0, Math.floor(timeUntilFire / 60)).toString().padStart(2, '0');
            const ss = Math.max(0, timeUntilFire % 60).toString().padStart(2, '0');

            return (
              <div key={guest.id} className={`p-4 rounded-xl border ${isFiringNow ? 'border-primary/50 shadow-[0_0_15px_rgba(37,211,102,0.15)] bg-[#111]' : 'border-[#222] bg-[#0f0f0f]'} transition-all duration-500`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-[15px]">{guest.guest_name}</div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColor} ${isFiringNow ? 'animate-pulse' : ''}`}>
                    {status}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-3 truncate">{guest.experience_name}</div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-gray-500">{guest.city} · Ends {guest.end_time}</div>
                  {!isFired ? (
                    <div className="text-sm font-mono text-gray-300">T-{mm}:{ss}</div>
                  ) : (
                    <div className="text-sm font-mono text-primary">Delivered</div>
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
            className="absolute bottom-0 left-0 w-full h-[460px] bg-[#0b141a] border-t border-[#222] flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-2xl overflow-hidden"
          >
            <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-semibold text-lg text-white">
                {activeGuest.guest_name[0]}
              </div>
              <div>
                <div className="font-semibold text-[16px] text-[#e9edef]">{activeGuest.guest_name}</div>
                <div className="text-xs text-[#8696a0]">online</div>
              </div>
            </div>
            
            <div className="flex-1 whatsapp-bg p-4 overflow-y-auto flex flex-col justify-end">
              <WhatsAppMessage guest={activeGuest} recommendation={activeRec} />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 bg-[#111] p-4 rounded-xl border border-[#222] mx-2 shadow-lg"
              >
                <div className="text-sm font-semibold mb-1">{activeRec.name}</div>
                <div className="text-xs text-gray-400 mb-3">{activeRec.distance_minutes} min away · {activeRec.available_slots} slots left</div>
                <button 
                  onClick={() => {
                    setBookings(b => b + 1);
                    setRevenue(r => r + activeRec.price);
                  }}
                  className="w-full bg-primary text-black font-semibold py-2.5 rounded-lg text-sm active:scale-[0.98] transition-transform"
                >
                  Book Now
                </button>
              </motion.div>
            </div>

            {bookings > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-[#111] border-t border-primary/30 p-4 shrink-0"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Same-day second bookings:</span>
                  <span className="text-sm font-bold text-white">{bookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Revenue recovered:</span>
                  <span className="text-sm font-bold text-white">€{revenue}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#222] flex justify-between items-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">CAC</span>
                  <span className="text-2xl font-black text-primary">€0</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
