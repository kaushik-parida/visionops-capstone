import React from 'react';
import { motion } from 'framer-motion';

// STRICT RULE: h-screen and overflow-hidden guarantees no vertical scrolling.
export function BaseSlide({ title, subtitle, children, className = '' }) {
  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col p-12 ${className}`}>
      <div className="shrink-0 mb-8 h-20">
        {subtitle && (
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-mono text-executive-success uppercase tracking-widest mb-2"
          >
            {subtitle}
          </motion.h2>
        )}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-display font-bold text-executive-primary tracking-tight"
        >
          {title}
        </motion.h1>
      </div>

      {/* Content takes the rest of the available height, NEVER overflowing */}
      <div className="flex-1 min-h-0 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
