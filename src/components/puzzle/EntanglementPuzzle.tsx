import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Star, Link2, RefreshCw } from 'lucide-react';
import type { Puzzle, ScientistAnecdote } from '@/types';

interface EntanglementPuzzleProps {
  puzzle: Puzzle;
  anecdotes?: ScientistAnecdote[];
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

interface ParticleLine {
  id: string;
  leftId: string;
  rightId: string;
  status: 'connecting' | 'connected' | 'breaking' | 'broken';
}

const EntanglementPuzzle = ({ puzzle, anecdotes = [], onCorrect, onIncorrect, disabled }: EntanglementPuzzleProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Map<string, string>>(new Map());
  const [activeLines, setActiveLines] = useState<ParticleLine[]>([]);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [unlockedAnecdotes, setUnlockedAnecdotes] = useState<string[]>([]);
  const [showAnecdote, setShowAnecdote] = useState<ScientistAnecdote | null>(null);
  const [roundKey, setRoundKey] = useState(0);
  const [allMatched, setAllMatched] = useState(false);

  const hasCalledOnCorrectRef = useRef(false);
  const leftItemsRef = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const rightItemsRef = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [, forceUpdate] = useState(0);

  const correctPairs = useMemo(() => {
    const pairs = new Map<string, string>();
    puzzle.targets.forEach((t) => {
      pairs.set(t.id, t.correctOptionId);
    });
    return pairs;
  }, [puzzle.targets]);

  const totalPairs = puzzle.targets.length;

  const entanglementStrength = useMemo(() => {
    if (correctCount + wrongCount === 0) return 0;
    const accuracy = correctCount / (correctCount + wrongCount);
    const progress = matchedPairs.size / totalPairs;
    return Math.round((accuracy * 0.6 + progress * 0.4) * 100);
  }, [correctCount, wrongCount, matchedPairs.size, totalPairs]);

  const hasConnectedLines = useMemo(() => {
    return activeLines.some((l) => l.status === 'connected');
  }, [activeLines]);

  useEffect(() => {
    if (!hasConnectedLines) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let running = true;
    const loop = () => {
      if (running) {
        forceUpdate((n) => (n + 1) % 1000000);
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hasConnectedLines]);

  const getLeftItemCenter = useCallback((id: string) => {
    const el = leftItemsRef.current.get(id);
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: elRect.right - containerRect.left,
      y: elRect.top + elRect.height / 2 - containerRect.top,
    };
  }, []);

  const getRightItemCenter = useCallback((id: string) => {
    const el = rightItemsRef.current.get(id);
    const container = containerRef.current;
    if (!el || !container) return { x: 0, y: 0 };
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: elRect.left - containerRect.left,
      y: elRect.top + elRect.height / 2 - containerRect.top,
    };
  }, []);

  const checkMatch = useCallback(
    (leftId: string, rightId: string) => {
      const correctRight = correctPairs.get(leftId);
      return correctRight === rightId;
    },
    [correctPairs]
  );

  const handleLeftClick = useCallback(
    (id: string) => {
      if (disabled || allMatched) return;
      if (matchedPairs.has(id)) return;
      if (wrongPair) return;

      setSelectedLeft(id);

      if (selectedRight) {
        const isCorrect = checkMatch(id, selectedRight);
        handleMatchResult(id, selectedRight, isCorrect);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, allMatched, matchedPairs, wrongPair, selectedRight, checkMatch]
  );

  const handleRightClick = useCallback(
    (id: string) => {
      if (disabled || allMatched) return;
      const isRightMatched = Array.from(matchedPairs.values()).includes(id);
      if (isRightMatched) return;
      if (wrongPair) return;

      setSelectedRight(id);

      if (selectedLeft) {
        const isCorrect = checkMatch(selectedLeft, id);
        handleMatchResult(selectedLeft, id, isCorrect);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, allMatched, matchedPairs, wrongPair, selectedLeft, checkMatch]
  );

  const handleMatchResult = useCallback(
    (leftId: string, rightId: string, isCorrect: boolean) => {
      const lineId = `${leftId}-${rightId}`;

      if (isCorrect) {
        setActiveLines((prev) => [
          ...prev,
          { id: lineId, leftId, rightId, status: 'connecting' },
        ]);

        setTimeout(() => {
          setActiveLines((prev) =>
            prev.map((l) =>
              l.id === lineId ? { ...l, status: 'connected' } : l
            )
          );

          setMatchedPairs((prev) => {
            const next = new Map(prev);
            next.set(leftId, rightId);

            const newCount = correctCount + 1;
            if (newCount % 3 === 0) {
              const anecdoteIndex = Math.floor(newCount / 3) - 1;
              if (anecdotes[anecdoteIndex]) {
                const anecdote = anecdotes[anecdoteIndex];
                setUnlockedAnecdotes((prev) =>
                  prev.includes(anecdote.id) ? prev : [...prev, anecdote.id]
                );
                setTimeout(() => {
                  setShowAnecdote(anecdote);
                }, 600);
              }
            }

            if (next.size >= totalPairs && !hasCalledOnCorrectRef.current) {
              hasCalledOnCorrectRef.current = true;
              setTimeout(() => {
                setAllMatched(true);
                onCorrect();
              }, 500);
            }

            return next;
          });

          setCorrectCount((c) => c + 1);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      } else {
        setWrongPair({ left: leftId, right: rightId });
        setActiveLines((prev) => [
          ...prev,
          { id: lineId, leftId, rightId, status: 'breaking' },
        ]);

        setTimeout(() => {
          setActiveLines((prev) =>
            prev.map((l) =>
              l.id === lineId ? { ...l, status: 'broken' } : l
            )
          );
        }, 400);

        setTimeout(() => {
          setWrongPair(null);
          setActiveLines((prev) => prev.filter((l) => l.id !== lineId));
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongCount((c) => c + 1);
          onIncorrect();
        }, 1000);
      }
    },
    [correctCount, totalPairs, anecdotes, onCorrect, onIncorrect]
  );

  const handleReset = useCallback(() => {
    hasCalledOnCorrectRef.current = false;
    setRoundKey((k) => k + 1);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs(new Map());
    setActiveLines([]);
    setWrongPair(null);
    setCorrectCount(0);
    setWrongCount(0);
    setUnlockedAnecdotes([]);
    setShowAnecdote(null);
    setAllMatched(false);
  }, []);

  const closeAnecdote = useCallback(() => {
    setShowAnecdote(null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      forceUpdate((n) => n + 1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPointOnQuadraticBezier = (
    t: number,
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  };

  const renderParticleLines = () => {
    const time = Date.now() / 1000;

    return activeLines.map((line) => {
      const leftPos = getLeftItemCenter(line.leftId);
      const rightPos = getRightItemCenter(line.rightId);

      if (leftPos.x === 0 || rightPos.x === 0) return null;

      const midX = (leftPos.x + rightPos.x) / 2;
      const midY = Math.min(leftPos.y, rightPos.y) - 40;
      const isCorrect = line.status === 'connecting' || line.status === 'connected';
      const isBreaking = line.status === 'breaking';
      const isConnected = line.status === 'connected';

      const pathD = `M ${leftPos.x} ${leftPos.y} Q ${midX} ${midY} ${rightPos.x} ${rightPos.y}`;
      const p0 = { x: leftPos.x, y: leftPos.y };
      const p1 = { x: midX, y: midY };
      const p2 = { x: rightPos.x, y: rightPos.y };

      const particlePositions = isConnected
        ? [0, 0.25, 0.5, 0.75].map((offset) => {
            const t = ((time * 0.3 + offset) % 1);
            return getPointOnQuadraticBezier(t, p0, p1, p2);
          })
        : [];

      const reverseParticlePositions = isConnected
        ? [0, 0.25, 0.5, 0.75].map((offset) => {
            const t = 1 - ((time * 0.3 + offset) % 1);
            return getPointOnQuadraticBezier(t, p0, p1, p2);
          })
        : [];

      return (
        <g key={line.id}>
          <motion.path
            d={pathD}
            fill="none"
            stroke={isCorrect ? 'rgba(157, 78, 221, 0.3)' : 'rgba(255, 46, 99, 0.3)'}
            strokeWidth={isCorrect ? 4 : 3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: line.status === 'broken' ? 0 : 1,
              opacity: line.status === 'broken' ? 0 : 1,
            }}
            transition={{ duration: isCorrect ? 0.6 : 0.3 }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke={isCorrect ? '#9d4edd' : '#ff2e63'}
            strokeWidth={2}
            strokeDasharray={isBreaking ? '8 8' : '0'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: line.status === 'broken' ? 0 : 1,
              opacity: line.status === 'broken' ? 0 : isCorrect ? 0.9 : 1,
            }}
            transition={{ duration: isCorrect ? 0.6 : 0.3 }}
            style={{
              filter: isCorrect
                ? 'drop-shadow(0 0 8px rgba(157, 78, 221, 0.8))'
                : 'drop-shadow(0 0 8px rgba(255, 46, 99, 0.8))',
            }}
          />

          {isConnected && particlePositions.map((pos, i) => (
            <circle
              key={`fwd-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={3}
              fill="#9d4edd"
              style={{ filter: 'drop-shadow(0 0 6px rgba(157, 78, 221, 1))' }}
            />
          ))}

          {isConnected && reverseParticlePositions.map((pos, i) => (
            <circle
              key={`rev-${i}`}
              cx={pos.x}
              cy={pos.y}
              r={3}
              fill="#00d4ff"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 1))' }}
            />
          ))}

          <motion.circle
            cx={leftPos.x}
            cy={leftPos.y}
            r={isCorrect ? 6 : 4}
            fill={isCorrect ? '#9d4edd' : '#ff2e63'}
            initial={{ scale: 0 }}
            animate={{
              scale: line.status === 'broken' ? 0 : [1, 1.2, 1],
              opacity: line.status === 'broken' ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{
              filter: isCorrect
                ? 'drop-shadow(0 0 10px rgba(157, 78, 221, 1))'
                : 'drop-shadow(0 0 10px rgba(255, 46, 99, 1))',
            }}
          />
          <motion.circle
            cx={rightPos.x}
            cy={rightPos.y}
            r={isCorrect ? 6 : 4}
            fill={isCorrect ? '#00d4ff' : '#ff2e63'}
            initial={{ scale: 0 }}
            animate={{
              scale: line.status === 'broken' ? 0 : [1, 1.2, 1],
              opacity: line.status === 'broken' ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{
              filter: isCorrect
                ? 'drop-shadow(0 0 10px rgba(0, 212, 255, 1))'
                : 'drop-shadow(0 0 10px rgba(255, 46, 99, 1))',
            }}
          />
        </g>
      );
    });
  };

  const isLeftMatched = (id: string) => matchedPairs.has(id);
  const isRightMatched = (id: string) =>
    Array.from(matchedPairs.values()).includes(id);

  return (
    <div key={roundKey} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-4"
      >
        <h3 className="text-2xl font-bold font-serif text-white mb-2">
          {puzzle.title}
        </h3>
        <p className="text-indigo-300/80 text-sm">{puzzle.instruction}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-2 text-sm"
      >
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-glow-purple" />
          <span className="text-indigo-300">已配对：</span>
          <span className="text-glow-purple font-mono font-bold">
            {matchedPairs.size} / {totalPairs}
          </span>
        </div>

        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-glow-cyan" />
          <span className="text-indigo-300">正确率：</span>
          <span className="text-glow-cyan font-mono font-bold">
            {correctCount + wrongCount > 0
              ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
              : 0}
            %
          </span>
        </div>

        {anecdotes.length > 0 && (
          <div className="glass-card-orange px-4 py-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-glow-orange" />
            <span className="text-indigo-300">轶事：</span>
            <span className="text-glow-orange font-mono font-bold">
              {unlockedAnecdotes.length} / {anecdotes.length}
            </span>
          </div>
        )}
      </motion.div>

      <div ref={containerRef} className="relative">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          {renderParticleLines()}
        </svg>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2.5"
          >
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glow-purple/10 border border-glow-purple/30">
                <span className="text-xs font-medium text-glow-purple">历史事件</span>
              </div>
            </div>
            {puzzle.targets.map((target, index) => {
              const isSelected = selectedLeft === target.id;
              const isMatched = isLeftMatched(target.id);
              const isWrong = wrongPair?.left === target.id;

              return (
                <motion.div
                  key={target.id}
                  ref={(el) => {
                    leftItemsRef.current.set(target.id, el);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: isWrong ? [-3, 3, -3, 3, 0] : 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.08,
                    duration: isWrong ? 0.4 : 0.3,
                  }}
                  onClick={() => handleLeftClick(target.id)}
                  whileHover={
                    !disabled && !isMatched && !wrongPair
                      ? { scale: 1.02, x: 4 }
                      : {}
                  }
                  whileTap={!disabled && !isMatched ? { scale: 0.98 } : {}}
                  className={`
                    relative p-3.5 rounded-xl border-2 text-left transition-all duration-200
                    ${isMatched
                      ? 'border-glow-green/50 bg-glow-green/10'
                      : isSelected
                      ? 'border-glow-purple bg-glow-purple/20'
                      : isWrong
                      ? 'border-glow-red bg-glow-red/10'
                      : 'border-indigo-500/30 bg-quantum-800/50 hover:border-glow-purple/60 hover:bg-quantum-700/50'
                    }
                    ${disabled || isMatched ? 'cursor-default' : 'cursor-pointer'}
                  `}
                  style={{
                    boxShadow: isMatched
                      ? '0 0 15px rgba(57, 255, 20, 0.25)'
                      : isSelected
                      ? '0 0 15px rgba(157, 78, 221, 0.4)'
                      : isWrong
                      ? '0 0 15px rgba(255, 46, 99, 0.3)'
                      : undefined,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                      ${isMatched
                        ? 'bg-glow-green'
                        : isSelected
                        ? 'bg-glow-purple'
                        : 'bg-indigo-500/40'
                      }
                    `}
                      style={{
                        boxShadow: isMatched
                          ? '0 0 8px rgba(57, 255, 20, 0.8)'
                          : isSelected
                          ? '0 0 8px rgba(157, 78, 221, 0.8)'
                          : undefined,
                      }}
                    />
                    <div>
                      <p className="font-medium text-white text-sm">
                        {target.label}
                      </p>
                    </div>
                  </div>
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-glow-green flex items-center justify-center"
                      style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)' }}
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2.5"
          >
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-glow-cyan/10 border border-glow-cyan/30">
                <span className="text-xs font-medium text-glow-cyan">现代概念</span>
              </div>
            </div>
            {puzzle.options.map((option, index) => {
              const isSelected = selectedRight === option.id;
              const isMatched = isRightMatched(option.id);
              const isWrong = wrongPair?.right === option.id;

              return (
                <motion.div
                  key={option.id}
                  ref={(el) => {
                    rightItemsRef.current.set(option.id, el);
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: 1,
                    x: isWrong ? [3, -3, 3, -3, 0] : 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.08,
                    duration: isWrong ? 0.4 : 0.3,
                  }}
                  onClick={() => handleRightClick(option.id)}
                  whileHover={
                    !disabled && !isMatched && !wrongPair
                      ? { scale: 1.02, x: -4 }
                      : {}
                  }
                  whileTap={!disabled && !isMatched ? { scale: 0.98 } : {}}
                  className={`
                    relative p-3.5 rounded-xl border-2 text-right transition-all duration-200
                    ${isMatched
                      ? 'border-glow-green/50 bg-glow-green/10'
                      : isSelected
                      ? 'border-glow-cyan bg-glow-cyan/20'
                      : isWrong
                      ? 'border-glow-red bg-glow-red/10'
                      : 'border-indigo-500/30 bg-quantum-800/50 hover:border-glow-cyan/60 hover:bg-quantum-700/50'
                    }
                    ${disabled || isMatched ? 'cursor-default' : 'cursor-pointer'}
                  `}
                  style={{
                    boxShadow: isMatched
                      ? '0 0 15px rgba(57, 255, 20, 0.25)'
                      : isSelected
                      ? '0 0 15px rgba(0, 212, 255, 0.4)'
                      : isWrong
                      ? '0 0 15px rgba(255, 46, 99, 0.3)'
                      : undefined,
                  }}
                >
                  <div className="flex items-start justify-end gap-3">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {option.label}
                      </p>
                      {option.value && option.value !== option.label && (
                        <p className="text-xs text-indigo-400/70 mt-0.5">
                          {option.value}
                        </p>
                      )}
                    </div>
                    <div
                      className={`
                      w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                      ${isMatched
                        ? 'bg-glow-green'
                        : isSelected
                        ? 'bg-glow-cyan'
                        : 'bg-indigo-500/40'
                      }
                    `}
                      style={{
                        boxShadow: isMatched
                          ? '0 0 8px rgba(57, 255, 20, 0.8)'
                          : isSelected
                          ? '0 0 8px rgba(0, 212, 255, 0.8)'
                          : undefined,
                      }}
                    />
                  </div>
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-glow-green flex items-center justify-center"
                      style={{ boxShadow: '0 0 10px rgba(57, 255, 20, 0.6)' }}
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-6"
      >
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-indigo-300/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-glow-purple" />
              纠缠强度
            </span>
            <span className="text-lg font-bold font-mono text-glow-purple">
              {entanglementStrength}%
            </span>
          </div>
          <div className="h-3 w-full bg-quantum-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${entanglementStrength}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                background:
                  entanglementStrength >= 70
                    ? 'linear-gradient(90deg, #9d4edd, #00d4ff)'
                    : entanglementStrength >= 40
                    ? 'linear-gradient(90deg, #9d4edd, #ff6b35)'
                    : 'linear-gradient(90deg, #ff2e63, #ff6b35)',
                boxShadow:
                  entanglementStrength >= 70
                    ? '0 0 15px rgba(157, 78, 221, 0.6)'
                    : '0 0 10px rgba(255, 107, 53, 0.4)',
              }}
            />
          </div>
          <p className="text-xs text-indigo-400/60 mt-2 text-center">
            {entanglementStrength >= 80
              ? '✨ 完美纠缠！历史与现代同频共振'
              : entanglementStrength >= 50
              ? '⚡ 纠缠稳定，继续保持！'
              : '💫 纠缠较弱，再试几次吧'}
          </p>
        </div>
      </motion.div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-center"
        >
          <div className="inline-block glass-card p-6">
            <p className="text-glow-green text-lg font-bold mb-3">
              ✨ 所有配对完成！量子纠缠完美达成！
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-glow-cyan/50 bg-glow-cyan/10 text-glow-cyan hover:bg-glow-cyan/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再来一次</span>
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showAnecdote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-quantum-950/80 backdrop-blur-sm"
            onClick={closeAnecdote}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card-purple p-6 md:p-8 max-w-lg w-full relative"
              style={{ boxShadow: '0 0 40px rgba(157, 78, 221, 0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeAnecdote}
                className="absolute top-4 right-4 text-indigo-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6 text-glow-orange" />
                </motion.div>
                <h4 className="text-xl font-bold font-serif text-white">
                  {showAnecdote.title}
                </h4>
              </div>

              <div className="mb-4">
                <span className="text-sm text-glow-purple font-medium">
                  {showAnecdote.scientist}
                  {showAnecdote.year && ` · ${showAnecdote.year}`}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-indigo-200/90 leading-relaxed text-sm"
              >
                <p>{showAnecdote.content}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-4 border-t border-indigo-500/20 text-center"
              >
                <p className="text-xs text-glow-orange">
                  🎉 恭喜解锁新轶事！
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntanglementPuzzle;
