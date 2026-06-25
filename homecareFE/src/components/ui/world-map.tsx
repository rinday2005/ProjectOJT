import React from 'react';

interface Point {
  lat: number;
  lng: number;
}

interface Dot {
  start: Point;
  end: Point;
}

interface WorldMapProps {
  dots?: Dot[];
}

export const WorldMap: React.FC<WorldMapProps> = ({ dots = [] }) => {
  return (
    <div className="relative w-full h-[400px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 shadow-inner">
      {/* Background map */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80')` }}
      />
      
      {/* SVG displaying connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        {dots.map((dot, index) => {
          // Convert lat/lng to preliminary flat SVG coordinates (800x400)
          const project = (lat: number, lng: number) => {
            const x = ((lng + 180) / 360) * 800;
            const y = ((90 - lat) / 180) * 400;
            return { x, y };
          };

          const p1 = project(dot.start.lat, dot.start.lng);
          const p2 = project(dot.end.lat, dot.end.lng);

          const midX = (p1.x + p2.x) / 2;
          const midY = Math.min(p1.y, p2.y) - 40; // Curve height

          return (
            <g key={index}>
              {/* Connection curve */}
              <path
                d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                fill="none"
                stroke="#0d8ca5"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              
              {/* Start point */}
              <circle cx={p1.x} cy={p1.y} r="4" fill="#0d8ca5" />
              
              {/* Destination point */}
              <circle cx={p2.x} cy={p2.y} r="4" fill="#19c3e6" />
              <circle cx={p2.x} cy={p2.y} r="8" fill="none" stroke="#19c3e6" strokeWidth="1" className="animate-ping" />
            </g>
          );
        })}
      </svg>
      
      <div className="relative z-10 text-white/50 text-xs font-semibold uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
        Map Monitoring Node
      </div>
    </div>
  );
};

export default WorldMap;
