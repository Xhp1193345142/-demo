import * as THREE from "three";

const ctx = {
  cam: null,
  scene_graph: null,
  engine: null,
  shader_props: null,
  perf_clock: new THREE.Clock(),
  pixel_scale: Math.min(window.devicePixelRatio || 1, 0.8),
};

const glsl_fragment = `
  uniform vec3 u_screen;
  uniform float u_ticks;

  uniform float u_time_mul;
  uniform float u_light_fade;
  uniform float u_loop_limit;
  uniform vec4 u_chroma_shift;
  uniform float u_core_radius;
  uniform float u_advance_base;
  uniform float u_noise_freq;
  uniform float u_scatter;

  void main() {
    vec2 fc = gl_FragCoord.xy;
    vec4 acc = vec4(0.0);

    float depth = 0.0;
    float step_val = 0.0;
    float t_scaled = u_ticks * u_time_mul;

    vec3 ray_dir = normalize(vec3(fc * 2.0 - u_screen.xy, -u_screen.y));

    for (float k = 0.0; k < 250.0; k++) {
      if (k >= u_loop_limit) break;

      vec3 pos = depth * ray_dir;
      step_val = 1.0;

      for (int m = 0; m < 6; m++) {
        if (step_val > 8.9) break;

        vec3 shift = pos.yzx * step_val * u_noise_freq;
        shift += depth * 0.2;
        shift += t_scaled;

        pos += cos(shift) / step_val;
        step_val *= 1.4285714;
      }

      float len_xy = length(pos.xy);
      float core_diff = abs(u_core_radius - len_xy);
      step_val = u_advance_base + (core_diff * 0.1);
      depth += step_val;

      float scatter_factor = u_scatter / step_val;
      vec4 tint = cos(depth + u_chroma_shift) + 1.0;
      acc += (tint * scatter_factor) / u_light_fade;
    }

    gl_FragColor = acc;
  }
`;

const glsl_vertex = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

function initializeEngine() {
  ctx.scene_graph = new THREE.Scene();
  ctx.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  ctx.engine = new THREE.WebGLRenderer({ antialias: false });
  ctx.engine.setSize(window.innerWidth, window.innerHeight);
  ctx.engine.setPixelRatio(ctx.pixel_scale);
  document.body.appendChild(ctx.engine.domElement);

  ctx.shader_props = {
    u_ticks: { value: 0 },
    u_screen: {
      value: new THREE.Vector3(
        window.innerWidth * ctx.pixel_scale,
        window.innerHeight * ctx.pixel_scale,
        0.8,
      ),
    },
    u_time_mul: { value: 0.18 },
    u_light_fade: { value: 2600.0 },
    u_loop_limit: { value: 53.0 },
    u_chroma_shift: { value: new THREE.Vector4(6.3, 7.0, 3.6, 3.0) },
    u_core_radius: { value: 2.1 },
    u_advance_base: { value: 0.045 },
    u_noise_freq: { value: 0.7 },
    u_scatter: { value: 2.0 },
  };

  const material = new THREE.ShaderMaterial({
    fragmentShader: glsl_fragment,
    vertexShader: glsl_vertex,
    uniforms: ctx.shader_props,
    depthWrite: false,
    depthTest: false,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geometry, material);
  ctx.scene_graph.add(quad);

  window.addEventListener("resize", handleResize, false);
}

function handleResize() {
  ctx.engine.setSize(window.innerWidth, window.innerHeight);
  ctx.shader_props.u_screen.value.set(
    window.innerWidth * ctx.pixel_scale,
    window.innerHeight * ctx.pixel_scale,
    1,
  );
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  ctx.shader_props.u_ticks.value = ctx.perf_clock.getElapsedTime();
  ctx.engine.render(ctx.scene_graph, ctx.cam);
}

initializeEngine();
renderLoop();
