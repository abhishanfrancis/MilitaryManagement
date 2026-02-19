import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 z-50">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/15 dark:bg-purple-800/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Animated logo */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl border-2 border-primary-200 border-t-primary-600 dark:border-primary-700 dark:border-t-primary-400"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Text */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase"
        >
          Loading
        </motion.h2>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              className="w-2 h-2 rounded-full bg-primary-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;