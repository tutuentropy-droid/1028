import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cat } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { Puzzle } from '@/types';

interface SchrodingerPuzzleProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

const CAT_EMOJIS = [
  '(^･ω･^=)',
  '(=^･ω･^=)',
  'ฅ^•ﻌ•^ฅ',
  '(=｀ω´=)',
  '(=^ェ^=)',
  'ฅ(^•ﻌ•^ฅ)',
  '٩(◕‿◕｡)۶',
  '(^○^)',
  '(^｡^)',
  '~(=^･ω･^)丿',
];

const OSCILLATION_DURATION = 5000;
const SWAP_INTERVAL = 350;

const SchrodingerPuzzle = ({ puzzle, onCorrect, onIncorrect, disabled }: SchrodingerPuzzleProps) => {
  const {
    superpositionTotalGuesses,
    superpositionCorrectGuesses,
    superpositionConsecutiveCorrect,
    catEmojiRewardActive,
    recordSuperpositionGuess,
    consumeCatEmojiReward,
  } = useGameStore();

  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isOscillating, setIsOscillating] = useState(true);
  const [swapToggle, setSwapToggle] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(OSCILLATION_DURATION);

  const oscillationStartRef = useRef<number>(Date.now());
  const swapIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const correctOption = useMemo(() => {
    return puzzle.options.find((o) => o.id === puzzle.correctAnswerId);
  }, [puzzle]);

  const displayDistractors = useMemo(() => {
    if (catEmojiRewardActive && puzzle.distractors) {
      return puzzle.distractors.map((d, i) => ({
        ...d,
        label: CAT_EMOJIS[i % CAT_EMOJIS.length],
        value: CAT_EMOJIS[(i + 1) % CAT_EMOJIS.length],
      }));
    }
    return puzzle.distractors || [];
  }, [puzzle.distractors, catEmojiRewardActive]);

  const displayedAnswers = useMemo(() => {
    if (!correctOption) return [];
    const distractor = displayDistractors[0] || {
      id: 'dummy-distractor',
      label: '???',
      value: '???',
    };
    return [correctOption, distractor];
  }, [correctOption, displayDistractors]);

  const leftAnswer = swapToggle ? displayedAnswers[1] : displayedAnswers[0];
  const rightAnswer = swapToggle ? displayedAnswers[0] : displayedAnswers[1];

  const cleanup = useCallback(() => {
    if (swapIntervalRef.current) {
      clearInterval(swapIntervalRef.current);
      swapIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const finalizeAnswer = useCallback(
    (answerId: string, wasOscillating: boolean) => {
      if (hasAnswered) return;

      cleanup();
      setIsOscillating(false);
      setIsCollapsed(true);
      setSelectedAnswerId(answerId);
      setHasAnswered(true);

      const isCorrect = answerId === puzzle.correctAnswerId;

      if (wasOscillating) {
        recordSuperpositionGuess(isCorrect);
      }

      setTimeout(() => {
        setShowResult(isCorrect ? 'correct' : 'incorrect');
      }, 600);

      setTimeout(() => {
        if (isCorrect) {
          if (catEmojiRewardActive) {
            consumeCatEmojiReward();
          }
          onCorrect();
        } else {
          onIncorrect();
        }
      }, 2000);
    },
    [
      hasAnswered,
      puzzle.correctAnswerId,
      recordSuperpositionGuess,
      catEmojiRewardActive,
      consumeCatEmojiReward,
      onCorrect,
      onIncorrect,
      cleanup,
    ]
  );

  const handleSelect = useCallback(
    (answerId: string) => {
      if (disabled || hasAnswered) return;
      finalizeAnswer(answerId, isOscillating);
    },
    [disabled, hasAnswered, isOscillating, finalizeAnswer]
  );

  const handleCollapse = useCallback(() => {
    if (disabled || hasAnswered) return;
    const randomId = displayedAnswers[Math.floor(Math.random() * displayedAnswers.length)]?.id;
    if (randomId) {
      finalizeAnswer(randomId, isOscillating);
    }
  }, [disabled, hasAnswered, displayedAnswers, isOscillating, finalizeAnswer]);

  useEffect(() => {
    if (disabled || hasAnswered) return;

    oscillationStartRef.current = Date.now();

    swapIntervalRef.current = setInterval(() => {
      setSwapToggle((prev) => !prev);
    }, SWAP_INTERVAL);

    countdownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - oscillationStartRef.current;
      const remaining = Math.max(0, OSCILLATION_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        const randomId =
          displayedAnswers[Math.floor(Math.random() * displayedAnswers.length)]?.id;
        if (randomId) {
          finalizeAnswer(randomId, false);
        }
      }
    }, 50);

    return cleanup;
  }, [disabled, hasAnswered, displayedAnswers, finalizeAnswer, cleanup]);

  const progressPercent = (timeRemaining / OSCILLATION_DURATION) * 100;
  const superpositionAccuracy =
    superpositionTotalGuesses > 0
      ? Math.round((superpositionCorrectGuesses / superpositionTotalGuesses) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold font-serif text-white mb-2">
          {puzzle.title}
        </h3>
        <p className="text-indigo-300/80">{puzzle.instruction}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-4 text-sm"
      >
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-glow-purple" />
          <span className="text-indigo-300">叠加正确率：</span>
          <span className="text-glow-purple font-mono font-bold">
            {superpositionAccuracy}%
          </span>
          <span className="text-indigo-400/60">
            ({superpositionCorrectGuesses}/{superpositionTotalGuesses})
          </span>
        </div>

        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <span className="text-indigo-300">连胜：</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < superpositionConsecutiveCorrect
                    ? 'bg-glow-orange shadow-glow-orange'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {catEmojiRewardActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="glass-card-orange px-4 py-2 flex items-center gap-2"
          >
            <Cat className="w-4 h-4 text-glow-orange" />
            <span className="text-glow-orange font-medium">
              喵～奖励已激活！
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: 'spring' }}
        className="glass-card p-6 md:p-8 text-center mb-6"
      >
        <div className="mb-6">
          <p className="text-xs text-indigo-400/60 mb-2">请回答：</p>
          <p className="text-xl md:text-2xl font-serif text-white leading-relaxed">
            {puzzle.question}
          </p>
        </div>

        <div className="mb-6">
          <div className="h-1.5 w-full bg-gray-800/60 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.05 }}
              style={{
                background:
                  progressPercent > 40
                    ? 'linear-gradient(90deg, #9d4edd, #00d4ff)'
                    : progressPercent > 20
                    ? 'linear-gradient(90deg, #ff6b35, #ffb800)'
                    : 'linear-gradient(90deg, #ff2e63, #ff6b35)',
                boxShadow:
                  progressPercent > 40
                    ? '0 0 10px rgba(157, 78, 221, 0.6)'
                    : '0 0 10px rgba(255, 46, 99, 0.6)',
              }}
            />
          </div>
          <p className="text-xs text-indigo-400/60">
            {isOscillating ? '波函数正在振荡...快做选择！' : '波函数已坍缩'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {[
            { answer: leftAnswer, side: 'left' },
            { answer: rightAnswer, side: 'right' },
          ].map(({ answer, side }, idx) => {
            if (!answer) return null;
            const isSelected = selectedAnswerId === answer.id;
            const isCorrectAnswer = answer.id === puzzle.correctAnswerId;
            const showCorrectness = showResult !== null;

            return (
              <motion.button
                key={`${answer.id}-${side}`}
                onClick={() => handleSelect(answer.id)}
                disabled={disabled || hasAnswered}
                initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
                animate={{
                  opacity: hasAnswered ? (isSelected ? 1 : 0.4) : isOscillating ? 0.75 : 1,
                  x: 0,
                  scale: isSelected ? [1, 1.03, 1] : 1,
                }}
                transition={{
                  delay: 0.4 + idx * 0.05,
                  scale: { duration: 0.3, repeat: isSelected ? Infinity : 0 },
                }}
                whileHover={
                  !disabled && !hasAnswered
                    ? { scale: 1.03, opacity: 1 }
                    : {}
                }
                whileTap={!disabled && !hasAnswered ? { scale: 0.97 } : {}}
                className={`
                  relative p-6 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    showCorrectness && isSelected
                      ? isCorrectAnswer
                        ? 'border-glow-green bg-glow-green/10'
                        : 'border-glow-red bg-glow-red/10'
                      : showCorrectness && isCorrectAnswer
                      ? 'border-glow-green/50 bg-glow-green/5'
                      : 'border-glow-purple/40 bg-quantum-800/50 hover:border-glow-purple/70 hover:bg-quantum-700/50'
                  }
                  ${disabled || hasAnswered ? 'cursor-default' : 'cursor-pointer'}
                `}
                style={{
                  backdropFilter: 'blur(8px)',
                  boxShadow:
                    showCorrectness && isSelected && isCorrectAnswer
                      ? '0 0 30px rgba(57, 255, 20, 0.3)'
                      : showCorrectness && isSelected && !isCorrectAnswer
                      ? '0 0 30px rgba(255, 46, 99, 0.3)'
                      : !hasAnswered
                      ? '0 0 20px rgba(157, 78, 221, 0.1)'
                      : undefined,
                }}
              >
                {isOscillating && !hasAnswered && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-glow-purple/20"
                    animate={{
                      x: ['-6px', '6px', '-6px'],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-indigo-400/60 font-mono">
                      {side === 'left' ? '|Ψ⟩ 左态' : '|Ψ⟩ 右态'}
                    </span>
                    {showCorrectness && (
                      <span
                        className={`text-xs font-bold ${
                          isCorrectAnswer ? 'text-glow-green' : 'text-glow-red'
                        }`}
                      >
                        {isCorrectAnswer ? '✓ 正确' : '✗ 错误'}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-medium text-white">{answer.label}</p>
                  {answer.value && answer.value !== answer.label && (
                    <p className="text-sm text-indigo-300/70 mt-1">{answer.value}</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={handleCollapse}
            disabled={disabled || hasAnswered}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={!disabled && !hasAnswered ? { scale: 1.05 } : {}}
            whileTap={!disabled && !hasAnswered ? { scale: 0.95 } : {}}
            className={`
              px-6 py-3 rounded-xl font-medium flex items-center gap-2
              border-2 transition-all
              ${
                disabled || hasAnswered
                  ? 'border-gray-600/30 bg-gray-800/20 text-gray-500 cursor-not-allowed'
                  : 'border-glow-orange/50 bg-glow-orange/10 text-glow-orange hover:bg-glow-orange/20 hover:border-glow-orange hover:shadow-glow-orange'
              }
            `}
          >
            <Zap className="w-5 h-5" />
            <span>坍缩！强制锁定</span>
          </motion.button>

          <p className="text-xs text-indigo-400/60 max-w-xs">
            💡 点击任一答案框即可选择；答案振荡时选对将计入"叠加正确率"。
            连续三次叠加态答对可获得猫咪奖励！
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-center p-4 rounded-xl border-2 ${
              showResult === 'correct'
                ? 'border-glow-green/40 bg-glow-green/10'
                : 'border-glow-red/40 bg-glow-red/10'
            }`}
          >
            {showResult === 'correct' ? (
              <p className="text-glow-green font-medium">
                ✨ 波函数坍缩至正确本征态！
                {superpositionConsecutiveCorrect >= 2 && isOscillating === false && '叠加态猜中！'}
              </p>
            ) : (
              <p className="text-glow-red font-medium">
                ⚠️ 坍缩到了错误的状态...再试一次！
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchrodingerPuzzle;
