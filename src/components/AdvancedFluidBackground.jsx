import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import NightSky from "./NightSky";

const AdvancedFluidBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (theme !== "light") return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Configuration
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1440,
      DENSITY_DISSIPATION: 0.5,
      VELOCITY_DISSIPATION: 3,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
    };

    // Initialize WebGL
    const glOptions = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = canvas.getContext("webgl2", glOptions);
    const isWebGL2 = !!gl;
    if (!gl) {
      gl = canvas.getContext("webgl", glOptions) || canvas.getContext("experimental-webgl", glOptions);
    }
    if (!gl) return undefined;

    // Get extensions
    let halfFloat, formatRGBA, formatRG, formatR, supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;

    // Format detection
    const getTextureFormat = (internalFormat, format, type) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        return { internalFormat, format };
      }
      return null;
    };

    if (isWebGL2) {
      formatRGBA = getTextureFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getTextureFormat(gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getTextureFormat(gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getTextureFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getTextureFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getTextureFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    if (!supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    gl.clearColor(0, 0, 0, 1);

    // Pointer tracking
    const pointers = [];
    pointers.push({
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: { r: 0, g: 0, b: 0 },
    });

    // Shader compilation
    const compileShader = (type, source, keywords = null) => {
      if (keywords) {
        let keywordString = "";
        keywords.forEach((keyword) => {
          keywordString += `#define ${keyword}\n`;
        });
        source = keywordString + source;
      }
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const createProgram = (vertexShader, fragmentShader) => {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.trace(gl.getProgramInfoLog(program));
      }
      return program;
    };

    const getUniforms = (program) => {
      const uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    };

    // Vertex shader
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );

    // Fragment shaders
    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
      #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
      #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,
      supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;

      #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;

          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);

          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);

          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
      #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,
      config.SHADING ? ["SHADING"] : null
    );

    // Create programs
    const copyProgram = createProgram(baseVertexShader, copyShader);
    const clearProgram = createProgram(baseVertexShader, clearShader);
    const splatProgram = createProgram(baseVertexShader, splatShader);
    const advectionProgram = createProgram(baseVertexShader, advectionShader);
    const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
    const curlProgram = createProgram(baseVertexShader, curlShader);
    const vorticityProgram = createProgram(baseVertexShader, vorticityShader);
    const pressureProgram = createProgram(baseVertexShader, pressureShader);
    const gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);
    const displayProgram = createProgram(baseVertexShader, displayShader);

    const copyUniforms = getUniforms(copyProgram);
    const clearUniforms = getUniforms(clearProgram);
    const splatUniforms = getUniforms(splatProgram);
    const advectionUniforms = getUniforms(advectionProgram);
    const divergenceUniforms = getUniforms(divergenceProgram);
    const curlUniforms = getUniforms(curlProgram);
    const vorticityUniforms = getUniforms(vorticityProgram);
    const pressureUniforms = getUniforms(pressureProgram);
    const gradientSubtractUniforms = getUniforms(gradientSubtractProgram);
    const displayUniforms = getUniforms(displayProgram);

    // Quad buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (framebuffer = null, clear = false) => {
      if (framebuffer === null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, framebuffer.width, framebuffer.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.fbo);
      }
      if (clear) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    // Texture creation
    const createTexture = (width, height, internalFormat, format, type, minFilter) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const texelSizeX = 1.0 / width;
      const texelSizeY = 1.0 / height;
      return {
        texture,
        fbo: framebuffer,
        width,
        height,
        texelSizeX,
        texelSizeY,
        attach: (id) => {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (width, height, internalFormat, format, type, minFilter) => {
      let read = createTexture(width, height, internalFormat, format, type, minFilter);
      let write = createTexture(width, height, internalFormat, format, type, minFilter);
      return {
        width,
        height,
        texelSizeX: read.texelSizeX,
        texelSizeY: read.texelSizeY,
        get read() {
          return read;
        },
        set read(value) {
          read = value;
        },
        get write() {
          return write;
        },
        set write(value) {
          write = value;
        },
        swap() {
          const temp = read;
          read = write;
          write = temp;
        },
      };
    };

    const resizeFBO = (fbo, width, height, internalFormat, format, type, minFilter) => {
      if (fbo.width !== width || fbo.height !== height) {
        const newRead = createTexture(width, height, internalFormat, format, type, minFilter);
        const newWrite = createTexture(width, height, internalFormat, format, type, minFilter);
        fbo.read = newRead;
        fbo.write = newWrite;
        fbo.width = width;
        fbo.height = height;
        fbo.texelSizeX = 1.0 / width;
        fbo.texelSizeY = 1.0 / height;
      }
      return fbo;
    };

    // Resolution calculation
    const getResolution = (resolution, width, height) => {
      let aspect = width / height;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return width > height
        ? { width: max, height: min }
        : { width: min, height: max };
    };

    const getWebGLContextSize = (size) => Math.max(1, Math.floor(size * (window.devicePixelRatio || 1)));

    const getCanvasRect = () => canvas.getBoundingClientRect();

    const getPointerPosition = (clientX, clientY) => {
      const rect = getCanvasRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (clientX - rect.left) * dpr,
        y: (clientY - rect.top) * dpr,
      };
    };

    // Initialize FBOs
    let dye, velocity, divergence, curl, pressure;
    const initFBOs = () => {
      const rect = getCanvasRect();
      const canvasWidth = canvas.width || getWebGLContextSize(rect.width || window.innerWidth);
      const canvasHeight = canvas.height || getWebGLContextSize(rect.height || window.innerHeight);
      const simRes = getResolution(config.SIM_RESOLUTION, canvasWidth, canvasHeight);
      const dyeRes = getResolution(config.DYE_RESOLUTION, canvasWidth, canvasHeight);

      const filter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      dye = dye
        ? resizeFBO(dye, dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filter)
        : createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filter);

      velocity = velocity
        ? resizeFBO(velocity, simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filter)
        : createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filter);

      divergence = divergence
        ? resizeFBO(divergence, simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST)
        : createTexture(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);

      curl = curl
        ? resizeFBO(curl, simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST)
        : createTexture(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);

      pressure = pressure
        ? resizeFBO(pressure, simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST)
        : createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
    };

    // Color generation
    const generateColor = () => {
      const c = HSVtoRGB(Math.random(), 1, 1);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;
      return c;
    };

    const HSVtoRGB = (h, s, v) => {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      let r, g, b;
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return { r, g, b };
    };

    // Splat function
    const splat = (x, y, dx, dy, color) => {
      gl.useProgram(splatProgram);
      gl.uniform1i(splatUniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatUniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatUniforms.point, x, y);
      gl.uniform3f(splatUniforms.color, dx, dy, 0);
      gl.uniform1f(splatUniforms.radius, (config.SPLAT_RADIUS / 100.0) * (canvas.width / canvas.height > 1 ? canvas.width / canvas.height : 1));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatUniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatUniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    };

    // Initialize canvas size
    const resizeCanvas = () => {
      const rect = getCanvasRect();
      const cssWidth = rect.width || window.innerWidth;
      const cssHeight = rect.height || window.innerHeight;
      const width = getWebGLContextSize(cssWidth);
      const height = getWebGLContextSize(cssHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        gl.viewport(0, 0, width, height);
        initFBOs();
      }
    };

    // Update function
    let lastTime = Date.now();
    let colorUpdate = 0;
    let animationFrameId = 0;
    let isDestroyed = false;
    const update = () => {
      if (isDestroyed) return;
      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      resizeCanvas();
      const width = canvas.width;
      const height = canvas.height;

      colorUpdate += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdate >= 1) {
        colorUpdate = wrap(colorUpdate, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }

      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color);
        }
      });

      // Fluid simulation steps
      gl.disable(gl.BLEND);

      // Curl
      gl.useProgram(curlProgram);
      gl.uniform2f(curlUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlUniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      // Vorticity
      gl.useProgram(vorticityProgram);
      gl.uniform2f(vorticityUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityUniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityUniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityUniforms.curl, config.CURL);
      gl.uniform1f(vorticityUniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      // Divergence
      gl.useProgram(divergenceProgram);
      gl.uniform2f(divergenceUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceUniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      // Clear pressure
      gl.useProgram(clearProgram);
      gl.uniform1i(clearUniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearUniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      // Pressure
      gl.useProgram(pressureProgram);
      gl.uniform2f(pressureUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureUniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureUniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gl.useProgram(gradientSubtractProgram);
      gl.uniform2f(gradientSubtractUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractUniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractUniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Advection
      gl.useProgram(advectionProgram);
      gl.uniform2f(advectionUniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        gl.uniform2f(advectionUniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionUniforms.uSource, velocity.read.attach(1));
      gl.uniform1f(advectionUniforms.dt, dt);
      gl.uniform1f(advectionUniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl.uniform2f(advectionUniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionUniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionUniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();

      // Display
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.useProgram(displayProgram);
      if (config.SHADING) {
        gl.uniform2f(displayUniforms.texelSize, 1.0 / width, 1.0 / height);
      }
      gl.uniform1i(displayUniforms.uTexture, dye.read.attach(0));
      blit(null);

      animationFrameId = requestAnimationFrame(update);
    };

    const wrap = (value, min, max) => {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    };

    // Pointer handlers
    const updatePointer = (pointer, id, x, y) => {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = x / canvas.width;
      pointer.texcoordY = 1.0 - y / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    };

    const movePointer = (pointer, id, x, y) => {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = x / canvas.width;
      pointer.texcoordY = 1.0 - y / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = generateColor();
    };

    const correctDeltaX = (delta) => {
      const aspectRatio = canvas.width / canvas.height;
      return aspectRatio < 1 ? delta * aspectRatio : delta;
    };

    const correctDeltaY = (delta) => {
      const aspectRatio = canvas.width / canvas.height;
      return aspectRatio > 1 ? delta / aspectRatio : delta;
    };

    const handleMouseDown = (e) => {
      const pointer = pointers[0];
      const { x, y } = getPointerPosition(e.clientX, e.clientY);
      updatePointer(pointer, -1, x, y);
      const color = generateColor();
      color.r *= 10;
      color.g *= 10;
      color.b *= 10;
      splat(pointer.texcoordX, pointer.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), color);
    };

    const handleMouseMove = (e) => {
      const pointer = pointers[0];
      const { x, y } = getPointerPosition(e.clientX, e.clientY);
      movePointer(pointer, -1, x, y);
    };

    const handleTouchStart = (e) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i] || pointers[0];
        const { x, y } = getPointerPosition(touches[i].clientX, touches[i].clientY);
        updatePointer(pointer, touches[i].identifier, x, y);
      }
    };

    const handleTouchMove = (e) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i] || pointers[0];
        const { x, y } = getPointerPosition(touches[i].clientX, touches[i].clientY);
        movePointer(pointer, touches[i].identifier, x, y);
      }
    };

    const handleTouchEnd = (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i] || pointers[0];
        pointer.down = false;
      }
    };

    // Initialize
    resizeCanvas();
    initFBOs();
    update();

    // Event listeners
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      isDestroyed = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [theme]);

  if (theme === "dark") {
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
      <canvas ref={canvasRef} id="fluid" className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default AdvancedFluidBackground;
