import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import type { Puzzle } from '@/types';

interface PhotonMatchPuzzleProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

const PhotonMatchPuzzle = ({ puzzle, onCorrect, onIncorrect, disabled }: PhotonMatchPuzzleProps) => {
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

  const getPhotonColor = (targetId: string) => {
    switch (targetId) {
      case 'target-red':
        return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)', label: '红' };
      case 'target-green':
        return { main: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)', label: '绿' };
      case 'target-uv':
        return { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', label: '紫' };
      default:
        return { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.5)', label: '' };
    }
  };

  const getEnergyLevel = (optionId: string) => {
    switch (optionId) {
      case 'opt-low':
        return { level: 1, text: '低能量' };
      case 'opt-mid':
        return { level: 2, text: '中能量' };
      case 'opt-high':
        return { level: 3, text: '高能量' };
      default:
        return { level: 0, text: '' };
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {puzzle.targets.map((target, index) => {
          const color = getPhotonColor(target.id);
          const placedOptionId = placedItems.get(target.id);
          const placedOption = puzzle.options.find((o) => o.id === placedOptionId);
          const energy = placedOption ? getEnergyLevel(placedOption.id) : null;

          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              onDragOver={(e) => !disabled && handleDragOver(e, target.id)}
              onDragLeave={() => handleDragLeave(target.id)}
              onDrop={(e) => !disabled && handleDrop(e, target.id)}
              className={`
                glass-card-purple p-6 text-center transition-all duration-300
                ${shakeTarget === target.id ? 'shake border-glow-red' : ''}
                ${correctTarget === target.id ? 'correct-flash' : ''}
                ${placedOption ? 'border-glow-green/50' : ''}
                ${disabled ? 'opacity-70' : ''}
              `}
              style={placedOption ? { boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)' } : {}}
            >
              <div className="mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      background: color.main,
                      boxShadow: `0 0 20px ${color.main}`,
                    }}
                  />
                </motion.div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-1">
                {target.label}
              </h4>

              <div className="h-24 mt-4 flex items-center justify-center">
                {placedOption ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-3 px-4 rounded-lg bg-glow-green/10 border border-glow-green/40"
                  >
                    <p className="text-glow-green font-medium text-sm">
                      {placedOption.label}
                    </p>
                    {energy && (
                      <div className="flex justify-center gap-1 mt-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded ${
                              i <= energy.level ? 'bg-glow-green' : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="w-full py-4 px-4 rounded-lg border-2 border-dashed border-glow-purple/30 bg-quantum-800/30">
                    <p className="text-indigo-400/50 text-sm">
                      拖拽能量到这里
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <h4 className="text-center text-indigo-300/80 mb-4">
          可拖拽的光子能量
        </h4>
        <div className="flex flex-wrap justify-center gap-4">
          {puzzle.options.map((option, index) => {
            const placed = isOptionPlaced(option.id);
            const energy = getEnergyLevel(option.id);

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: placed ? 0.3 : 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                draggable={!placed && !disabled}
              onDragStart={(e) => !disabled && handleDragStart(e as unknown as React.DragEvent, option.id)}
              onDragEnd={handleDragEnd}
                whileHover={!placed && !disabled ? { scale: 1.05, y: -4 } : {}}
                whileTap={!placed && !disabled ? { scale: 0.95 } : {}}
                className={`
                  px-6 py-4 rounded-xl cursor-grab active:cursor-grabbing
                  border-2 transition-all duration-300 min-w-[180px] text-center
                  ${placed 
                    ? 'border-gray-600/30 bg-gray-800/20 cursor-not-allowed' 
                    : 'border-glow-purple/40 bg-quantum-800/70 hover:border-glow-purple/70 hover:bg-quantum-700/70 hover:shadow-glow-purple'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="text-glow-purple font-medium mb-2">
                  {option.label}
                </div>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={!placed && i <= energy.level ? {
                        height: ['16px', '24px', '16px'],
                      } : {}}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                      className={`w-2 rounded ${
                        i <= energy.level ? 'bg-glow-purple' : 'bg-gray-700'
                      }`}
                      style={{ height: '24px' }}
                    />
                  ))}
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
        <div className="inline-block glass-card px-6 py-3">
          <p className="text-sm text-indigo-300/70">
            💡 <span className="text-glow-cyan">提示：</span>
            光子的能量与频率成正比——频率越高，能量越大！
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotonMatchPuzzle;
