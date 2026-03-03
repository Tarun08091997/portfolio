import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import NightSky from "./NightSky";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const createProgram = (gl, vsSource, fsSource) => {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
};

const createTexture = (gl, width, height) => {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  return tex;
};

const createFbo = (gl, texture) => {
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return fbo;
};

const createTarget = (gl, width, height) => {
  const texA = createTexture(gl, width, height);
  const texB = createTexture(gl, width, height);
  const fboA = createFbo(gl, texA);
  const fboB = createFbo(gl, texB);
  return {
    read: { tex: texA, fbo: fboA },
    write: { tex: texB, fbo: fboB },
    swap() {
      const t = this.read;
      this.read = this.write;
      this.write = t;
    },
  };
};

const baseVs = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = 0.5 * (aPosition + 1.0);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const advectionFs = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uSource;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
uniform float uVelocityScale;
void main() {
  vec2 vel = texture2D(uVelocity, vUv).xy * 2.0 - 1.0;
  vec2 coord = vUv - uDt * vel * uVelocityScale * uTexel;
  vec4 value = texture2D(uSource, coord);
  gl_FragColor = value * uDissipation;
}`;

const velocityAdvectionFs = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocitySource;
uniform sampler2D uVelocityField;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
uniform float uVelocityScale;
void main() {
  vec2 flow = texture2D(uVelocityField, vUv).xy * 2.0 - 1.0;
  vec2 coord = vUv - uDt * flow * uVelocityScale * uTexel;
  vec2 sampled = texture2D(uVelocitySource, coord).xy * 2.0 - 1.0;
  sampled *= uDissipation;
  gl_FragColor = vec4(sampled * 0.5 + 0.5, 0.0, 1.0);
}`;

const splatFs = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
void main() {
  vec4 base = texture2D(uTarget, vUv);
  vec2 d = vUv - uPoint;
  float splash = exp(-dot(d, d) / uRadius);
  gl_FragColor = base + vec4(uColor * splash, 0.0);
}`;

const displayFs = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uDye;
void main() {
  vec3 c = texture2D(uDye, vUv).rgb;
  c = pow(c, vec3(0.9));
  float a = clamp(max(c.r, max(c.g, c.b)) * 1.2, 0.0, 0.95);
  gl_FragColor = vec4(c, a);
}`;

