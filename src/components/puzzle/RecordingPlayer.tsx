import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Lock } from 'lucide-react';
import type { Recording } from '@/types';

interface RecordingPlayerProps {
  recording: Recording;
  isUnlocked: boolean;
  accentColor?: 'cyan' | 'purple' | 'orange' | 'green';
}

const RecordingPlayer = ({ recording, isUnlocked, accentColor = 'cyan' }: RecordingPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressInterval = useRef<number | null>(null);

  const getAccentClass = () => {
    switch (accentColor) {
      case 'cyan':
        return 'text-glow-cyan';
      case 'purple':
        return 'text-glow-purple';
      case 'orange':
        return 'text-glow-orange';
      case 'green':
        return 'text-glow-green';
      default:
        return 'text-glow-cyan';
    }
  };

  const getBorderClass = () => {
    switch (accentColor) {
      case 'cyan':
        return 'border-glow-cyan/40 hover:border-glow-cyan/70';
      case 'purple':
        return 'border-glow-purple/40 hover:border-glow-purple/70';
      case 'orange':
        return 'border-glow-orange/40 hover:border-glow-orange/70';
      case 'green':
        return 'border-glow-green/40 hover:border-glow-green/70';
      default:
        return 'border-glow-cyan/40 hover:border-glow-cyan/70';
    }
  };

  const getBgClass = () => {
    switch (accentColor) {
      case 'cyan':
        return 'bg-glow-cyan';
      case 'purple':
        return 'bg-glow-purple';
      case 'orange':
        return 'bg-glow-orange';
      case 'green':
        return 'bg-glow-green';
      default:
        return 'bg-glow-cyan';
    }
  };

  const characters = recording.text.split('');

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const speak = () => {
    if (!window.speechSynthesis || !isUnlocked) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      startProgressTracking();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(recording.text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      startProgressTracking();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setHighlightedIndex(characters.length);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const estimatedDuration = characters.length * 0.15 * 1000;
    const startTime = Date.now() - (progress / 100) * estimatedDuration;

    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / estimatedDuration) * 100, 100);
      setProgress(newProgress);
      setHighlightedIndex(Math.floor((newProgress / 100) * characters.length));
    }, 50);
  };

  const restart = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setProgress(0);
    setHighlightedIndex(0);
    setIsPlaying(false);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        glass-card p-6 transition-all duration-300
        ${isUnlocked ? getBorderClass() : 'opacity-60'}
      `}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-full bg-quantum-700/50 border-2 ${isUnlocked ? getBorderClass() : 'border-gray-600'} flex items-center justify-center`}>
            {isUnlocked ? (
              <Volume2 className={`w-6 h-6 ${getAccentClass()}`} />
            ) : (
              <Lock className="w-6 h-6 text-gray-500" />
            )}
          </div>
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-glow-green animate-pulse" />
          )}
        </div>

        <div className="flex-1">
          <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
            {recording.title}
          </h4>
          <p className="text-sm text-indigo-400/60">
            {recording.speaker} · {recording.year}
          </p>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-2">
            <button
              onClick={restart}
              className="w-10 h-10 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:text-white hover:border-indigo-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={speak}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-glow-cyan/20 text-glow-cyan border border-glow-cyan/50' 
                  : `bg-quantum-700/50 ${getAccentClass()} border-2 ${getBorderClass()}`
              }`}
              style={!isPlaying ? { boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)' } : {}}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mb-4">
          <div className="flex items-end gap-0.5 h-8 mb-2 justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying && (progress / 100) * 20 > i
                    ? getBgClass()
                    : 'bg-indigo-700/50'
                }`}
                style={{
                  height: isPlaying ? `${30 + Math.sin(i * 0.5 + Date.now() * 0.001) * 20}px` : '12px',
                }}
              />
            ))}
          </div>
          <div className="w-full h-1 bg-quantum-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className={`h-full ${getBgClass()} rounded-full`}
            />
          </div>
        </div>
      )}

      <div className={`p-4 rounded-lg ${isUnlocked ? 'bg-quantum-800/50' : 'bg-gray-800/30'}`}>
        {isUnlocked ? (
          <p className="text-sm leading-relaxed text-indigo-200/80 italic">
            {characters.map((char, i) => (
              <span
                key={i}
                className={`transition-colors duration-75 ${
                  i < highlightedIndex ? getAccentClass() : ''
                }`}
              >
                {char}
              </span>
            ))}
          </p>
        ) : (
          <div className="text-center py-4">
            <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              完成谜题后解锁历史录音
            </p>
          </div>
        )}
      </div>

      {!isUnlocked && (
        <p className="text-center text-xs text-indigo-500/50 mt-3">
          🔒 完成量子谜题以解锁
        </p>
      )}
    </motion.div>
  );
};

export default RecordingPlayer;
