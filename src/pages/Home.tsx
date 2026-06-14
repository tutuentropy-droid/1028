import { motion } from 'framer-motion';
import { Atom, Zap, BookOpen } from 'lucide-react';
import ScientistCard from '@/components/home/ScientistCard';
import { scientists } from '@/data/scientists';
import { useGameStore } from '@/store/gameStore';

const Home = () => {
  const { completedPuzzles, resetAll } = useGameStore();

  const progress = (completedPuzzles.length / scientists.length) * 100;

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Atom className="w-10 h-10 text-glow-cyan" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white">
              量子力学史话
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Atom className="w-10 h-10 text-glow-purple" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-indigo-300/80 max-w-2xl mx-auto leading-relaxed"
          >
            穿越时空，与三位量子力学巨人对话。解开量子谜题，聆听历史回响，
            探索那个改写物理学的黄金年代。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-3 glass-card px-6 py-3"
          >
            <Zap className="w-5 h-5 text-glow-cyan" />
            <span className="text-indigo-200">
              学习进度：
            </span>
            <span className="text-glow-cyan font-bold">
              {completedPuzzles.length} / {scientists.length}
            </span>
            <div className="w-32 h-2 bg-quantum-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-glow-cyan to-glow-purple rounded-full"
                style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {scientists.map((scientist, index) => (
            <ScientistCard
              key={scientist.id}
              scientist={scientist}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-glow-purple" />
              <h2 className="text-2xl font-bold font-serif text-white">
                如何开始你的量子之旅
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-quantum-800/50">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-glow-cyan/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-glow-cyan">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">选择科学家</h3>
                <p className="text-sm text-indigo-300/70">
                  点击任意科学家卡片，进入对应的量子概念学习
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-quantum-800/50">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-glow-purple/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-glow-purple">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">解量子谜题</h3>
                <p className="text-sm text-indigo-300/70">
                  通过拖拽互动完成谜题，答对可提升量子能级
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-quantum-800/50">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-glow-orange/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-glow-orange">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">聆听历史</h3>
                <p className="text-sm text-indigo-300/70">
                  解锁历史录音，感受那个伟大时代的科学精神
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {completedPuzzles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 text-center"
          >
            <button
              onClick={resetAll}
              className="text-sm text-indigo-400/60 hover:text-indigo-300 transition-colors underline"
            >
              重置所有进度
            </button>
          </motion.div>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center text-sm text-indigo-500/60"
        >
          <p>✨ 每一个正确答案，都是一次能级跃迁</p>
          <p className="mt-2">· 量子力学史话学习系统 ·</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
