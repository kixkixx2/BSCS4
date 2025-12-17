import React, { useState, useEffect } from 'react';
import { PROJECTS } from './constants';
import { Project } from './types';
import { ProjectCard } from './components/ProjectCard';
import { AIChat } from './components/AIChat';
import { Modal } from './components/Modal';
import { BootSequence } from './components/BootSequence';
import { Hexagon, Globe, Cpu, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [booting, setBooting] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-primary selection:text-cyber-black overflow-hidden relative">
      
      {/* Boot Sequence Overlay */}
      {booting && <BootSequence onComplete={() => setBooting(false)} />}

      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 animate-scan"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'top center',
        }}
      />
      
      {/* Mouse Spotlight/Vignette */}
      {!booting && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.07), transparent 40%)`
          }}
        />
      )}
      
      {/* Main HUD Layout */}
      <div className={`relative z-10 flex flex-col min-h-screen transition-opacity duration-1000 ${booting ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Top Bar / HUD Header */}
        <header className="border-b border-cyber-primary/20 bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Hexagon className="text-cyber-primary animate-spin-slow" size={32} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-sans font-bold tracking-widest text-white">
                  NEXCS<span className="text-cyber-primary"> 4</span>
                </h1>
                <div className="text-[10px] font-mono text-gray-400 tracking-[0.2em] -mt-1 flex items-center gap-2">
                  <span>SYSTEM VERSION 2.5</span>
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 font-mono text-xs text-cyber-primary/70">
              <div className="flex items-center gap-2 group cursor-help">
                <Globe size={14} className="group-hover:text-white transition-colors"/>
                <span className="group-hover:text-white transition-colors">NET: CONNECTED</span>
              </div>
              <div className="flex items-center gap-2 group cursor-help">
                <Cpu size={14} className="group-hover:text-white transition-colors"/>
                <span className="group-hover:text-white transition-colors">CORE: ONLINE</span>
              </div>
              <div className="flex items-center gap-2 group cursor-help">
                <Wifi size={14} className="group-hover:text-white transition-colors"/>
                <span className="group-hover:text-white transition-colors">LATENCY: 12ms</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 flex flex-col overflow-y-auto">
          
          <div className="mb-12 text-center relative group">
            <h2 className="text-4xl md:text-6xl font-sans font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-primary to-white group-hover:animate-glitch cursor-default">
              SELECT MODULE
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm border-l-2 border-cyber-primary/30 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
              Welcome to the central command hub. Browse the available algorithmic modules below. 
              Initiate connection to view details.
            </p>
            <div className="w-24 h-1 bg-cyber-primary mx-auto mt-8 shadow-[0_0_15px_#00f0ff] group-hover:w-48 transition-all duration-500" />
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
             {PROJECTS.map((project, idx) => (
               <div key={project.id} style={{ animationDelay: `${idx * 150}ms` }} className="animate-[pulse-fast_3s_ease-in-out_infinite_paused] hover:animate-paused">
                  <ProjectCard 
                    project={project} 
                    onClick={setSelectedProject}
                    isActive={selectedProject?.id === project.id}
                  />
               </div>
             ))}
          </div>

        </main>

        {/* Footer HUD */}
        <footer className="border-t border-cyber-primary/20 bg-cyber-dark/50 py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-500">
            <div>
              &copy; 2025 - 2026 BSCS 4 . ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
               <span className="animate-pulse text-green-500">● SECURE CONNECTION</span>
               <span>ENCRYPTED_AES_256</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Overlays */}
      {!booting && <AIChat />}
      <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
      
      {/* Scanline Effect - Always Top */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-10 mix-blend-overlay" />
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[radial-gradient(circle_at_center,transparent_50%,black_150%)] opacity-50" />

    </div>
  );
};

export default App;