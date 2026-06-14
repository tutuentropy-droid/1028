import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { Puzzle } from '@/types';

interface DragNumberPuzzleProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

const DragNumberPuzzle = ({ puzzle, onCorrect, onIncorrect, disabled }: DragNumberPuzzleProps) => {
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
    onCorrect: () => {
      if (isAllCorrect()) {
        onCorrect();
      }
    },
    onIncorrect: () => {
      onIncorrect();
    },
  });

  useEffect(() => {
    if (isAllCorrect() && !disabled) {
      onCorrect();
    }
  }, [isAllCorrect, disabled, onCorrect]);

  const target = puzzle.targets[0];
  const placedOptionId = placedItems.get(target.id);
  const placedOption = puzzle.options.find((o) => o.id === placedOptionId);

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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="glass-card p-10 text-center"
      >
        <div className="text-5xl md:text-6xl formula-text text-glow-cyan mb-8 font-bold">
          <span className="text-white">E</span>
          <span className="text-indigo-400 mx-2">=</span>
          <span
            onDragOver={(e) => !disabled && handleDragOver(e, target.id)}
            onDragLeave={() => handleDragLeave(target.id)}
            onDrop={(e) => !disabled && handleDrop(e, target.id)}
            className={`
              inline-block min-w-[200px] px-6 py-3 mx-2 rounded-xl
              border-2 border-dashed transition-all duration-300
              ${placedOption ? 'border-glow-green/60 bg-glow-green/10' : 'border-glow-cyan/40 bg-quantum-800/50'}
              ${!placedOption && !disabled ? 'hover:border-glow-cyan/70 hover:bg-quantum-700/50' : ''}
              ${shakeTarget === target.id ? 'shake border-glow-red' : ''}
              ${correctTarget === target.id ? 'correct-flash' : ''}
              ${disabled ? 'opacity-60' : ''}
            `}
            style={placedOption ? { boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)' } : {}}
          >
            {placedOption ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-glow-green"
              >
                {placedOption.label}
              </motion.span>
            ) : (
              <span className="text-indigo-400/50 text-2xl">?</span>
            )}
          </span>
          <span className="text-white">ν</span>
        </div>

        <p className="text-sm text-indigo-400/70">
          能量 = 普朗克常数 × 频率
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-center text-indigo-300/80 mb-4">
          可拖拽的能量子数值
        </h4>
        <div className="flex flex-wrap justify-center gap-4">
          {puzzle.options.map((option, index) => {
            const placed = isOptionPlaced(option.id);
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: placed ? 0.3 : 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                draggable={!placed && !disabled}
                onDragStart={(e) => !disabled && handleDragStart(e as unknown as React.DragEvent, option.id)}
                onDragEnd={handleDragEnd}
                whileHover={!placed && !disabled ? { scale: 1.05, y: -4 } : {}}
                whileTap={!placed && !disabled ? { scale: 0.95 } : {}}
                className={`
                  px-6 py-4 rounded-xl cursor-grab active:cursor-grabbing
                  border-2 transition-all duration-300
                  ${placed 
                    ? 'border-gray-600/30 bg-gray-800/20 cursor-not-allowed' 
                    : 'border-glow-cyan/40 bg-quantum-800/70 hover:border-glow-cyan/70 hover:bg-quantum-700/70 hover:shadow-glow-cyan'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="formula-text text-lg text-glow-cyan font-medium">
                  {option.label}
                </div>
                <div className="text-xs text-indigo-400/60 mt-1">
                  {option.value}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DragNumberPuzzle;
