import React, { useEffect, useState, useRef } from 'react';

const StarBackground: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);

  // Handle Mouse Movement for the Glow Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      if (cursorRef.current) {
        // Use transform for performant animation
        cursorRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" }); // Smooth follow delay
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate Stars
  useEffect(() => {
    const newStars = Array.from({ length: 70 }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      const duration = Math.random() * 20 + 10; // Slower, more majestic drift
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: Math.random() * 0.7 + 0.3,
          animation: `drift ${duration}s linear infinite`,
          animationDelay: `-${Math.random() * 20}s`, // Start at different times
        },
      };
    });
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030014]">
      {/* Dynamic Cursor Glow */}
      <div 
        ref={cursorRef}
        className="fixed pointer-events-none w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen transition-opacity duration-300"
      />

      {/* Deep Galaxy Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e]/30 via-[#0a0a1a]/80 to-black z-0"></div>
      
      {/* Colorful Nebula Clouds */}
      <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Keyframes for drift */}
      <style>
        {`
          @keyframes drift {
            0% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
          }
        `}
      </style>

      {/* Stars Layer */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={star.style}
        />
      ))}
    </div>
  );
};

export default StarBackground;