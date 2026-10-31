import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="w-full transform-gpu"
    >
      {children}
    </motion.div>
  );
};

