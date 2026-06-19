import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GUESTS, getRecommendation, discountedPrice } from '../lib/data';
import WhatsAppMessage from './WhatsAppMessage';
import WhatsAppTicket from './WhatsAppTicket';
import HeadoutAppOffer from './HeadoutAppOffer';
import PaymentGateway from './PaymentGateway';
import HeadoutVoucher from './HeadoutVoucher';

const OFFER_VALID_MS = 40 * 60 * 1000;
const STARTING_CREDITS = 1000;

type Channel = 'whatsapp' | 'app';

export default function ScreenDashboard({ onNext }: { onNext: () => void }) {
  const [startTime] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [voucherOpen, setVoucherOpen] = useState<boolean>(false);
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(STARTING_CREDITS);
  const [panelClosed, setPanelClosed] = useState<boolean>(false);
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [appOpenedAt, setAppOpenedAt] = useState<number | null>(null);
  const [paidGuestIds, setPaidGuestIds] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = Math.floor((now - startTime) / 1000);

  const selectGuest = (guestId: string, isFired: boolean) => {
    const isPaid = paidGuestIds.includes(guestId);
    console.log('[MomentAfter] guest card clicked', { guestId, isFired, isPaid, activeMessageId, panelClosed, voucherOpen, paymentOpen });
    if (!isFired) {
      console.log('[MomentAfter] ignored — guest has not fired yet');
      return;
    }
    setActiveMessageId(guestId);
    setPaymentOpen(false);
    setPanelClosed(false);
    setVoucherOpen(false);
    setChannel('whatsapp');
    if (isPaid) {
      console.log('[MomentAfter] opening WhatsApp thread (ticket sent) for paid guest', guestId);
    } else {
      console.log('[MomentAfter] opening WhatsApp profile', guestId);
      setAppOpenedAt(null);
    }
  };

  // The 40-min offer countdown only starts once the guest leaves WhatsApp
  // and opens the Headout app via the link / push notification.
  useEffect(() => {
    if (channel === 'app' && appOpenedAt === null) {
      setAppOpenedAt(Date.now());
    }
  }, [channel, appOpenedAt]);

  const activeGuest = GUESTS.find(g => g.id === activeMessageId);
  const activeRec = activeGuest ? getRecommendation(activeGuest) : null;

  const offerStarted = appOpenedAt !== null;
  const offerRemainingMs = offerStarted ? Math.max(0, appOpenedAt + OFFER_VALID_MS - now) : OFFER_VALID_MS;
  const offerExpired = offerRemainingMs <= 0;
  const countdownLabel = (() => {
    const total = Math.floor(offerRemainingMs / 1000);
    const mm = Math.floor(total / 60).toString().padStart(2, '0');
    const ss = (total % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  })();

  const openApp = () => {
    setAppOpenedAt(prev => prev ?? Date.now());
    setChannel('app');
  };

  const activeAlreadyPaid = activeMessageId !== null && paidGuestIds.includes(activeMessageId);

  const handleBook = (rec: typeof activeRec) => {
    if (!rec || offerExpired || activeAlreadyPaid) return;
    setPaymentOpen(true);
  };

  const handlePaid = (rec: typeof activeRec) => {
    if (!rec || activeAlreadyPaid) return;
    const paid = discountedPrice(rec);
    if (credits < paid) return;
    setBookings(b => b + 1);
    setRevenue(r => r + paid);
    setCredits(c => c - paid);
    if (activeMessageId) setPaidGuestIds(prev => prev.includes(activeMessageId) ? prev : [...prev, activeMessageId]);
    setPaymentOpen(false);
    setVoucherOpen(false);
    setChannel('whatsapp');
  };

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
            const isActive = activeMessageId === guest.id && !panelClosed;
            const isPaid = paidGuestIds.includes(guest.id);

            const mm = Math.max(0, Math.floor(timeUntilFire / 60)).toString().padStart(2, '0');
            const ss = Math.max(0, timeUntilFire % 60).toString().padStart(2, '0');

            return (
              <div
                key={guest.id}
                onClick={() => selectGuest(guest.id, isFired)}
                className={`p-4 rounded-xl border bg-white transition-all duration-500 ${isActive ? 'shadow-md border-primary/40' : 'shadow-sm border-[#ECECEF]'} ${isFired ? 'cursor-pointer hover:border-primary/40 hover:shadow-md' : 'opacity-60'}`}
              >
                <div className="font-bold text-[15px] text-[#2A2A33] mb-1">{guest.guest_name}</div>
                <div className="text-sm text-[#6B6B76] mb-3 truncate font-medium">{guest.experience_name}</div>
                <div className="flex justify-between items-end">
                  <div className="text-xs text-[#8A8A93]">{guest.city} · Ends {guest.end_time}</div>
                  {!isFired ? (
                    <div className="text-sm font-bold font-mono text-[#444444]">T-{mm}:{ss}</div>
                  ) : isPaid ? (
                    <div className="text-xs font-bold text-primary">View ticket →</div>
                  ) : (
                    <div className="text-xs font-bold text-primary">Tap to open →</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeGuest && activeRec && !panelClosed && (
          <motion.div
            key={activeGuest.id}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className={`absolute bottom-0 left-0 w-full ${channel === 'app' ? 'h-[calc(100%-44px)]' : 'h-[460px]'} bg-white border-t border-[#ECECEF] flex flex-col z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-2xl overflow-hidden`}
          >
            {/* Shared top bar: back + channel switch */}
            <div className="bg-white px-3 py-2.5 flex items-center gap-2 shrink-0 border-b border-[#ECECEF]">
              <button
                onClick={() => { setVoucherOpen(false); setPanelClosed(true); }}
                className="text-[#54656f] hover:text-[#111B21] shrink-0"
                aria-label="Back to live console"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex items-center gap-1 ml-auto bg-[#F2F2F5] p-0.5 rounded-lg">
                <button
                  onClick={() => setChannel('whatsapp')}
                  className={`text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors ${channel === 'whatsapp' ? 'bg-white text-[#1A1A22] shadow-sm' : 'text-[#8A8A93]'}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={openApp}
                  className={`text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors ${channel === 'app' ? 'bg-white text-primary shadow-sm' : 'text-[#8A8A93]'}`}
                >
                  Headout App
                </button>
              </div>
            </div>

            {channel === 'whatsapp' ? (
              <>
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

                <div className="flex-1 min-h-0 whatsapp-bg p-4 overflow-y-auto flex flex-col">
                  <div className="mt-auto flex flex-col">
                    <WhatsAppMessage guest={activeGuest} recommendation={activeRec} onOpenLink={openApp} />

                    {paidGuestIds.includes(activeGuest.id) ? (
                      <WhatsAppTicket guest={activeGuest} recommendation={activeRec} onOpenVoucher={() => setVoucherOpen(true)} />
                    ) : (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        onClick={openApp}
                        className="self-center mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#54656f] bg-white/70 backdrop-blur px-3 py-1.5 rounded-full shadow-sm hover:bg-white"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Tap the link → opens in the Headout app
                      </motion.button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <HeadoutAppOffer
                guest={activeGuest}
                recommendation={activeRec}
                countdownLabel={countdownLabel}
                expired={offerExpired}
                alreadyBooked={activeAlreadyPaid}
                onBook={() => handleBook(activeRec)}
              />
            )}

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

      <AnimatePresence>
        {paymentOpen && activeGuest && activeRec && (
          <PaymentGateway
            guest={activeGuest}
            recommendation={activeRec}
            credits={credits}
            onPaid={() => handlePaid(activeRec)}
            onClose={() => setPaymentOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {voucherOpen && activeGuest && activeRec && (
          <HeadoutVoucher
            guest={activeGuest}
            recommendation={activeRec}
            bookings={bookings}
            revenue={revenue}
            onClose={() => { console.log('[MomentAfter] voucher closed → back to console'); setVoucherOpen(false); setPanelClosed(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}