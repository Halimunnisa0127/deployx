import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function RocketBackground() {
  // Generate random rockets
  const rockets = Array.from({ length: 8 }).map((_, i) => ({
    id: `rocket-${i}`,
    x: Math.random() * 100, // percentage across screen
    delay: Math.random() * 15, // start delay
    duration: 15 + Math.random() * 15, // how long it takes to cross screen
    size: 24 + Math.random() * 32, // rocket size
  }));

  // Generate random smoke particles
  const smokeParticles = Array.from({ length: 25 }).map((_, i) => ({
    id: `smoke-${i}`,
    x: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 10 + Math.random() * 15,
    size: 40 + Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Smoke */}
      {smokeParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bottom-[-150px] rounded-full bg-indigo-500/10 blur-[40px]"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-100, -1500],
            opacity: [0, 0.4, 0.8, 0],
            scale: [0.5, 2, 4],
            x: [0, (Math.random() - 0.5) * 200] // subtle drift left/right
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Rockets */}
      {rockets.map((rocket) => (
        <motion.div
          key={rocket.id}
          className="absolute bottom-[-100px] text-indigo-500/20"
          style={{ left: `${rocket.x}%` }}
          animate={{
            y: [-50, -1500],
            opacity: [0, 1, 1, 0],
            x: [0, (Math.random() - 0.5) * 100] // slight drift
          }}
          transition={{
            duration: rocket.duration,
            repeat: Infinity,
            delay: rocket.delay,
            ease: "easeIn",
          }}
        >
          <Rocket size={rocket.size} className="transform -rotate-45" />
        </motion.div>
      ))}
    </div>
  );
}
