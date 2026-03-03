import { useEffect, useRef } from "react";

const NightSky = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Set canvas size - covers full document height for scrolling
    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const bodyHeight = document.body ? document.body.scrollHeight : 0;
      const htmlHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const height = Math.max(viewportHeight, htmlHeight, bodyHeight, viewportHeight * 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", resizeCanvas);
    
    // Recalculate on load to ensure full document height
    window.addEventListener("load", () => {
      resizeCanvas();
      setTimeout(resizeCanvas, 100);
    });

    // Star class with layer-based system
    class Star {
      constructor(layer = 1, baseX = null, baseY = null) {
        this.layer = layer; // 1 = small, 2 = medium, 3 = large
        // Get document height more reliably - ensure we get full height
        const bodyHeight = document.body ? document.body.scrollHeight : 0;
        const htmlHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const docHeight = Math.max(viewportHeight, htmlHeight, bodyHeight, viewportHeight * 2); // Ensure minimum coverage
        const vw = window.innerWidth;
        
        // Position relative to document (so stars scroll with page)
        this.baseX = baseX !== null ? baseX : Math.random() * vw;
        this.baseY = baseY !== null ? baseY : Math.random() * docHeight;
        
        // Layer-specific base size
        let baseSize;
        if (layer === 1) {
          baseSize = 1;
          this.opacity = Math.random() * 0.4 + 0.3;
        } else if (layer === 2) {
          baseSize = 2;
          this.opacity = Math.random() * 0.5 + 0.4;
        } else {
          baseSize = 3;
          this.opacity = Math.random() * 0.6 + 0.5;
        }
        
        // 95% of stars are smaller (base size), 5% can be up to 2x larger
        const sizeRand = Math.random();
        if (sizeRand < 0.95) {
          // 95% - smaller stars (base size or slightly smaller)
          this.size = baseSize * (0.7 + Math.random() * 0.3); // 0.7x to 1x
        } else {
          // 5% - bigger stars (up to 2x)
          this.size = baseSize * (1 + Math.random()); // 1x to 2x
        }
        
        // Add twinkling for some stars (30% chance)
        this.isTwinkling = Math.random() < 0.3;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        
        // Glow intensity (stronger for larger stars)
        this.glowIntensity = this.layer === 3 ? Math.random() * 0.4 + 0.3 : Math.random() * 0.2 + 0.1;
        
        // Assign star color based on temperature (90% white, 10% orange)
        const colorRand = Math.random();
        if (colorRand < 0.9) {
          // White stars (90%)
          this.color = { r: 255, g: 255, b: 255 };
        } else {
          // Orange stars (10%)
          this.color = { r: 255, g: 165, b: 0 };
        }
      }

      update() {
        // Stars scroll with the page
        const scrollY = window.scrollY || window.pageYOffset || 0;
        this.x = this.baseX;
        this.y = this.baseY - scrollY;
        
        // Update twinkling phase
        if (this.isTwinkling) {
          this.twinklePhase += this.twinkleSpeed;
        }
      }

      draw() {
        // Skip if outside viewport (with some margin for smooth scrolling)
        const margin = 100;
        if (this.x < -margin || this.x > window.innerWidth + margin || 
            this.y < -margin || this.y > window.innerHeight + margin) {
          return;
        }

        let opacity = this.opacity;
        
        // Apply twinkling effect
        if (this.isTwinkling) {
          const twinkleFactor = 0.7 + 0.3 * Math.sin(this.twinklePhase);
          opacity *= twinkleFactor;
        }

        const radius = this.size;
        
        // Draw star with peripheral glow effect for larger stars
        if (this.layer === 3) {
          const glowRadius = radius * (1 + this.glowIntensity * 2);
          const gradient = ctx.createRadialGradient(this.x, this.y, radius * 0.3, this.x, this.y, glowRadius);
          
          gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`);
          gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity * 0.6})`);
          const peripheralOpacity = opacity * this.glowIntensity * (0.5 + Math.random() * 0.5);
          gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${peripheralOpacity})`);
          gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw star core with color
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Comet {
      constructor() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const margin = 180;
        const side = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left

        if (side === 0) {
          this.x = Math.random() * width;
          this.y = -margin;
        } else if (side === 1) {
          this.x = width + margin;
          this.y = Math.random() * height;
        } else if (side === 2) {
          this.x = Math.random() * width;
          this.y = height + margin;
        } else {
          this.x = -margin;
          this.y = Math.random() * height;
        }

        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        const dirX = targetX - this.x;
        const dirY = targetY - this.y;
        const magnitude = Math.hypot(dirX, dirY) || 1;
        const speed = Math.random() * 5 + 4.5;

        this.vx = (dirX / magnitude) * speed;
        this.vy = (dirY / magnitude) * speed;
        this.length = Math.random() * 130 + 110;
        this.width = Math.random() * 1.15 + 0.7;
        this.life = 0;
        this.maxLife = Math.floor(Math.random() * 120 + 120);
        
        // Random base scale (some comets far away, some close)
        this.baseScale = Math.random() * 0.8 + 0.2; // Range: 0.2 to 1.0
        this.currentScale = this.baseScale;
        
        // For some comets, make size variable (coming toward us or going away)
        // 60% chance of having variable size
        this.hasVariableSize = Math.random() < 0.6;
        if (this.hasVariableSize) {
          // Random growth rate: positive = coming toward us, negative = going away
          this.scaleChangeRate = (Math.random() - 0.5) * 0.008; // Range: -0.004 to 0.004
        } else {
          this.scaleChangeRate = 0;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life += 1;
        
        // Update scale if comet has variable size
        if (this.hasVariableSize) {
          this.currentScale += this.scaleChangeRate;
          // Clamp scale to reasonable bounds
          this.currentScale = Math.max(0.1, Math.min(2.0, this.currentScale));
        }
      }

      draw() {
        // Comet position fixed to viewport
        const viewX = this.x;
        const viewY = this.y;
        const tailX = viewX - this.vx * this.length * 0.12;
        const tailY = viewY - this.vy * this.length * 0.12;

        // Apply scale to all dimensions
        const scaledWidth = this.width * this.currentScale;
        const scaledHeadSize = 1.4 * this.currentScale;
        const scaledLength = this.length * this.currentScale;
        const adjustedTailX = viewX - this.vx * scaledLength * 0.12;
        const adjustedTailY = viewY - this.vy * scaledLength * 0.12;

        const tail = ctx.createLinearGradient(viewX, viewY, adjustedTailX, adjustedTailY);
        tail.addColorStop(0, "rgba(255, 255, 255, 0.45)");
        tail.addColorStop(0.25, "rgba(190, 220, 255, 0.26)");
        tail.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = tail;
        ctx.lineWidth = scaledWidth;
        ctx.beginPath();
        ctx.moveTo(viewX, viewY);
        ctx.lineTo(adjustedTailX, adjustedTailY);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(viewX, viewY, scaledHeadSize, 0, Math.PI * 2);
        ctx.fill();
      }

      isDead() {
        const margin = 260;
        return (
          this.life > this.maxLife ||
          this.x < -margin ||
          this.x > window.innerWidth + margin ||
          this.y < -margin ||
          this.y > window.innerHeight + margin
        );
      }
    }

    // Get reliable document height for star distribution
    const getDocumentHeight = () => {
      const bodyHeight = document.body ? document.body.scrollHeight : 0;
      const htmlHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      return Math.max(viewportHeight, htmlHeight, bodyHeight, viewportHeight * 2);
    };

    // Create star layers inspired by CSS example (sparser)
    // Layer 1: Small stars (1px) - many, fast scroll
    const starsLayer1 = [];
    const starLayer1Count = 60; // 1/5 of 300 = 60 stars
    const initialDocHeight = getDocumentHeight();
    for (let i = 0; i < starLayer1Count; i++) {
      starsLayer1.push(new Star(1));
    }

    // Layer 2: Medium stars (2px) - medium count, medium scroll
    const starsLayer2 = [];
    const starLayer2Count = 120; // Reduced from 700
    for (let i = 0; i < starLayer2Count; i++) {
      starsLayer2.push(new Star(2));
    }

    // Layer 3: Large stars (3px) - few, slow scroll
    const starsLayer3 = [];
    const starLayer3Count = 40; // Reduced from 200
    for (let i = 0; i < starLayer3Count; i++) {
      starsLayer3.push(new Star(3));
    }
    
    // Recalculate and redistribute stars if document height changes
    const redistributeStars = () => {
      const newDocHeight = getDocumentHeight();
      if (newDocHeight > initialDocHeight) {
        // Add more stars to fill the additional space
        const heightRatio = newDocHeight / initialDocHeight;
        const additionalStars1 = Math.floor(starLayer1Count * (heightRatio - 1) * 0.5);
        const additionalStars2 = Math.floor(starLayer2Count * (heightRatio - 1) * 0.5);
        const additionalStars3 = Math.floor(starLayer3Count * (heightRatio - 1) * 0.5);
        
        for (let i = 0; i < additionalStars1; i++) {
          const y = initialDocHeight + Math.random() * (newDocHeight - initialDocHeight);
          starsLayer1.push(new Star(1, null, y));
        }
        for (let i = 0; i < additionalStars2; i++) {
          const y = initialDocHeight + Math.random() * (newDocHeight - initialDocHeight);
          starsLayer2.push(new Star(2, null, y));
        }
        for (let i = 0; i < additionalStars3; i++) {
          const y = initialDocHeight + Math.random() * (newDocHeight - initialDocHeight);
          starsLayer3.push(new Star(3, null, y));
        }
      }
    };
    
    // Redistribute after a short delay to ensure document is fully loaded
    setTimeout(redistributeStars, 100);
    setTimeout(redistributeStars, 500);
    window.addEventListener("resize", redistributeStars);

    const celestialBodies = Array.from(
      { length: Math.random() < 0.5 ? 1 : 2 },
      () => ({
        xRatio: Math.random() * 0.8 + 0.1,
        yRatio: Math.random() * 0.6 + 0.08,
        radius: Math.random() * 14 + 14,
        opacity: Math.random() * 0.06 + 0.06,
        kind: Math.random() < 0.6 ? "planet" : "giant-star",
      })
    );

    const drawCelestialBodies = () => {
      // Celestial bodies scroll with page
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      celestialBodies.forEach((body) => {
        const x = body.xRatio * window.innerWidth;
        const y = body.yRatio * docHeight - scrollY;

        if (body.kind === "planet") {
          const gradient = ctx.createRadialGradient(
            x - body.radius * 0.35,
            y - body.radius * 0.35,
            body.radius * 0.2,
            x,
            y,
            body.radius
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${body.opacity + 0.08})`);
          gradient.addColorStop(0.35, `rgba(215, 220, 235, ${body.opacity})`);
          gradient.addColorStop(1, "rgba(20, 20, 24, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, body.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, body.radius * 1.3);
          glow.addColorStop(0, `rgba(255, 255, 255, ${body.opacity + 0.16})`);
          glow.addColorStop(0.25, `rgba(235, 245, 255, ${body.opacity + 0.04})`);
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, body.radius * 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const activeComets = [];
    let lastCometTime = 0;
    let nextCometDelay = Math.random() * 1200 + 400;
    const maxComets = 12;

    // Animation loop
    const animate = (timestamp = 0) => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const bodyHeight = document.body ? document.body.scrollHeight : 0;
      const htmlHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const docHeight = Math.max(viewportHeight, htmlHeight, bodyHeight, viewportHeight * 2);
      const vw = window.innerWidth;
      ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
      ctx.fillRect(0, 0, vw, docHeight);

      drawCelestialBodies();

      // Update and draw stars in layers (back to front for proper layering)
      // Stars scroll with the page
      // Layer 1: Small stars (drawn first)
      starsLayer1.forEach((star) => {
        star.update();
        star.draw();
      });

      // Layer 2: Medium stars
      starsLayer2.forEach((star) => {
        star.update();
        star.draw();
      });

      // Layer 3: Large stars (drawn last)
      starsLayer3.forEach((star) => {
        star.update();
        star.draw();
      });

      if (timestamp - lastCometTime > nextCometDelay && activeComets.length < maxComets) {
        activeComets.push(new Comet());
        lastCometTime = timestamp;
        nextCometDelay = Math.random() * 1200 + 400;
      }

      for (let i = activeComets.length - 1; i >= 0; i -= 1) {
        const comet = activeComets[i];
        comet.update();
        comet.draw();
        if (comet.isDead()) {
          activeComets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full"
      style={{
        opacity: 1,
      }}
    />
  );
};

export default NightSky;
