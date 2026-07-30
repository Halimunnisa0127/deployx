import { motion } from 'framer-motion';

export default function EmptyIllustration({ icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20 shadow-slate-500/10',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${selectedColor}`}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}
