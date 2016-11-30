#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

uniform vec3 eye;
uniform mat3 camera;
uniform float fov;

float hash(float n) {
  return fract(sin(n)*43578.5453);
}

float noise(float g) {
  float p = floor(g);
  float f = fract(g);

  f = f*f*(3.0 - 2.0*f);

  return mix(hash(p), hash(p + 1.0), f);
}

float noise(vec3 g) {
  vec3 p = floor(g);
  vec3 f = fract(g);

  f = f*f*(3.0 - 2.0*f);
  float n = p.x + p.y*57.0 + p.z*113.0;

  float x = mix(hash(n), hash(n + 1.0), f.x);
  float y = mix(hash(n + 57.0), hash(n + 58.0), f.x);
  float z = mix(hash(n + 113.0), hash(n + 114.0), f.x);
  float w = mix(hash(n + 170.0), hash(n + 171.0), f.x);

  return mix(mix(x, y, f.y), mix(z, w, f.y), f.z);
}

float fbm(vec3 p) {
  float f = 0.0;

  f += 0.5000*noise(p); p *= 2.02;
  f += 0.2500*noise(p); p *= 2.04;
  f += 0.1250*noise(p); p *= 2.03;
  f += 0.0625*noise(p); p *= 2.01;
  f /= 0.9375;

  return f;
}

float fbm(float p) {
  float f = 0.0;

  f += 0.5000*noise(p); p *= 2.02;
  f += 0.2500*noise(p); p *= 2.04;
  f += 0.1250*noise(p); p *= 2.03;
  f += 0.0625*noise(p); p *= 2.01;
  f /= 0.9375;

  return f;
}

void rotate(inout vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  
  p = mat2(c, s, -s, c)*p;
}

vec2 spiral(vec3 p) {
  vec3 op = p;
  p.xz = abs(p.xz) - (2.2);
  rotate(p.xz, 10.0*(p.y + time));
  p.xz -= 0.1;

  float f = length(max(abs(p.xz) - 0.1, 0.0));

  return vec2(f, 2.0);
}

vec2 water(vec3 p) {
  return vec2(p.y + 1.0, 1.0);
}

vec2 ceiling(vec3 p) {
  return vec2(-p.y + 4.0, 3.0);
}

vec2 kali(vec3 p) {
  vec4 q = vec4(p, 1);
  q.xyz -= vec3(1.0, 2.0, 1.0);

  for(int i = 0; i < 3; i++) {
    q.xyz = abs(q.xyz + 1.0) - 1.0;
    q /= clamp(dot(q.xyz, q.xyz), 0.5, 1.0);
    q *= 1.2;

    rotate(q.xy, 0.1);
    rotate(q.zy, 0.1);
  }

  return vec2((length(q.xz) - 1.5)/q.w, 0.0);
}

vec2 smin(vec2 a, vec2 b, float r) {
  vec2 u = max(vec2(r - a.x, r - b.x), vec2(0));
  float s = max(r, min(a.x, b.x)) - length(u);

  return vec2(s, a.x < b.x ? a.y : b.y);
}

vec2 dmin(vec2 a, vec2 b) {
  if(a.x < b.x) return a;
  return b;
}


vec2 de(vec3 p) {
  p.xz = mod(p.xz + 4.0, 8.0) - 4.0;

  vec2 f = smin(water(p), spiral(p), 2.0);
  f = dmin(f, kali(p));
  f = smin(f, ceiling(p), 1.0);

  return f;
}

vec2 trace(vec3 ro, vec3 rd, float mx) {
  float t = 0.0;
  float m = -1.0;
  
  for(int i = 0; i < 200; i++) {
    vec2 d = de(ro + rd*t);
    if(d.x < 0.0001*t || t >= mx) break;
    t += d.x*0.5;
    m = d.y;
  }
  
  return vec2(t, m);
}

vec3 normal(vec3 p) {
  vec2 h = vec2(0.001, 0.0);
  vec3 n = vec3(
    de(p + h.xyy).x - de(p - h.xyy).x,
    de(p + h.yxy).x - de(p - h.yxy).x,
    de(p + h.yyx).x - de(p - h.yyx).x
  );

  vec3 b = vec3(0);
  float id = de(p).y;

  if(id == 1.0) {
    p.xz += time + time*noise(p);
    float f = 1.0;
    b = 0.3*vec3(
      fbm(f*(p + h.xyy)) - fbm(f*(p - h.xyy)),
      fbm(f*(p + h.yxy)) - fbm(f*(p - h.yxy)),
      fbm(f*(p + h.yyx)) - fbm(f*(p - h.yyx))
    );
  } else if(id == 2.0) {
    float f = 4.0;
    b = 0.1*vec3(
      fbm(f*(p + h.xyy)) - fbm(f*(p - h.xyy)),
      fbm(f*(p + h.yxy)) - fbm(f*(p - h.yxy)),
      fbm(f*(p + h.yyx)) - fbm(f*(p - h.yyx))
    );
  }

  return normalize(n + b);
}

float edge(vec3 p, float c, float s) {
  float d = de(p).x;

  vec2 h = vec2(0.001, 0.0);
  vec3 n1 = vec3(de(p + h.xyy).x, de(p + h.yxy).x, de(p + h.yyx).x);
  vec3 n2 = vec3(de(p - h.xyy).x, de(p - h.yxy).x, de(p - h.yyx).x);

  vec3 v = abs(d - 0.5*(n1 + n2));
  return min(1.0, pow(v.x+v.y+v.z, c)*s);
}

float ao(vec3 p, vec3 n) {
  float o = 0.0, s = 0.005;
  for(int i = 0; i < 15; i++) {
    float d = de(p + n*s).x;
    o += (s - d);
    s += s/float(i + 1);
  }
  return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 render(vec3 ro, vec3 rd) {
  vec3 col = vec3(0);
  
  vec2 t = trace(ro, rd, 50.0);
  if(t.x < 50.0) {
    vec3 key = normalize(vec3(0.8, 0.7, -0.6));
    
    vec3 pos = ro + rd*t.x;
    vec3 nor = normal(pos);
    vec3 ref = reflect(rd, nor);
    
    float occ = ao(pos, nor);
    float dom = step(2.0, trace(pos + nor*0.001, ref, 2.0).x);

    col += 0.5*occ;
    col += pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0)*dom;
    col += pow(clamp(dot(-rd, nor), 0.0, 1.0), 8.0)*occ;
    
    float id = t.y;
    if(id == 1.0) {
      col *= vec3(0.2, 0.4, 1.0);
    } else {
      col += vec3(0.04, 0.15, 0.35)*(1.0 - occ);
    }
  }

  col = mix(col, vec3(0), 1.0 - exp(-0.3*t.x));
  return col;
}

void main( void ) {
  float hack = time;
  vec2 uv = (-resolution + 2.0*gl_FragCoord.xy)/resolution.y;
  
  vec3 ro = vec3(0, 0, -3) + eye;
  vec3 rd = normalize(camera*vec3(uv, fov));
  
  vec3 col = render(ro, rd);
  
  col = 1.0 - exp(-0.4*col);
  col = pow(abs(col), vec3(1.0/2.2));
  
  fragColor = vec4(col, 1);
}