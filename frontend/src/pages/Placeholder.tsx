import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

export const Placeholder = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center py-24">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-semibold tracking-wider uppercase">
          Coming Soon
        </div>
      </motion.div>
    </div>
  );
};
