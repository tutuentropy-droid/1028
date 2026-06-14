import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Move, Eye, AlertTriangle, CheckCircle, XCircle, Gauge } from 'lucide-react';
import type { Puzzle } from '@/types';

interface HeisenbergPuzzleProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
  disabled?: boolean;
}

interface Question {
  id: string;
  question: string;
  scenario: string;
  options: { id: string; label: string; value: string }[];
  correctId: string;
  uncertaintyImpact: { position: number; momentum: number };
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: '如果我们用极短波长的光子（伽马射线）去精确测量一个电子的位置，会发生什么？',
    scenario: '位置测量精度 Δx → 极小',
    options: [
      { id: 'a', label: '位置和动量都能同时精确测得', value: '精确测定两者' },
      { id: 'b', label: '光子会给电子巨大动量冲击，导致动量不确定度 Δp 急剧增大', value: '动量不确定度增大' },
      { id: 'c', label: '电子会被光子湮灭，无法测量', value: '电子湮灭' },
      { id: 'd', label: '测量结果不受光子波长影响', value: '波长无影响' },
    ],
    correctId: 'b',
    uncertaintyImpact: { position: -35, momentum: 45 },
  },
  {
    id: 'q2',
    question: '在量子力学中，为什么我们无法同时精确知道一个粒子的位置和动量？',
    scenario: '同时测量 Δx 和 Δp',
    options: [
      { id: 'a', label: '因为我们的测量仪器还不够精密', value: '技术限制' },
      { id: 'b', label: '因为粒子太小，肉眼看不见', value: '尺度问题' },
      { id: 'c', label: '因为位置和动量这两个物理量在量子力学中本质上就是不相容的', value: '不相容可观测量' },
      { id: 'd', label: '因为测量时粒子会逃跑', value: '粒子逃跑' },
    ],
    correctId: 'c',
    uncertaintyImpact: { position: 20, momentum: 20 },
  },
  {
    id: 'q3',
    question: '根据不确定性原理 Δx·Δp ≥ ħ/2，如果 Δx 趋近于零（完全确定位置），Δp 会怎样？',
    scenario: '数学极限分析',
    options: [
      { id: 'a', label: 'Δp 也趋近于零', value: '两者都为零' },
      { id: 'b', label: 'Δp 趋近于无穷大', value: '动量完全不确定' },
      { id: 'c', label: 'Δp 保持不变', value: '动量不变' },
      { id: 'd', label: 'Δp 等于 ħ/2', value: '精确等于下限' },
    ],
    correctId: 'b',
    uncertaintyImpact: { position: -50, momentum: 55 },
  },
  {
    id: 'q4',
    question: '以下哪种现象是不确定性原理的直接推论？',
    scenario: '物理结果应用',
    options: [
      { id: 'a', label: '原子的基态能量不可能为零', value: '零点能存在' },
      { id: 'b', label: '光在真空中沿直线传播', value: '光的直线传播' },
      { id: 'c', label: '苹果从树上掉下来', value: '万有引力' },
      { id: 'd', label: '电流通过导线会发热', value: '焦耳热效应' },
    ],
    correctId: 'a',
    uncertaintyImpact: { position: 15, momentum: 15 },
  },
  {
    id: 'q5',
    question: '海森堡不确定性原理和观察者效应有什么根本区别？',
    scenario: '概念辨析',
    options: [
      { id: 'a', label: '两者完全相同，只是叫法不同', value: '相同概念' },
      { id: 'b', label: '不确定性原理是测量仪器的精度限制，观察者效应是人的主观影响', value: '仪器 vs 主观' },
      { id: 'c', label: '不确定性原理是量子系统的内禀属性，与测量无关；观察者效应是测量对系统的扰动', value: '内禀属性 vs 测量扰动' },
      { id: 'd', label: '不确定性原理只适用于宏观物体', value: '宏观适用' },
    ],
    correctId: 'c',
    uncertaintyImpact: { position: 25, momentum: 25 },
  },
];

