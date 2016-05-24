#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float TMAX = 20.0;

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

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);
	
	p = mat2(c, s, -s, c)*p;
}

vec2 map(vec3 p) {
	vec3 q = p;
	rotate(p.xz, 0.1*time);
	float f = 0.0;

	if(length(p) - 1.0 <= 0.1 ) {
		f = smoothstep(0.0, 1.0, 100.0*smoothstep(0.5, 1.0, fbm(4.0*p)));
		f += smoothstep(0.0, 1.0, 10.0*smoothstep(0.5, 1.0, fbm(2.0*p + vec3(0, 0, time))));
	}

	vec2 d1 = vec2(length(p) - 1.0 - 0.01*f, 0.0);
	rotate(q.xz, 0.5*time);
	q.x -= 1.8;
	f = 0.0;

	if(length(q) - 0.3 <= 0.1) {
		f = fbm(5.0*q);
	}

	vec2 d2 = vec2(length(q) - 0.3 + 0.05*f, 1.0);
	
	return d1.x < d2.x ? d1 : d2;
}

vec2 intersect(vec3 ro, vec3 rd) {
	float td = 0.0;
	float mid = -1.0;
	
	for(int i = 0; i < 100; i++) {
		vec2 s = map(ro + rd*td);
		if(abs(s.x) < 0.001 || td >= TMAX) break;
		td += s.x*0.95;
		mid = s.y;
	}
	
	if(td >= TMAX) mid = -1.0;
	return vec2(td, mid);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy).x - map(p - h.xyy).x,
		map(p + h.yxy).x - map(p - h.yxy).x,
		map(p + h.yyx).x - map(p - h.yyx).x
	);
	
	return normalize(n);
}

vec3 earfColor(vec3 p) {
	float f = 0.0;
	vec3 col = vec3(0.2, 0.4, 0.8);
	rotate(p.xz, 0.1*time);
	
	f = smoothstep(0.5, 1.0, fbm(4.0*p));
	col = mix(col, vec3(0.2, 0.8, 0.4), smoothstep(0.0, 1.0, 100.0*f));
	
	f = smoothstep(0.5, 1.0, fbm(2.0*p + vec3(0, 0, time)));
	col = mix(col, vec3(0.8), smoothstep(0.0, 1.0, 10.0*f));
	
	return col;
}

vec3 moonColor(vec3 p) {
	
	vec3 col = vec3(0.2);
	rotate(p.xz, 0.5*time);
	p.x -= 1.8;
	float f = fbm(5.0*p);
	col *= f;
	
	return col;
}

mat3 camera(vec3 e, vec3 l) {
	vec3 f = normalize(l - e);
	vec3 r = cross(vec3(0, 1, 0), f);
	vec3 u = cross(f, r);
	
	return mat3(r, u, f);
}

void main() { 

	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x/resolution.y;
	
	float atime = time*0.3;
	vec3 ro = 2.5*vec3(cos(atime), 0, -sin(atime));
	vec3 rd = camera(ro, vec3(0))*normalize(vec3(uv, 2.0));
	
	vec3 col = vec3(1.0)*step(0.997, hash2(uv));
	
	vec2 i = intersect(ro, rd);
	
	if(i.y > -0.5) {
		col = vec3(0);
		vec3 lig = normalize(vec3(-1.0, 0, -0.2));
		vec3 pos = ro + rd*i.x;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		
		float dif = clamp(dot(lig, nor), 0.0, 1.0);
		float spe = pow(clamp(dot(ref, lig), 0.0, 1.0), 32.0);
        float fre = pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0);
		
		col =  0.01*vec3(1.0, 0.97, 0.85);
		col += 0.70*vec3(1.0, 0.97, 0.85)*dif;
		
		if(i.y == 0.0) {
			col *= earfColor(pos);
			col += 2.0*spe*vec3(1.0, 0.97, .1)*dif;
			col += 0.1*fre*vec3(1.0, 1.0, 1.0)*dif;
		} else {
			col *= moonColor(pos);
  		col += 0.1*fre*vec3(1.0, 1.0, 1.0);
		}
	}
	
	col = pow(col, vec3(0.454545));
	
	fragColor = vec4(col, 1);
}