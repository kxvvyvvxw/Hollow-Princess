"use client";

import { motion } from "framer-motion";

interface WallNavProps {
  activeIndex: number;
}

const sections = ["Home", "Concepts", "Vault", "Store"];

export default function WallNav({ activeIndex }: WallNavProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Left Top - Home */}
      <motion.div
        className="absolute left-8 top-16 transform -rotate-90 origin-center"
        animate={{
          opacity: activeIndex === 0 ? 1 : 0.35,
          scale: activeIndex === 0 ? 1.05 : 1,
          filter:
            activeIndex === 0
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[0]}
        </span>
      </motion.div>

      {/* Left Bottom - Lore */}
      <motion.div
        className="absolute left-8 bottom-16 transform -rotate-90 origin-center"
        animate={{
          opacity: activeIndex === 1 ? 1 : 0.35,
          scale: activeIndex === 1 ? 1.05 : 1,
          filter:
            activeIndex === 1
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[1]}
        </span>
      </motion.div>

      {/* Right Top - Vault */}
      <motion.div
        className="absolute right-8 top-16 transform rotate-90 origin-center"
        animate={{
          opacity: activeIndex === 2 ? 1 : 0.35,
          scale: activeIndex === 2 ? 1.05 : 1,
          filter:
            activeIndex === 2
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[2]}
        </span>
      </motion.div>

      {/* Right Bottom - Store */}
      <motion.div
        className="absolute right-8 bottom-16 transform rotate-90 origin-center"
        animate={{
          opacity: activeIndex === 3 ? 1 : 0.35,
          scale: activeIndex === 3 ? 1.05 : 1,
          filter:
            activeIndex === 3
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[3]}
        </span>
      </motion.div>
    </div>
  );
}
