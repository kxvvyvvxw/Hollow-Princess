"use client";

interface BottomNavProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
}

const LINKS = ["Capsule", "Location", "Purchase"];

export default function BottomNav({ activeIndex, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-8 z-40 flex justify-center">
      <div className="flex items-center gap-10">
        {LINKS.map((label, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(index)}
              className={[
                "font-gothic text-lg tracking-widest transition-all duration-300",
                "text-black/65 hover:text-black/85",
                "transform focus:outline-none",
                isActive
                  ? "text-black/100 scale-110"
                  : "scale-100 hover:scale-105 focus:scale-105",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
