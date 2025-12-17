import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const sequence = [
    "INITIALIZING NEXCS 4 KERNEL V2.5...",
    "CHECKING MEMORY INTEGRITY... OK",
    "LOADING NEURAL INTERFACE... OK",
    "ESTABLISHING SECURE CONNECTION...",
    "MOUNTING PROJECT MODULES...",
    "CALIBRATING VISUAL SENSORS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let delay = 0;
    
    sequence.forEach((line, index) => {
      delay += Math.random() * 500 + 200; // Random delay between lines
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        
        // Play sound effect hook here if needed
        
        if (index === sequence.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-6 text-cyber-primary animate-pulse">
          <Terminal size={32} />
          <h1 className="text-2xl font-bold tracking-widest">BOOT_SEQUENCE</h1>
        </div>
        
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="text-green-500 text-sm md:text-base tracking-wider shadow-green-500/20 drop-shadow-sm">
              <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
              <span>&gt; {line}</span>
            </div>
          ))}
          <div className="animate-blink text-cyber-primary">_</div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyber-primary shadow-[0_0_10px_#00f0ff]"
            style={{ 
              width: `${(lines.length / sequence.length) * 100}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
      </div>
      
      <div className="absolute bottom-8 text-xs text-gray-600 tracking-[0.5em]">
        BSCS 4 SYSTEM PROPRIETARY
      </div>
    </div>
  );
};