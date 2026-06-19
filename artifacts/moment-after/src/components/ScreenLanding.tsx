import { motion } from 'framer-motion';

export default function ScreenLanding({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full p-8 justify-center bg-white relative overflow-hidden">
      {/* Subtle background flair */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <img 
          src="https://cdn-imgix-open.headout.com/logo/svg/Headout_purps.svg" 
          alt="headout"
          className="h-8 mb-12"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<div class="text-primary font-bold text-2xl tracking-tight mb-12">headout</div>');
          }}
        />
        
        <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-tight mb-5 text-[#2A2A33]">
          The Moment After
        </h1>
        
        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-sm">
          Headout's highest-intent customer is someone who just finished an experience. We've been sending them nothing. Until now.
        </p>

        <button 
          onClick={onNext}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#6b00d6] transition-colors shadow-lg shadow-primary/25"
        >
          See it live
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}