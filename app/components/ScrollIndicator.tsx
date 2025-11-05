"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollIndicator() {
  const { scrollY } = useScroll();

  // Transform scroll value to opacity - fully visible on load, begin fading between 100-150px, fully transparent after 150px
  const opacity = useTransform(scrollY, [0, 100, 150], [1, 0.5, 0]);

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
      style={{ opacity }}
      animate={{
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="w-4 h-7 border-2 border-neutral-600/60 dark:border-neutral-400/60 rounded-full flex justify-center shadow-[0_0_4px_rgba(0,0,0,0.15)]">
          <div className="w-0.5 h-2 bg-neutral-600/60 dark:bg-neutral-400/60 rounded-full mt-1.5"></div>
        </div>
      </div>
    </motion.div>
  );
}
