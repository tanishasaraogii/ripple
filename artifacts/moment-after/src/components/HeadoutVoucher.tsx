import { motion } from 'framer-motion';
import { Guest, Recommendation, discountedPrice } from '../lib/data';

function PseudoQR({ seed }: { seed: string }) {
  const size = 21;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h ^= h << 13; h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5; h >>>= 0;
    return h / 0xffffffff;
  };
  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i++) cells.push(rand() > 0.5);

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const local = (br: number, bc: number) => {
      const rr = r - br, cc = c - bc;
      if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true;
      if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= size - 7) return local(0, size - 7);
    if (r >= size - 7 && c < 7) return local(size - 7, 0);
    return false;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-28 h-28" shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#ffffff" />
      {Array.from({ length: size }).map((_, r) =>
        Array.from({ length: size }).map((_, c) => {
          const on = isFinder(r, c) ? finderOn(r, c) : cells[r * size + c];
          return on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111B21" /> : null;
        })
      )}
    </svg>
  );
}

export default function HeadoutVoucher({
  guest,
  recommendation,
  onClose,
  bookings,
  revenue,
}: {
  guest: Guest;
  recommendation: Recommendation;
  onClose: () => void;
  bookings: number;
  revenue: number;
}) {
  const bookingId = (() => {
    let h = 0;
    const s = guest.id + recommendation.id;
    for (let i = 0; i < s.length; i++) h = (h * 131 + s.charCodeAt(i)) >>> 0;
    return (30000000 + (h % 9000000)).toString();
  })();

  const startTime = (() => {
    const d = new Date(Date.now() + 35 * 60 * 1000);
    let hr = d.getHours();
    const min = d.getMinutes().toString().padStart(2, '0');
    const ampm = hr >= 12 ? 'pm' : 'am';
    hr = hr % 12 || 12;
    return `${hr.toString().padStart(2, '0')}:${min}${ampm}`;
  })();

  const experienceDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const guestsLabel = guest.solo_or_group === 'group' ? '2 Adults' : '1 Adult';

  return (
    <motion.div
      key="voucher"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
      className="absolute bottom-0 left-0 w-full h-full bg-white z-40 flex flex-col rounded-t-2xl overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.18)]"
    >
      {/* Success banner */}
      <div className="bg-primary px-5 py-3 flex items-center gap-3 shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.15, bounce: 0.5 }}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8000FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <div className="flex-1">
          <div className="text-white font-bold text-[15px] leading-tight">Tickets issued</div>
          <div className="text-white/70 text-[12px] leading-tight">Paid with credits · sent to {guest.guest_name}</div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white shrink-0" aria-label="Close voucher">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Headout logo */}
        <img
          src="https://cdn-imgix-open.headout.com/logo/svg/Headout_purps.svg"
          alt="headout"
          className="h-6 mb-5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            e.currentTarget.parentElement?.insertAdjacentHTML(
              'afterbegin',
              '<span class="text-primary font-extrabold text-xl block mb-5 lowercase">headout</span>'
            );
          }}
        />

        <div className="text-[11px] font-semibold tracking-[0.12em] text-[#9A9AA3] uppercase mb-1.5">
          Booking ID {bookingId}
        </div>
        <h3 className="text-[19px] font-extrabold text-[#1A1A22] leading-snug">{recommendation.name}</h3>
        <p className="text-[13px] text-[#6B6B76] mt-1">
          Selected option: <span className="font-semibold text-[#3A3A44]">Skip-the-Line Entry</span>
        </p>

        <div className="h-px bg-[#ECECEF] my-5" />

        <h4 className="text-[15px] font-bold text-[#1A1A22] mb-4">Booking details</h4>
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <Detail label="Purchased by" value={guest.guest_name} />
          <Detail label="Guests" value={guestsLabel} />
          <Detail label="Experience date" value={experienceDate} />
          <Detail label="Start time" value={startTime} />
          <Detail label="Duration" value="2 hours" />
          <Detail label="Distance" value={`${recommendation.distance_minutes} min walk`} />
          <Detail
            label="Amount paid"
            value={
              recommendation.discount_pct > 0 ? (
                <span className="flex items-baseline gap-1.5">
                  <span>€{discountedPrice(recommendation)}</span>
                  <span className="text-[12px] font-normal text-[#9A9AA3] line-through">€{recommendation.price}</span>
                </span>
              ) : (
                `€${recommendation.price}`
              )
            }
          />
          {recommendation.discount_pct > 0 && (
            <Detail
              label="You saved"
              value={
                <span className="text-[#E5006E]">
                  €{recommendation.price - discountedPrice(recommendation)} · {recommendation.discount_pct}% perk
                </span>
              }
            />
          )}
        </div>

        <div className="mt-5 border-l-[3px] border-primary bg-primary/[0.04] rounded-r-md px-4 py-3">
          <p className="text-[13px] text-[#4A4A55] leading-relaxed">
            Meet your guide at the designated meeting point. Do check the location instructions to get there.
          </p>
        </div>

        <div className="h-px bg-[#ECECEF] my-5" />

        <h4 className="text-[15px] font-bold text-[#1A1A22] mb-3">Scan ticket</h4>
        <div className="flex items-center gap-4">
          <div className="p-2 border border-[#ECECEF] rounded-lg bg-white">
            <PseudoQR seed={bookingId + recommendation.name} />
          </div>
          <div className="text-[12px] text-[#9A9AA3] font-mono leading-relaxed">
            {bookingId.slice(0, 4)}-{bookingId.slice(4)}-
            <br />a255-d6af57172a72
          </div>
        </div>

        <div className="h-px bg-[#ECECEF] my-5" />

        <h4 className="text-[15px] font-bold text-[#1A1A22] mb-3">Essential information</h4>
        <div className="flex flex-col gap-3">
          <EssentialItem
            title="When to arrive"
            body="Arrive 15 minutes early to make the most of your experience."
            icon={
              <>
                <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" />
              </>
            }
          />
          <EssentialItem
            title="Bring your ID"
            body="Carry a government-approved valid photo ID for easy verification."
            icon={
              <>
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </>
            }
          />
        </div>
      </div>

      {/* Money shot footer */}
      <div className="shrink-0 border-t border-[#ECECEF] bg-white px-6 py-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[13px] font-medium text-[#6B6B76]">Same-day second bookings today</span>
          <span className="text-[13px] font-bold text-[#1A1A22]">{bookings}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-medium text-[#6B6B76]">Revenue recovered</span>
          <span className="text-[13px] font-bold text-[#1A1A22]">€{revenue}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[#ECECEF]">
          <span className="text-[11px] font-bold text-primary uppercase tracking-[0.16em]">Customer acquisition cost</span>
          <span className="text-[34px] font-extrabold text-primary tracking-tight leading-none">€0</span>
        </div>
      </div>
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] text-[#9A9AA3] mb-0.5">{label}</div>
      <div className="text-[14px] font-semibold text-[#2A2A33]">{value}</div>
    </div>
  );
}

function EssentialItem({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8000FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 mt-0.5"
      >
        {icon}
      </svg>
      <div>
        <div className="text-[13.5px] font-bold text-[#2A2A33] leading-tight">{title}</div>
        <div className="text-[12.5px] text-[#6B6B76] leading-snug mt-0.5">{body}</div>
      </div>
    </div>
  );
}