const clearFs = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float uDecay;
void main() {
  vec4 val = texture2D(uTarget, vUv) * uDecay;
  // Kill near-zero values to prevent permanent faint marks
  val = val * step(0.003, val);
  gl_FragColor = val;
}`;

const FluidBackground = () => {
  const { theme } = useTheme();
  const mode = useMemo(() => (theme === "dark" ? "dark" : "light"), [theme]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mode !== "light") return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cleanup = null;

    // Clean up any existing WebGL context first
    const existingContext = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (existingContext) {
      const loseContext = existingContext.getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }
    }

    // Small delay to ensure cleanup is complete before initializing
    const initTimeout = setTimeout(() => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      });
      if (!gl) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const advectionProgram = createProgram(gl, baseVs, advectionFs);
    const velocityAdvectionProgram = createProgram(gl, baseVs, velocityAdvectionFs);
    const splatProgram = createProgram(gl, baseVs, splatFs);
    const displayProgram = createProgram(gl, baseVs, displayFs);
    const clearProgram = createProgram(gl, baseVs, clearFs);
    if (!advectionProgram || !velocityAdvectionProgram || !splatProgram || !displayProgram || !clearProgram) return undefined;

    const bindQuad = (program) => {
      gl.useProgram(program);
      const loc = gl.getAttribLocation(program, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

      let dpr = 1;
      let simW = 0;
      let simH = 0;
      let velocity = null;
      let dye = null;
      let animationRaf = 0;
      let lastTime = performance.now();
      let hue = 0;

    const pointer = { x: 0, y: 0, dx: 0, dy: 0, down: false, init: false };
    const splats = [];

    const hslToRgb = (h, s, l) => {
      const a = s * Math.min(l, 1 - l);
      const f = (n) => {
        const k = (n + h * 12) % 12;
        return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
      };
      return [f(0), f(8), f(4)];
    };

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      simW = clamp(Math.floor(w * 0.27), 160, 360);
      simH = clamp(Math.floor(h * 0.27), 90, 220);
      velocity = createTarget(gl, simW, simH);
      dye = createTarget(gl, simW, simH);

      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.read.fbo);
      gl.clearColor(0.5, 0.5, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.read.fbo);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, dye.write.fbo);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const drawTo = (targetFbo, width, height) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo);
      gl.viewport(0, 0, width, height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const runAdvection = (target, velField, dt, dissipation, velScale) => {
      bindQuad(advectionProgram);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, "uDt"), dt);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, "uDissipation"), dissipation);
      gl.uniform1f(gl.getUniformLocation(advectionProgram, "uVelocityScale"), velScale);
      gl.uniform2f(gl.getUniformLocation(advectionProgram, "uTexel"), 1 / simW, 1 / simH);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, target.read.tex);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uSource"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velField.read.tex);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uVelocity"), 1);
      drawTo(target.write.fbo, simW, simH);
      target.swap();
    };

    const runVelocityAdvection = (target, velField, dt, dissipation, velScale) => {
      bindQuad(velocityAdvectionProgram);
      gl.uniform1f(gl.getUniformLocation(velocityAdvectionProgram, "uDt"), dt);
      gl.uniform1f(gl.getUniformLocation(velocityAdvectionProgram, "uDissipation"), dissipation);
      gl.uniform1f(gl.getUniformLocation(velocityAdvectionProgram, "uVelocityScale"), velScale);
      gl.uniform2f(gl.getUniformLocation(velocityAdvectionProgram, "uTexel"), 1 / simW, 1 / simH);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, target.read.tex);
      gl.uniform1i(gl.getUniformLocation(velocityAdvectionProgram, "uVelocitySource"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velField.read.tex);
      gl.uniform1i(gl.getUniformLocation(velocityAdvectionProgram, "uVelocityField"), 1);
      drawTo(target.write.fbo, simW, simH);
      target.swap();
    };

    const runDecay = (target, decay) => {
      bindQuad(clearProgram);
      gl.uniform1f(gl.getUniformLocation(clearProgram, "uDecay"), decay);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, target.read.tex);
      gl.uniform1i(gl.getUniformLocation(clearProgram, "uTarget"), 0);
      drawTo(target.write.fbo, simW, simH);
      target.swap();
    };

    const runSplat = (target, x, y, rgb, radius) => {
      bindQuad(splatProgram);
      gl.uniform2f(gl.getUniformLocation(splatProgram, "uPoint"), x, y);
      gl.uniform3f(gl.getUniformLocation(splatProgram, "uColor"), rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(gl.getUniformLocation(splatProgram, "uRadius"), radius);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, target.read.tex);
      gl.uniform1i(gl.getUniformLocation(splatProgram, "uTarget"), 0);
      drawTo(target.write.fbo, simW, simH);
      target.swap();
    };

    const display = () => {
      bindQuad(displayProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dye.read.tex);
      gl.uniform1i(gl.getUniformLocation(displayProgram, "uDye"), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const pushPointerSplat = () => {
      if (!pointer.init) return;
      const nx = pointer.x / window.innerWidth;
      const ny = 1 - pointer.y / window.innerHeight;
      const speed = Math.hypot(pointer.dx, pointer.dy);
      if (speed < 1.0) return;
      hue = (hue + 0.02) % 1;
      const rgb = hslToRgb(hue, 0.85, 0.55);
      const force = clamp(speed * 0.015, 0.2, 1.5);
      const angle = performance.now() * 0.008;
      const fx = Math.cos(angle) * force * 0.3;
      const fy = Math.sin(angle) * force * 0.3;
      const ox = Math.cos(angle + Math.PI * 0.5) * 0.003;
      const oy = Math.sin(angle + Math.PI * 0.5) * 0.003;

      splats.push({
        x: clamp(nx + ox, 0.01, 0.99),
        y: clamp(ny + oy, 0.01, 0.99),
        color: rgb,
        force: [fx, fy, 0],
        radius: 0.0008 + force * 0.0005,
      });
      splats.push({
        x: clamp(nx - ox, 0.01, 0.99),
        y: clamp(ny - oy, 0.01, 0.99),
        color: rgb,
        force: [-fx, -fy, 0],
        radius: 0.0008 + force * 0.0005,
      });
    };

    const render = (t) => {
      const dt = clamp((t - lastTime) / 1000, 0.008, 0.033);
      lastTime = t;

      runVelocityAdvection(velocity, velocity, dt, 0.97, 20.0);
      runAdvection(dye, velocity, dt, 0.985, 24.0);
      runDecay(dye, 0.993);

      while (splats.length) {
        const s = splats.shift();
        runSplat(velocity, s.x, s.y, [0.5 + s.force[0], 0.5 + s.force[1], 0], s.radius);
        runSplat(dye, s.x, s.y, [s.color[0] * 0.45, s.color[1] * 0.45, s.color[2] * 0.45], s.radius * 2.0);
      }

      display();
      animationRaf = requestAnimationFrame(render);
    };

    const onPointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (!pointer.init) {
        pointer.init = true;
        pointer.x = x;
        pointer.y = y;
      }
      pointer.dx = x - pointer.x;
      pointer.dy = y - pointer.y;
      pointer.x = x;
      pointer.y = y;
      pushPointerSplat();
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      onPointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    };

      resize();
      animationRaf = requestAnimationFrame(render);
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      cleanup = () => {
        cancelAnimationFrame(animationRaf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("touchmove", onTouchMove);
        
        // Clean up WebGL resources
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) {
          loseContext.loseContext();
        }
      };
    }, 50);

    return () => {
      clearTimeout(initTimeout);
      if (cleanup) {
        cleanup();
      }
    };
  }, [mode]);

  if (mode === "dark") {
    return (
      <div
        className="fixed inset-0 z-0 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #000000 0%, #000000 100%)", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <NightSky />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        pointerEvents: "none",
        background: "#ffffff",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default FluidBackground;
