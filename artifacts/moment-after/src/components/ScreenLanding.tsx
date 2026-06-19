import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScreenLanding({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full p-6 justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          The Moment After
        </h1>
        
        <p className="text-muted-foreground text-lg leading-relaxed mb-12">
          Headout's highest-intent customer is someone who just finished an experience. We've been sending them nothing. Until now.
        </p>

        <button 
          onClick={onNext}
          className="w-full bg-primary text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20b858] transition-colors"
        >
          See it live
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
