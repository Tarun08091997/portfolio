import { useEffect, useRef } from "react";

const NightSky = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Set canvas size
    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Star class
    class Star {
      constructor(isMilkyWay = false, isStatic = false) {
        this.isMilkyWay = isMilkyWay;
        this.isStatic = isStatic;
        if (isMilkyWay) {
          // Stars in the Milky Way band (diagonal across screen)
          const centerY = window.innerHeight / 2;
          const bandWidth = window.innerHeight * 0.34;
          this.x = Math.random() * window.innerWidth;
          this.y = centerY + (Math.random() - 0.5) * bandWidth;
          this.z = isStatic ? 1000 : Math.random() * 1500 + 500; // Closer stars
        } else {
          this.x = Math.random() * window.innerWidth;
          this.y = Math.random() * window.innerHeight;
          this.z = isStatic ? 1000 : Math.random() * 2000;
        }
        this.prevZ = this.z;
        this.size = isMilkyWay ? Math.random() * 1.2 + 0.35 : Math.random() * 1.5 + 0.45;
        this.speed = isStatic ? 0 : (isMilkyWay ? Math.random() * 1.5 + 0.3 : Math.random() * 2 + 0.5);
        this.opacity = isMilkyWay ? Math.random() * 0.08 + 0.38 : Math.random() * 0.1 + 0.32;
      }

      update() {
        if (!this.isStatic) {
          this.z -= this.speed;
          if (this.z <= 0) {
            this.z = this.isMilkyWay ? 2000 : 2000;
            if (this.isMilkyWay) {
              const centerY = window.innerHeight / 2;
              const bandWidth = window.innerHeight * 0.34;
              this.x = Math.random() * window.innerWidth;
              this.y = centerY + (Math.random() - 0.5) * bandWidth;
            } else {
              this.x = Math.random() * window.innerWidth;
              this.y = Math.random() * window.innerHeight;
            }
          }
        }
      }

      draw() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const x = (this.x - vw / 2) * (1000 / this.z) + vw / 2;
        const y = (this.y - vh / 2) * (1000 / this.z) + vh / 2;
        const prevX = (this.x - vw / 2) * (1000 / this.prevZ) + vw / 2;
        const prevY = (this.y - vh / 2) * (1000 / this.prevZ) + vh / 2;

        this.prevZ = this.z;

        const radius = Math.max(0.3, (1 - this.z / 2000) * this.size);
        const opacity = this.isStatic ? this.opacity : Math.max(0.2, (1 - this.z / 2000) * this.opacity);

        if (prevX !== x || prevY !== y) {
          const trailOpacity = this.isMilkyWay ? opacity * 0.1 : opacity * 0.07;
          ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.lineWidth = this.isMilkyWay ? radius * 0.45 : radius * 0.3;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (opacity > 0.55 || this.isMilkyWay) {
          ctx.shadowBlur = radius * (this.isMilkyWay ? 1.2 : 0.8);
          ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life += 1;
      }

      draw() {
        const tailX = this.x - this.vx * this.length * 0.12;
        const tailY = this.y - this.vy * this.length * 0.12;

        const tail = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        tail.addColorStop(0, "rgba(255, 255, 255, 0.45)");
        tail.addColorStop(0.25, "rgba(190, 220, 255, 0.26)");
        tail.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = tail;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.4, 0, Math.PI * 2);
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

    // Create static stars (always visible, no movement)
    const staticStars = [];
    const staticStarCount = 15;
    for (let i = 0; i < staticStarCount; i++) {
      staticStars.push(new Star(false, true));
    }

    // Create static Milky Way stars
    const staticMilkyWayStars = [];
    const staticMilkyWayCount = 8;
    for (let i = 0; i < staticMilkyWayCount; i++) {
      staticMilkyWayStars.push(new Star(true, true));
    }

    // Create regular moving stars
    const stars = [];
    const starCount = 12;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(false));
    }

    // Create Milky Way stars (river of stars)
    const milkyWayStars = [];
    const milkyWayCount = 7;
    for (let i = 0; i < milkyWayCount; i++) {
      milkyWayStars.push(new Star(true));
    }

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
      celestialBodies.forEach((body) => {
        const x = body.xRatio * window.innerWidth;
        const y = body.yRatio * window.innerHeight;

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

    const drawMilkyWay = () => {};
    const activeComets = [];
    let lastCometTime = 0;
    let nextCometDelay = Math.random() * 2200 + 800;
    const maxComets = 6;

    // Animation loop
    const animate = (timestamp = 0) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      drawCelestialBodies();

      // Draw Milky Way background
      drawMilkyWay();

      // Draw static stars first (always visible)
      staticStars.forEach((star) => {
        star.draw();
      });

      staticMilkyWayStars.forEach((star) => {
        star.draw();
      });

      // Update and draw moving regular stars
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Update and draw moving Milky Way stars
      milkyWayStars.forEach((star) => {
        star.update();
        star.draw();
      });

      if (timestamp - lastCometTime > nextCometDelay && activeComets.length < maxComets) {
        activeComets.push(new Comet());
        lastCometTime = timestamp;
        nextCometDelay = Math.random() * 2600 + 700;
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
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        opacity: 1,
      }}
    />
  );
};

export default NightSky;
