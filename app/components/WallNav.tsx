"use client";

import { motion } from "framer-motion";

interface WallNavProps {
  activeIndex: number;
  scrollToSection: (index: number) => void;
}

const sections = ["Front", "Locations", "Capsule", "Items"];

export default function WallNav({
  activeIndex,
  scrollToSection,
}: WallNavProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Left Top - Front */}
      <motion.div
        className="absolute left-8 top-16 transform -rotate-90 origin-center cursor-pointer"
        animate={{
          opacity: activeIndex === 0 ? 1 : 0.35,
          scale: activeIndex === 0 ? 1.05 : 1,
          filter:
            activeIndex === 0
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={() => scrollToSection(0)}
        whileHover={{ scale: activeIndex === 0 ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[0]}
        </span>
      </motion.div>

      {/* Right Top - Locations */}
      <motion.div
        className="absolute right-8 top-16 transform rotate-90 origin-center cursor-pointer"
        animate={{
          opacity: activeIndex === 1 ? 1 : 0.35,
          scale: activeIndex === 1 ? 1.05 : 1,
          filter:
            activeIndex === 1
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={() => scrollToSection(1)}
        whileHover={{ scale: activeIndex === 1 ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[1]}
        </span>
      </motion.div>

      {/* Left Bottom - Capsule */}
      <motion.div
        className="absolute left-8 bottom-16 transform -rotate-90 origin-center cursor-pointer"
        animate={{
          opacity: activeIndex === 2 ? 1 : 0.35,
          scale: activeIndex === 2 ? 1.05 : 1,
          filter:
            activeIndex === 2
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={() => scrollToSection(2)}
        whileHover={{ scale: activeIndex === 2 ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[2]}
        </span>
      </motion.div>

      {/* Right Bottom - Items */}
      <motion.div
        className="absolute right-8 bottom-16 transform rotate-90 origin-center cursor-pointer"
        animate={{
          opacity: activeIndex === 3 ? 1 : 0.35,
          scale: activeIndex === 3 ? 1.05 : 1,
          filter:
            activeIndex === 3
              ? "brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
              : "brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        onClick={() => scrollToSection(3)}
        whileHover={{ scale: activeIndex === 3 ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-gothic text-black text-xl tracking-wider">
          {sections[3]}
        </span>
      </motion.div>
    </div>
  );
}
