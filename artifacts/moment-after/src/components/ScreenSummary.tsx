import { motion } from 'framer-motion';

export default function ScreenSummary({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-col h-full p-8 bg-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex items-center gap-3 mb-10">
           <img 
            src="https://cdn-imgix-open.headout.com/logo/svg/Headout_purps.svg" 
            alt="headout"
            className="h-6"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<span class="text-primary font-bold text-xl leading-none">headout</span>');
            }}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="text-primary text-xs font-bold tracking-widest uppercase">Summary</div>
        </div>
        
        <div className="flex flex-col gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-extrabold tracking-tight mb-3 text-[#2A2A33]">0 → Measurable</div>
            <div className="text-[#6B6B76] text-lg leading-relaxed font-medium">
              Same-day second bookings instantly become a trackable metric within 48hrs of shipping.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-[34px] leading-tight font-extrabold tracking-tight mb-3 text-primary">€0 CAC</div>
            <div className="text-[#6B6B76] text-lg leading-relaxed font-medium">
              Customer acquisition cost is zero. They're already ours, standing on the street with their wallet.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-3xl font-extrabold tracking-tight mb-3 text-[#E5006E]">&lt; 60s Latency</div>
            <div className="text-[#6B6B76] text-lg leading-relaxed font-medium">
              From the moment an experience ends to the notification hitting their pocket.
            </div>
          </motion.div>
        </div>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-8 pb-4"
      >
        <button 
          onClick={onRestart}
          className="w-full bg-[#F7F7F8] border-2 border-[#ECECEF] text-[#2A2A33] font-bold py-4 rounded-xl flex items-center justify-center hover:bg-[#ECECEF] transition-colors"
        >
          Restart Demo
        </button>
      </motion.div>
    </div>
  );
}