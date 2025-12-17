import React, { useRef, useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Activity, AlertTriangle, Power } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  isActive: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, isActive }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on cursor position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation in degrees
    const maxRotation = 10;
    
    const rotateX = ((y - centerY) / centerY) * -maxRotation; // Invert Y for correct tilt
    const rotateY = ((x - centerX) / centerX) * maxRotation;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 }); // Reset to flat
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ONLINE': return 'text-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]';
      case 'MAINTENANCE': return 'text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]';
      default: return 'text-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ONLINE': return <Activity size={16} />;
      case 'MAINTENANCE': return <AlertTriangle size={16} />;
      default: return <Power size={16} />;
    }
  };

  return (
    <div className="perspective-1000">
      <div 
        ref={cardRef}
        onClick={() => onClick(project)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`
          relative cursor-pointer transition-all duration-200 transform-gpu preserve-3d
          ${isActive ? 'z-20' : 'z-10'}
          bg-cyber-dark/80 backdrop-blur-sm border 
          ${isActive || isHovered ? 'border-cyber-primary' : 'border-cyber-slate'}
          p-4 rounded-sm
        `}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isActive ? 'scale(1.05)' : 'scale(1)'}`,
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
          boxShadow: isHovered ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none'
        }}
      >
        {/* Holographic Glare */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-sm pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.3 : 0,
            transform: `translateZ(20px)`
          }}
        />

        {/* Content Layer - Lifted in Z-space */}
        <div style={{ transform: 'translateZ(30px)' }}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-2 font-mono text-xs tracking-wider">
            <span className="text-cyber-primary font-bold">ID: {project.id.toUpperCase()}</span>
            <div className={`flex items-center gap-2 px-2 py-0.5 border ${getStatusColor(project.status)} rounded-full text-[10px]`}>
              {getStatusIcon(project.status)}
              <span>{project.status}</span>
            </div>
          </div>

          {/* Title with Glitch on Hover */}
          <h3 className={`font-sans font-bold text-xl text-white mb-2 transition-colors ${isHovered ? 'text-cyber-primary animate-glitch' : ''}`}>
            {project.name}
          </h3>

          {/* Tech Stack Mini Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 3).map(tech => (
              <span key={tech} className="text-[10px] bg-cyber-slate text-gray-300 px-1 rounded">
                {tech}
              </span>
            ))}
          </div>

          {/* Image / Thumbnail placeholder */}
          <div className="w-full h-32 bg-black/50 overflow-hidden relative border border-cyber-slate/50 mb-4 group-hover:border-cyber-primary/50 transition-colors">
            <img 
              src={project.thumbnail} 
              alt={project.name}
              className="w-full h-full object-cover opacity-60 transition-all duration-300 grayscale group-hover:grayscale-0"
              style={{
                filter: isHovered ? 'grayscale(0%) contrast(1.2)' : 'grayscale(100%) contrast(1)'
              }}
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            
            {/* Scanline overlay on image */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
          </div>

          {/* Action Line */}
          <div className="flex items-center justify-between text-cyber-primary text-xs font-mono">
            <span className={isHovered ? 'underline decoration-cyber-primary/50 underline-offset-4' : ''}>
              &gt;&gt; ACCESS_MODULE
            </span>
            <ExternalLink size={14} className={isHovered ? 'animate-pulse' : ''} />
          </div>
        </div>

        {/* Corner Accents - Deep Layer */}
        <div style={{ transform: 'translateZ(10px)' }}>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-primary opacity-50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-primary opacity-50" />
        </div>
      </div>
    </div>
  );
};