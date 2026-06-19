import { motion } from 'framer-motion';

export default function ScreenSummary({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-col h-full p-6 bg-[#0a0a0a] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="text-primary text-sm font-bold tracking-widest uppercase mb-8">What Changes</div>
        
        <div className="flex flex-col gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl font-black mb-2">0 → Measurable</div>
            <div className="text-gray-400 leading-relaxed">
              Same-day second bookings instantly become a trackable metric within 48hrs of shipping.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-3xl font-black mb-2 text-primary">€0 CAC</div>
            <div className="text-gray-400 leading-relaxed">
              Customer acquisition cost is zero. They're already ours, standing on the street with their wallet.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-3xl font-black mb-2">&lt; 60s Latency</div>
            <div className="text-gray-400 leading-relaxed">
              From the moment an experience ends to the notification hitting their pocket.
            </div>
          </motion.div>
        </div>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-8"
      >
        <button 
          onClick={onRestart}
          className="w-full bg-[#111] border border-[#333] text-white font-semibold py-4 rounded-xl flex items-center justify-center hover:bg-[#1a1a1a] transition-colors"
        >
          Restart Demo
        </button>
      </motion.div>
    </div>
  );
}
