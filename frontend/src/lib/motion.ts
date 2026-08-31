import { Variants } from 'framer-motion';

// Section stagger container
export const sectionStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
};

// Section fade-up reveal (250ms duration, smooth cubic bezier)
export const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Hero section entrance (instant 100ms visibility start)
export const heroEntrance: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Interactive priority variant for visualizers & canvas controls
export const visualizerPriority: Variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};

// Standard scroll animation viewport config
export const scrollViewportConfig = {
  once: true,
  margin: '-40px',
};
