#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#define PI 3.14159

float hash(float n) {
  return fract(sin(n)*43758.5453);
}

float hash2(vec2 n) {
    return fract(sin(dot(n, vec2(12.989, 71.233)))*43758.5453);
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  
  f = f*f*(3.0 - 2.0*f);
  float n = p.x + p.y*57.0 + p.z*113.0;
  
  return mix(
    mix(
      mix(hash(n + 000.0), hash(n + 001.0), f.x),
      mix(hash(n + 57.0), hash(n + 58.0), f.x),
      f.y),
    mix(
      mix(hash(n + 113.0), hash(n + 114.0), f.x),
      mix(hash(n + 170.0), hash(n + 171.0), f.x),
      f.y),
    f.z);
}

float fbm(vec3 p) {
  float f = 0.0;
  
  f += 0.5000*noise(p); p *= 2.03;
  f += 0.2500*noise(p); p *= 2.04;
  f += 0.1250*noise(p); p *= 2.01;
  f += 0.0625*noise(p);
  f /= 0.9375;
  
  return f;
}

float smin(float a, float b, float k) {
  float res = exp(-a*k) + exp(-b*k);
  
  return -log(res)/k;
}

float volume(vec3 p) {
  float d = -p.y - 1.2;
  d += 1.0*fbm(2.0*p + 0.2*time);

  return clamp(d, 0.0, 1.0);
}

vec4 volumetric(vec3 ro, vec3 rd, float md, vec2 p) {
  float s = 0.05, t = 0.0;
  vec4 sum = vec4(0);
  
  t += 0.1*hash2(p);
  
  for(int i = 0; i < 100; i++) {
    if(sum.a > 0.99) continue;
    if(t > md) break;
    float d = volume(ro + rd*t);
    
    vec4 vol = vec4(mix(vec3(0.7), vec3(1.0), d), d);
    vol.rgb = mix(vol.rgb, vec3(0), 1.0 - exp(-0.6*t));
    
    vol.a *= 0.3;
    vol.rgb *= vol.a;
    sum += vol*(1.0 - sum.a);
    
    t += s;
  }
  
  return clamp(sum, 0.0, 1.0);
}

float map(vec3 p) {
  vec3 q = p;
  
  q.z += 30.0;
  q = q + noise(q);
  float n = dot(cos(q*PI/2.0), sin(q.yzx*PI/2.0));
  float s =  .45 - .45*n + 0.1*fbm(10.0*p) - 0.2*smoothstep(0.1, 1.0, noise(3.0*p))*fbm(50.0*p);
  
  return smin(p.y + 1.2, s, 10.0);
}

float march(vec3 ro, vec3 rd) {
  float t = 0.0;
  
  for(int i = 0; i < 75; i++) {
    float h = map(ro + rd*t);
    if(abs(h) < 0.001 || t >= 10.0) break;
    t += h*0.75;
  }
  
  return t;
}

vec3 normal(vec3 p) {
  vec2 h = vec2(0.001, 0.0);
  vec3 n = vec3(
    map(p + h.xyy) - map(p - h.xyy),
    map(p + h.yxy) - map(p - h.yxy),
    map(p + h.yyx) - map(p - h.yyx)
  );
  
  return normalize(n);
}

float ao(vec3 p, vec3 n) {
  float s = 0.005;
  float t = s;
  
  float o = 0.0;
  float w = 1.0;
  
  for(int i = 0; i < 15; i++) {
    float h = map(p + n*t);
    
    o += (t - h)*w;
    w *= 0.95;
    
    t += s;
  }
  
  return 1.0 - clamp(o, 0.0, 1.0);
}

mat3 camera(vec3 eye, vec3 lat) {
  vec3 ww = normalize(lat - eye);
  vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
  vec3 vv = normalize(cross(ww, uu));
  
  return mat3(uu, vv, ww);
}

void main() {
  vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
  uv.x *= resolution.x/resolution.y;
    
  vec3 col = vec3(0);
  
  vec3 ro = vec3(time*0.4, -0.4 - 0.01*sin(9.0*time), -4.0);
    float x = smoothstep(-1.0, 1.0, 2.0*cos(time))*sign(cos(0.5*time));
  vec3 rd = normalize(camera(ro, ro + vec3(1.0, 0, x))*vec3(uv, 1.97));
  
  float i = march(ro, rd);
  
  if(i < 10.0) {
    vec3 pos = ro + rd*i;
    vec3 nor = normal(pos);
    
    vec3 rig = vec3(0, .5, 0);
    vec3 lig = normalize(pos - rig);
    
    col  = 0.3*vec3(1);
    col += 0.8*clamp(dot(lig, nor), 0.0, 1.0)*vec3(1);
    
    vec3 mat = mix(vec3(0.62, 0.32, 0.17), vec3(0.0), fbm(10.0*pos*vec3(1.77, 0, 2.0)));
    mat = mix(mat, vec3(0.2, 0.52, 0.2), smoothstep(0.1, 1.0, noise(3.0*pos)));
    
    col *= mat;
    col *= ao(pos, nor);
  }
  
  vec4 vol = volumetric(ro, rd, i, uv);
  col = mix(col, vec3(0), 1.0 - exp(-0.39*i));
  col = mix(col, vol.rgb, vol.a);
  col = pow(col, vec3(.454545));
  
  fragColor = vec4(col, 1);
}