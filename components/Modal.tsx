import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Code, Layers } from 'lucide-react';

interface ModalProps {
  project: Project | null;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-4xl bg-cyber-dark border border-cyber-primary shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col md:flex-row overflow-hidden rounded-lg animate-[pulse-fast_0.2s_ease-out]">
        
        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black">
          <img 
            src={project.thumbnail} 
            alt={project.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-3xl font-sans font-bold text-white shadow-black drop-shadow-lg">{project.name}</h2>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-cyber-primary mb-2">
               <Layers size={18} />
               <span className="font-mono text-sm tracking-wider">DESCRIPTION</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-cyber-primary mb-2">
               <Code size={18} />
               <span className="font-mono text-sm tracking-wider">TECH STACK</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 bg-cyber-slate/50 border border-cyber-slate text-cyber-primary text-xs font-mono rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-cyber-primary text-cyber-black font-bold py-3 px-6 hover:bg-white transition-colors rounded-sm"
              >
                <span>INITIATE SEQUENCE</span>
                <ExternalLink size={18} />
              </a>
            )}
            <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-500">
              <span>COORDS: {project.coordinates.x}, {project.coordinates.y}</span>
              <span>STATUS: {project.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};