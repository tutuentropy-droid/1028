import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Puzzle from '@/pages/Puzzle';
import ParticleBackground from '@/components/layout/ParticleBackground';
import EnergyLevelBar from '@/components/layout/EnergyLevelBar';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full bg-quantum-950">
        <div className="starfield" />
        <ParticleBackground />
        <EnergyLevelBar />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puzzle/:scientistId" element={<Puzzle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
