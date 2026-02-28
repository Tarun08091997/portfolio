import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import NightSky from "./NightSky";

const FluidBackground = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);

  // Light theme colors - vibrant multicolor
  const lightColors = [
    "#2563EB", // Blue
    "#FF652F", // Orange
    "#14A76C", // Green
    "#FFE400", // Yellow
    "#9333EA", // Purple
    "#EC4899", // Pink
  ];

  // Dark theme colors - vibrant multicolor
  const darkColors = [
    "#3B82F6", // Bright Blue
    "#FF652F", // Orange
    "#10B981", // Bright Green
    "#FBBF24", // Amber
    "#A855F7", // Purple
    "#F472B6", // Pink
  ];

  const colors = theme === "dark" ? darkColors : lightColors;

  useEffect(() => {
    // Only set up mouse tracking for light mode
    if (theme === "dark") return;

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Update CSS variables
        if (containerRef.current) {
          containerRef.current.style.setProperty('--mouse-x', `${x}%`);
          containerRef.current.style.setProperty('--mouse-y', `${y}%`);
        }
      }
    };

    const handleMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', '50%');
        containerRef.current.style.setProperty('--mouse-y', '50%');
      }
    };

    // Attach to document for better tracking
    document.addEventListener("mousemove", handleMouseMove);
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [theme]);

  // Render different backgrounds based on theme
  if (theme === "dark") {
    return (
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #000000 50%, #000000 100%)",
          pointerEvents: "none",
        }}
      >
        <NightSky />
        {/* Very subtle overlay for content readability - reduced opacity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.42) 100%)",
          }}
        />
      </div>
    );
  }

  // Light mode: Fluid background with cursor interaction
  return (
    <>
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.15); }
          66% { transform: translate(25px, -25px) scale(0.85); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 30px) scale(1.2); }
          66% { transform: translate(-30px, -20px) scale(0.8); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -30px) scale(1.1); }
          66% { transform: translate(30px, 30px) scale(0.9); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25px, -20px) scale(1.15); }
          66% { transform: translate(-25px, 20px) scale(0.85); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20px, 25px) scale(1.2); }
          66% { transform: translate(20px, -25px) scale(0.8); }
        }
      `}</style>
      
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #ddd6fe 100%)",
          pointerEvents: "none",
        }}
      >
        {/* Animated gradient blobs using CSS */}
        {colors.map((color, index) => {
          const size = 200 + index * 50;
          const leftPercent = index * 15;
          const topPercent = index * 20;
          
          return (
            <div
              key={`blob-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 72%)`,
                opacity: 0.5,
                filter: "blur(42px) saturate(130%)",
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                animation: `float-${index} ${15 + index * 2}s ease-in-out infinite`,
                mixBlendMode: "multiply",
                willChange: "transform",
              }}
            />
          );
        })}

        {/* Cursor-following blobs */}
        {colors.slice(0, 3).map((color, index) => {
          const size = 150 + index * 40;
          
          return (
            <div
              key={`cursor-blob-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 72%)`,
                opacity: 0.35,
                filter: "blur(52px) saturate(140%)",
                left: `var(--mouse-x, 50%)`,
                top: `var(--mouse-y, 50%)`,
                transform: "translate(-50%, -50%)",
                transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1), top 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                mixBlendMode: "multiply",
                willChange: "left, top",
              }}
            />
          );
        })}

        {/* Additional overlay for smoother blending */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0) 0%, rgba(240, 243, 255, 0.38) 100%)",
          }}
        />
      </div>
    </>
  );
};

export default FluidBackground;
