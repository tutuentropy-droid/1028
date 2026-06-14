import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Lock } from 'lucide-react';
import type { Scientist } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface ScientistCardProps {
  scientist: Scientist;
  index: number;
}

const ScientistCard = ({ scientist, index }: ScientistCardProps) => {
  const navigate = useNavigate();
  const { isPuzzleCompleted, isRecordingUnlocked } = useGameStore();

  const isCompleted = isPuzzleCompleted(scientist.id);
  const isUnlocked = true;

  const getCardStyle = () => {
    switch (scientist.accentColor) {
      case 'cyan':
        return 'glass-card hover:border-glow-cyan/60 hover:shadow-glow-cyan';
      case 'purple':
        return 'glass-card-purple hover:border-glow-purple/60 hover:shadow-glow-purple';
      case 'orange':
        return 'glass-card-orange hover:border-glow-orange/60 hover:shadow-glow-orange';
      default:
        return 'glass-card hover:border-glow-cyan/60';
    }
  };

  const getTextGlow = () => {
    switch (scientist.accentColor) {
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

  const getAccentColorClass = () => {
    switch (scientist.accentColor) {
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

  const getAvatarGradient = () => {
    switch (scientist.accentColor) {
      case 'cyan':
        return 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40';
      case 'purple':
        return 'from-purple-500/20 to-pink-600/20 border-purple-500/40';
      case 'orange':
        return 'from-orange-500/20 to-amber-600/20 border-orange-500/40';
      default:
        return 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40';
    }
  };

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`/puzzle/${scientist.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, type: 'spring' }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        ${getCardStyle()}
        relative p-6 w-full max-w-sm cursor-pointer
        transition-all duration-300 ease-out
        ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isCompleted && (
        <div className="absolute -top-3 -right-3 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.5, type: 'spring' }}
            className="w-10 h-10 rounded-full bg-glow-green/20 border-2 border-glow-green flex items-center justify-center"
            style={{ boxShadow: '0 0 15px rgba(57, 255, 20, 0.5)' }}
          >
            <Check className="w-5 h-5 text-glow-green" />
          </motion.div>
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-quantum-900/80 backdrop-blur-sm rounded-2xl">
          <Lock className="w-10 h-10 text-gray-500" />
        </div>
      )}

      <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getAvatarGradient()} border-2 flex items-center justify-center overflow-hidden`}>
        <span className={`text-4xl font-serif ${getTextGlow()}`}>
          {scientist.nameEn.charAt(0)}
        </span>
      </div>

      <div className="text-center mb-3">
        <h3 className={`text-xl font-bold font-serif mb-1 ${getAccentColorClass()}`}>
          {scientist.name}
        </h3>
        <p className="text-sm text-indigo-300/70 font-mono">
          {scientist.nameEn}
        </p>
        <p className="text-xs text-indigo-400/60 mt-1">
          {scientist.years}
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-indigo-200/80 leading-relaxed">
          {scientist.contribution}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-indigo-500/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-indigo-400/70">核心概念</span>
          <span className={`font-medium ${getAccentColorClass()}`}>
            {scientist.concept.title}
          </span>
        </div>
        <div className="mt-2 text-center">
          <span className="formula-text text-sm text-indigo-300/80">
            {scientist.concept.formula}
          </span>
        </div>
      </div>

      {isRecordingUnlocked(scientist.id) && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs px-3 py-1 rounded-full bg-glow-purple/20 text-glow-purple border border-glow-purple/30">
            录音已解锁
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ScientistCard;
