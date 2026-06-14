import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { Puzzle } from '@/types';

interface OrbitPuzzleProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

const OrbitPuzzle = ({ puzzle, onCorrect, onIncorrect, disabled }: OrbitPuzzleProps) => {
  const correctPairs = useMemo(() => {
    const pairs = new Map<string, string>();
    puzzle.targets.forEach((t) => {
      pairs.set(t.id, t.correctOptionId);
    });
    return pairs;
  }, [puzzle.targets]);

  const {
    placedItems,
    shakeTarget,
    correctTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isOptionPlaced,
    isAllCorrect,
  } = useDragAndDrop({
    correctPairs,
    onCorrect: () => {},
    onIncorrect: () => {
      onIncorrect();
    },
  });

  useEffect(() => {
    if (isAllCorrect() && !disabled) {
      onCorrect();
    }
  }, [isAllCorrect, disabled, onCorrect]);

  const orbitSizes = [
    { size: 'w-32 h-32', label: 'n=1', energy: '最低能量' },
    { size: 'w-56 h-56', label: 'n=2', energy: '中等能量' },
    { size: 'w-80 h-80', label: 'n=3', energy: '最高能量' },
  ];

  const getElectronEnergy = (optionId: string) => {
    switch (optionId) {
      case 'electron-1':
        return { level: 1, color: '#00d4ff' };
      case 'electron-2':
        return { level: 2, color: '#9d4edd' };
      case 'electron-3':
        return { level: 3, color: '#ff6b35' };
      default:
        return { level: 0, color: '#fff' };
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold font-serif text-white mb-2">
          {puzzle.title}
        </h3>
        <p className="text-indigo-300/80">{puzzle.instruction}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="relative mx-auto w-96 h-96 flex items-center justify-center"
        style={{ maxWidth: '100%' }}
      >
        {puzzle.targets.map((target, index) => {
          const orbit = orbitSizes[index];
          const placedOptionId = placedItems.get(target.id);
          const placedOption = puzzle.options.find((o) => o.id === placedOptionId);
          const electron = placedOption ? getElectronEnergy(placedOption.id) : null;

          return (
            <div
              key={target.id}
              onDragOver={(e) => !disabled && handleDragOver(e, target.id)}
              onDragLeave={() => handleDragLeave(target.id)}
              onDrop={(e) => !disabled && handleDrop(e, target.id)}
              className={`
                absolute rounded-full border-2 border-dashed transition-all duration-300
                ${orbit.size}
                ${placedOption ? 'border-glow-green/50' : 'border-glow-orange/30'}
                ${shakeTarget === target.id ? 'shake border-glow-red' : ''}
                ${correctTarget === target.id ? 'correct-flash' : ''}
              `}
              style={{
                boxShadow: placedOption
                  ? '0 0 20px rgba(57, 255, 20, 0.2), inset 0 0 20px rgba(57, 255, 20, 0.05)'
                  : 'inset 0 0 20px rgba(255, 107, 53, 0.05)',
              }}
            >
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <span className="text-xs text-indigo-400/70 font-mono">
                  {orbit.label}
                </span>
              </div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <span className="text-xs text-indigo-500/50">
                  {orbit.energy}
                </span>
              </div>

              {placedOption && electron && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3 + index, repeat: Infinity, ease: 'linear' }}
                    className="relative w-full h-full"
                    style={{
                      width: orbit.size.split(' ')[0].replace('w-', ''),
                      height: orbit.size.split(' ')[1].replace('h-', ''),
                    }}
                  >
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                      style={{
                        background: electron.color,
                        boxShadow: `0 0 15px ${electron.color}, 0 0 30px ${electron.color}`,
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>
          );
        })}

        <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">+</span>
          <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-orange-400" />
        </div>

        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-indigo-400/50">原子核</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12"
      >
        <h4 className="text-center text-indigo-300/80 mb-4">
          可拖拽的电子
        </h4>
        <div className="flex flex-wrap justify-center gap-4">
          {puzzle.options.map((option, index) => {
            const placed = isOptionPlaced(option.id);
            const electron = getElectronEnergy(option.id);

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: placed ? 0.3 : 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                draggable={!placed && !disabled}
              onDragStart={(e) => !disabled && handleDragStart(e as unknown as React.DragEvent, option.id)}
              onDragEnd={handleDragEnd}
                whileHover={!placed && !disabled ? { scale: 1.05, y: -4 } : {}}
                whileTap={!placed && !disabled ? { scale: 0.95 } : {}}
                className={`
                  px-6 py-4 rounded-xl cursor-grab active:cursor-grabbing
                  border-2 transition-all duration-300 min-w-[160px] text-center
                  ${placed 
                    ? 'border-gray-600/30 bg-gray-800/20 cursor-not-allowed' 
                    : 'border-glow-orange/40 bg-quantum-800/70 hover:border-glow-orange/70 hover:bg-quantum-700/70 hover:shadow-glow-orange'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: electron.color,
                      boxShadow: `0 0 10px ${electron.color}`,
                    }}
                  />
                  <span className="text-white font-medium">
                    {option.label}
                  </span>
                </div>
                <div className="text-xs text-indigo-400/60">
                  {option.value} 轨道
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center"
      >
        <div className="inline-block glass-card-orange px-6 py-3">
          <p className="text-sm text-indigo-300/70">
            💡 <span className="text-glow-orange">提示：</span>
            电子只能在特定轨道上存在，轨道越靠外，能量越高！
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrbitPuzzle;
