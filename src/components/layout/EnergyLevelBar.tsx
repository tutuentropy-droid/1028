import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Atom } from 'lucide-react';

const EnergyLevelBar = () => {
  const { energyLevel } = useGameStore();
  const maxLevel = 5;

  const getLevelColor = (level: number) => {
    if (level <= 1) return 'from-glow-cyan/30 to-glow-cyan/60';
    if (level <= 2) return 'from-glow-blue/30 to-glow-cyan/60';
    if (level <= 3) return 'from-glow-purple/30 to-glow-blue/60';
    if (level <= 4) return 'from-glow-orange/30 to-glow-purple/60';
    return 'from-glow-green/30 to-glow-orange/60';
  };

  const getGlowColor = (level: number) => {
    if (level <= 1) return 'shadow-glow-cyan';
    if (level <= 2) return 'shadow-glow-cyan';
    if (level <= 3) return 'shadow-glow-purple';
    if (level <= 4) return 'shadow-glow-orange';
    return 'shadow-glow-green';
  };

  const getTextColor = (level: number) => {
    if (level <= 1) return 'text-glow-cyan';
    if (level <= 2) return 'text-glow-blue';
    if (level <= 3) return 'text-glow-purple';
    if (level <= 4) return 'text-glow-orange';
    return 'text-glow-green';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-6 right-6 z-50"
    >
      <div className="glass-card px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Atom className="w-5 h-5 text-glow-cyan animate-spin-slow" />
          <span className="text-xs text-indigo-300 font-medium tracking-wider">
            量子能级
          </span>
        </div>

        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={energyLevel}
              initial={{ scale: 1.5, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, type: 'spring' }}
              className={`text-2xl font-bold font-serif ${getTextColor(energyLevel)}`}
              style={{ textShadow: `0 0 10px currentColor` }}
            >
              n = {energyLevel}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-1">
          {Array.from({ length: maxLevel }).map((_, i) => {
            const level = maxLevel - i;
            const isActive = level <= energyLevel;

            return (
              <motion.div
                key={level}
                initial={false}
                animate={{
                  width: isActive ? '48px' : '24px',
                  opacity: isActive ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className={`h-2 rounded-full ${
                  isActive
                    ? `bg-gradient-to-r ${getLevelColor(level)} ${getGlowColor(level)}`
                    : 'bg-gray-700'
                }`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default EnergyLevelBar;
