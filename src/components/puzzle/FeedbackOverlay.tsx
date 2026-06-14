import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';

interface FeedbackOverlayProps {
  type: 'correct' | 'incorrect' | null;
  message?: string;
  onClose?: () => void;
}

const FeedbackOverlay = ({ type, message, onClose }: FeedbackOverlayProps) => {
  if (!type) return null;

  const isCorrect = type === 'correct';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`
            relative p-8 rounded-2xl text-center
            ${isCorrect 
              ? 'bg-gradient-to-br from-glow-green/20 to-emerald-900/30 border-2 border-glow-green/50' 
              : 'bg-gradient-to-br from-glow-red/20 to-rose-900/30 border-2 border-glow-red/50'
            }
            backdrop-blur-xl
          `}
          style={{
            boxShadow: isCorrect
              ? '0 0 60px rgba(57, 255, 20, 0.3), 0 0 120px rgba(57, 255, 20, 0.1)'
              : '0 0 60px rgba(255, 46, 99, 0.3), 0 0 120px rgba(255, 46, 99, 0.1)',
          }}
        >
          {isCorrect && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * Math.PI) / 4) * 80,
                    y: Math.sin((i * Math.PI) / 4) * 80,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: 'easeOut',
                  }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-glow-green"
                  style={{
                    boxShadow: '0 0 10px rgba(57, 255, 20, 0.8)',
                  }}
                />
              ))}
            </>
          )}

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
              className="mx-auto mb-4"
            >
              {isCorrect ? (
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-glow-green" />
                  <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1" />
                </div>
              ) : (
                <XCircle className="w-20 h-20 text-glow-red" />
              )}
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-2xl font-bold font-serif mb-2 ${
                isCorrect ? 'text-glow-green' : 'text-glow-red'
              }`}
              style={{
                textShadow: isCorrect
                  ? '0 0 20px rgba(57, 255, 20, 0.5)'
                  : '0 0 20px rgba(255, 46, 99, 0.5)',
              }}
            >
              {isCorrect ? '能级跃迁！' : '能量耗散...'}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-indigo-200/80 max-w-xs"
            >
              {message || (isCorrect 
                ? '恭喜！你成功提升了一个量子能级！' 
                : '别灰心，再试一次吧！')}
            </motion.p>

            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-sm text-glow-cyan"
              >
                ✨ 历史录音已解锁 ✨
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackOverlay;