const HeisenbergPuzzle = ({ puzzle, onCorrect, onIncorrect, disabled }: HeisenbergPuzzleProps) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [positionUncertainty, setPositionUncertainty] = useState(50);
  const [momentumUncertainty, setMomentumUncertainty] = useState(50);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const hasCalledOnCorrectRef = useRef(false);

  const currentQuestion = QUESTIONS[currentQuestionIdx];
  const totalQuestions = QUESTIONS.length;
  const progress = useMemo(() => ((currentQuestionIdx) / totalQuestions) * 100, [currentQuestionIdx, totalQuestions]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (disabled || showResult || hasFinished) return;
      setSelectedOption(optionId);
    },
    [disabled, showResult, hasFinished]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedOption || showResult) return;

    const correct = selectedOption === currentQuestion.correctId;
    setIsCorrect(correct);
    setShowResult(true);
    setIsMeasuring(true);

    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((c) => c + 1);
    }

    const impact = currentQuestion.uncertaintyImpact;
    setPositionUncertainty((prev) => {
      const next = correct ? prev + impact.position : prev - impact.position * 0.5;
      return Math.max(5, Math.min(95, next));
    });
    setMomentumUncertainty((prev) => {
      const next = correct ? prev + impact.momentum : prev + impact.momentum * 0.5;
      return Math.max(5, Math.min(95, next));
    });

    setTimeout(() => {
      setIsMeasuring(false);
    }, 1200);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);

      if (currentQuestionIdx + 1 >= totalQuestions) {
        setHasFinished(true);
        const accuracy = correctCount + (correct ? 1 : 0) / totalQuestions;
        if (accuracy >= 0.6 && !hasCalledOnCorrectRef.current) {
          hasCalledOnCorrectRef.current = true;
          setTimeout(() => onCorrect(), 1000);
        } else if (!hasCalledOnCorrectRef.current) {
          onIncorrect();
        }
      } else {
        setCurrentQuestionIdx((i) => i + 1);
      }
    }, correct ? 2000 : 1600);
  }, [selectedOption, showResult, currentQuestion, currentQuestionIdx, totalQuestions, correctCount, onCorrect, onIncorrect]);

  const handleReset = useCallback(() => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setWrongCount(0);
    setPositionUncertainty(50);
    setMomentumUncertainty(50);
    setIsMeasuring(false);
    setHasFinished(false);
    hasCalledOnCorrectRef.current = false;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showResult || hasFinished || disabled) return;
      const keyMap: { [k: string]: number } = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const idx = keyMap[e.key];
      if (idx !== undefined && idx < currentQuestion.options.length) {
        handleSelectOption(currentQuestion.options[idx].id);
      }
      if (e.key === 'Enter' && selectedOption) {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showResult, hasFinished, disabled, currentQuestion, selectedOption, handleSelectOption, handleSubmit]);

  const getOptionClass = (optId: string) => {
    const isSelected = selectedOption === optId;
    const isCorrectOpt = optId === currentQuestion.correctId;

    if (showResult) {
      if (isCorrectOpt) return 'border-glow-green/60 bg-glow-green/15';
      if (isSelected && !isCorrectOpt) return 'border-glow-red/60 bg-glow-red/15 shake';
      return 'border-indigo-500/20 bg-quantum-800/30 opacity-50';
    }

    return isSelected
      ? 'border-glow-purple bg-glow-purple/20'
      : 'border-indigo-500/30 bg-quantum-800/50 hover:border-glow-cyan/50 hover:bg-quantum-700/50';
  };

  const productUncertainty = useMemo(() => {
    return (positionUncertainty * momentumUncertainty) / 100;
  }, [positionUncertainty, momentumUncertainty]);

  const hBar = 50;
  const violatesPrinciple = productUncertainty < hBar * 0.9;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold font-serif text-white mb-2">
          {puzzle.title}
        </h3>
        <p className="text-indigo-300/80 text-sm">{puzzle.instruction}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-glow-green" />
              <span className="text-indigo-300">正确：<span className="text-glow-green font-bold font-mono">{correctCount}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-glow-red" />
              <span className="text-indigo-300">错误：<span className="text-glow-red font-bold font-mono">{wrongCount}</span></span>
            </div>
          </div>
          <div className="text-xs text-indigo-300">
            进度：<span className="font-mono font-bold text-glow-cyan">{currentQuestionIdx + 1} / {totalQuestions}</span>
          </div>
        </div>
        <div className="h-2 w-full bg-quantum-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'linear-gradient(90deg, #9d4edd, #00d4ff)',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
            }}
          />
        </div>
      </motion.div>

      <motion.div
        key={currentQuestionIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-5 md:p-6"
      >
        <div className="mb-5">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-glow-orange mt-0.5 flex-shrink-0" />
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-glow-orange/15 text-glow-orange text-[11px] font-medium mb-2">
                {currentQuestion.scenario}
              </span>
              <p className="font-medium text-white leading-relaxed">{currentQuestion.question}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          {currentQuestion.options.map((opt, idx) => {
            const isCorrectOpt = opt.id === currentQuestion.correctId;
            const showIcon = showResult && (isCorrectOpt || selectedOption === opt.id);

            return (
              <motion.div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                whileHover={!showResult && !hasFinished && !disabled ? { scale: 1.01, x: 3 } : {}}
                whileTap={!showResult && !hasFinished && !disabled ? { scale: 0.99 } : {}}
                className={`
                  relative p-3.5 rounded-xl border-2 text-left transition-all duration-200
                  ${getOptionClass(opt.id)}
                  ${showResult || hasFinished || disabled ? 'cursor-default' : 'cursor-pointer'}
                `}
                style={{
                  boxShadow: showResult
                    ? isCorrectOpt
                      ? '0 0 18px rgba(57, 255, 20, 0.3)'
                      : selectedOption === opt.id && !isCorrectOpt
                      ? '0 0 18px rgba(255, 46, 99, 0.3)'
                      : undefined
                    : selectedOption === opt.id
                    ? '0 0 15px rgba(157, 78, 221, 0.4)'
                    : undefined,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{opt.label}</p>
                    <p className="text-xs text-indigo-400/60 mt-0.5">{opt.value}</p>
                  </div>
                  {showIcon && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      {isCorrectOpt ? (
                        <CheckCircle className="w-6 h-6 text-glow-green flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-glow-red flex-shrink-0" />
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {!showResult && !hasFinished && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleSubmit}
            disabled={!selectedOption || disabled}
            className={`
              w-full py-3 rounded-xl font-bold text-sm transition-all
              flex items-center justify-center gap-2
              ${selectedOption && !disabled
                ? 'bg-gradient-to-r from-glow-purple to-glow-cyan text-white hover:shadow-lg hover:shadow-glow-purple/30 cursor-pointer'
                : 'bg-quantum-800 text-indigo-500 cursor-not-allowed border border-indigo-500/20'
              }
            `}
          >
            <Eye className="w-4 h-4" />
            <span>{selectedOption ? '提交观测结果' : '请选择一个答案'}</span>
          </motion.button>
        )}

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`mt-4 p-4 rounded-xl border ${
                isCorrect
                  ? 'border-glow-green/40 bg-glow-green/10'
                  : 'border-glow-red/40 bg-glow-red/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-glow-green" />
                ) : (
                  <XCircle className="w-5 h-5 text-glow-red" />
                )}
                <span className={`font-bold ${isCorrect ? 'text-glow-green' : 'text-glow-red'}`}>
                  {isCorrect ? '观测结果正确！' : '观测结果错误...'}
                </span>
              </div>
              <p className="text-xs text-indigo-300/80 leading-relaxed">
                {isCorrect
                  ? '完美！你的理解正在深刻影响测量的不确定性关系。注意观察下方的不确定度变化。'
                  : '别灰心，不确定性原理本身就非常反直觉。重新思考一下量子测量的本质吧。'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-indigo-300/80 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-glow-purple" />
            实时不确定度监测
          </span>
          <span
            className={`text-sm font-mono font-bold px-2.5 py-1 rounded-full ${
              violatesPrinciple
                ? 'bg-glow-red/15 text-glow-red border border-glow-red/30'
                : 'bg-glow-green/15 text-glow-green border border-glow-green/30'
            }`}
          >
            Δx·Δp = {productUncertainty.toFixed(1)} {violatesPrinciple ? '⚠️' : '≥ ħ/2'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-indigo-400 flex items-center gap-1">
                <Target className="w-3 h-3" /> 位置不确定度 Δx
              </span>
              <span className="text-glow-purple font-mono font-bold">{Math.round(positionUncertainty)}%</span>
            </div>
            <div className="h-28 w-full bg-quantum-800 rounded-lg overflow-hidden relative">
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                animate={{
                  height: `${positionUncertainty}%`,
                  filter: isMeasuring ? 'brightness(1.5)' : 'brightness(1)',
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  background: 'linear-gradient(to top, #9d4edd, #c77dff, #e0aaff)',
                  boxShadow: '0 0 15px rgba(157, 78, 221, 0.5)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/60 font-mono font-bold">Δx</span>
              </div>
              <motion.div
                className="absolute left-0 right-0 border-t border-dashed border-glow-green/50"
                style={{ bottom: '50%' }}
              >
                <span className="absolute -left-1 -top-2.5 text-[9px] text-glow-green/70">下限</span>
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-indigo-400 flex items-center gap-1">
                <Move className="w-3 h-3" /> 动量不确定度 Δp
              </span>
              <span className="text-glow-cyan font-mono font-bold">{Math.round(momentumUncertainty)}%</span>
            </div>
            <div className="h-28 w-full bg-quantum-800 rounded-lg overflow-hidden relative">
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                animate={{
                  height: `${momentumUncertainty}%`,
                  filter: isMeasuring ? 'brightness(1.5)' : 'brightness(1)',
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  background: 'linear-gradient(to top, #00d4ff, #72efdd, #b8f3e3)',
                  boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/60 font-mono font-bold">Δp</span>
              </div>
              <motion.div
                className="absolute left-0 right-0 border-t border-dashed border-glow-green/50"
                style={{ bottom: '50%' }}
              >
                <span className="absolute -right-1 -top-2.5 text-[9px] text-glow-green/70">下限</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-indigo-500/20">
          <div className="text-center mb-2">
            <span className="text-xs text-indigo-400/70 font-mono">Δx · Δp ≥ ħ / 2</span>
          </div>
          <div className="h-2 w-full bg-quantum-800 rounded-full overflow-hidden flex">
            <motion.div
              className="h-full transition-all duration-500"
              animate={{ width: `${positionUncertainty}%` }}
              style={{ background: 'linear-gradient(90deg, #9d4edd, #c77dff)' }}
            />
            <div className="w-px h-full bg-white/30 flex-shrink-0" />
            <motion.div
              className="h-full flex-1 transition-all duration-500"
              animate={{ width: `${momentumUncertainty}%` }}
              style={{ background: 'linear-gradient(90deg, #72efdd, #00d4ff)' }}
            />
          </div>
          <p className="text-[11px] text-indigo-400/60 mt-2 text-center leading-relaxed">
            {violatesPrinciple
              ? '⚠️ 不确定度过低，正在逼近量子极限...'
              : productUncertainty > 85
              ? '⚡ 高度不确定！量子涨落剧烈'
              : '✨ 符合不确定性原理，两者互为制衡'}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {hasFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center"
          >
            <div className="inline-block glass-card p-6" style={{
              boxShadow: correctCount >= 3
                ? '0 0 40px rgba(57, 255, 20, 0.25)'
                : '0 0 30px rgba(255, 107, 53, 0.2)',
              borderColor: correctCount >= 3 ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 107, 53, 0.3)',
            }}>
              <p className={`text-lg font-bold mb-2 ${
                correctCount >= 3 ? 'text-glow-green' : 'text-glow-orange'
              }`}>
                {correctCount >= 3
                  ? '🎉 你已掌握不确定性原理的精髓！'
                  : '💫 再来一次，量子世界需要更多练习'}
              </p>
              <p className="text-sm text-indigo-300/80 mb-4">
                答对 {correctCount} / {totalQuestions} 题
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-glow-cyan/50 bg-glow-cyan/10 text-glow-cyan hover:bg-glow-cyan/20 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>重新测量</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeisenbergPuzzle;
