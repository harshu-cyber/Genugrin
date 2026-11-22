import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // ~8 seconds: 100 steps × 80ms
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            if (onFinish) onFinish();
          }, 700);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onFinish]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="genugrin-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Very subtle background texture — thin horizontal rule lines, barely visible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 39px, #E8F0EB 39px, #E8F0EB 40px)',
              opacity: 0.35,
            }}
          />

          {/* Thin top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: '#147D55' }}
          />

          {/* Main content — vertically centered */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">

            {/* Logo — full logo.png, fades + scales in */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="mb-8"
            >
              <img
                src="/logo.png"
                alt="GENUGRIN HEALTHCARE"
                className="w-64 sm:w-72 object-contain mx-auto"
                draggable={false}
              />
            </motion.div>

            {/* Thin divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
              className="w-16 h-px mb-8"
              style={{ backgroundColor: '#147D55', transformOrigin: 'center' }}
            />

            {/* Progress bar — clean, thin, professional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="w-full space-y-3"
            >
              {/* Track */}
              <div
                className="w-full h-[3px] rounded-full overflow-hidden"
                style={{ backgroundColor: '#DDE8E3' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: '#147D55',
                    transition: 'width 80ms linear',
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="flex items-center justify-between">
                <span
                  className="text-xs tracking-widest uppercase font-medium"
                  style={{ color: '#8AA89A', letterSpacing: '0.12em' }}
                >
                  Loading
                </span>
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: '#147D55' }}
                >
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Footer — developer credit, bottom of screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-6 left-0 right-0 text-center"
          >
            <p
              className="text-[11px] tracking-wider uppercase"
              style={{ color: '#B0BFBA' }}
            >
              Developed by Brajwasi's Coders
            </p>
          </motion.div>

          {/* Thin bottom accent bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ backgroundColor: '#17324D' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
