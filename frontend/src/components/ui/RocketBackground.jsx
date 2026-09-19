import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const ROCKETS = Array.from({ length: 8 }).map((_, i) => ({
  id: `rocket-${i}`,
  x: pseudoRandom(i * 13 + 1) * 100,
  delay: pseudoRandom(i * 17 + 2) * 15,
  duration: 15 + pseudoRandom(i * 19 + 3) * 15,
  size: 24 + pseudoRandom(i * 23 + 4) * 32,
  drift: (pseudoRandom(i * 29 + 5) - 0.5) * 100,
}));

const SMOKE_PARTICLES = Array.from({ length: 25 }).map((_, i) => ({
  id: `smoke-${i}`,
  x: pseudoRandom(i * 31 + 6) * 100,
  delay: pseudoRandom(i * 37 + 7) * 20,
  duration: 10 + pseudoRandom(i * 41 + 8) * 15,
  size: 40 + pseudoRandom(i * 43 + 9) * 100,
  drift: (pseudoRandom(i * 47 + 10) - 0.5) * 200,
}));

export default function RocketBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Smoke */}
      {SMOKE_PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bottom-[-150px] rounded-full bg-blue-500/10 blur-[40px]"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-100, -1500],
            opacity: [0, 0.4, 0.8, 0],
            scale: [0.5, 2, 4],
            x: [0, particle.drift],
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
      {ROCKETS.map((rocket) => (
        <motion.div
          key={rocket.id}
          className="absolute bottom-[-100px] text-blue-500/20"
          style={{ left: `${rocket.x}%` }}
          animate={{
            y: [-50, -1500],
            opacity: [0, 1, 1, 0],
            x: [0, rocket.drift],
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

