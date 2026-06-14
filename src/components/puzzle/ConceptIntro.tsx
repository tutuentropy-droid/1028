import { motion } from 'framer-motion';
import { BookOpen, Lightbulb } from 'lucide-react';
import type { ScientistConcept } from '@/types';

interface ConceptIntroProps {
  concept: ScientistConcept;
  accentColor?: 'cyan' | 'purple' | 'orange';
}

const ConceptIntro = ({ concept, accentColor = 'cyan' }: ConceptIntroProps) => {
  const getAccentClass = () => {
    switch (accentColor) {
      case 'cyan':
        return 'text-glow-cyan';
      case 'purple':
        return 'text-glow-purple';
      case 'orange':
        return 'text-glow-orange';
      default:
        return 'text-glow-cyan';
    }
  };

  const getBorderClass = () => {
    switch (accentColor) {
      case 'cyan':
        return 'glass-card';
      case 'purple':
        return 'glass-card-purple';
      case 'orange':
        return 'glass-card-orange';
      default:
        return 'glass-card';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${getBorderClass()} p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className={`w-6 h-6 ${getAccentClass()}`} />
        <h3 className="text-xl font-bold font-serif text-white">
          {concept.title}
        </h3>
      </div>

      <div className="mb-6 p-6 rounded-xl bg-quantum-900/60 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`text-4xl md:text-5xl font-bold formula-text ${getAccentClass()}`}
          style={{ textShadow: `0 0 20px currentColor` }}
        >
          {concept.formula}
        </motion.div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={`w-4 h-4 ${getAccentClass()}`} />
            <span className="text-sm font-medium text-indigo-200">概念解释</span>
          </div>
          <p className="text-sm text-indigo-300/80 leading-relaxed">
            {concept.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-200">📜 历史背景</span>
          </div>
          <p className="text-sm text-indigo-400/70 leading-relaxed">
            {concept.history}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConceptIntro;
