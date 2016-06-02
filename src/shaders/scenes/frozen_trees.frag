#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float tmax = 50.0;

float hash(float n) {
	return fract(sin(n)*43758.5453);
}

float noise(vec3 g) {
	vec3 p = floor(g);
	vec3 f = fract(g);

	f = f*f*(3.0 - 2.0*f);
	float n = p.x + p.y*57.0 + p.z*113.0;

	float x = mix(hash(n + 0), hash(n + 1), f.x);
	float y = mix(hash(n + 57), hash(n + 58), f.x);
	float z = mix(hash(n + 113), hash(n + 114), f.x);
	float w = mix(hash(n + 170), hash(n + 171), f.x);

	return mix(mix(x, y, f.y), mix(z, w, f.y), f.z);
}

float noise(vec2 g) {
	vec2 p = floor(g);
	vec2 f = fract(g);

	f = f*f*(3.0 - 2.0*f);
	float n = p.x + p.y*57.0;

	float x = mix(hash(n + 0), hash(n + 1), f.x);
	float y = mix(hash(n + 57), hash(n + 58), f.x);
	return mix(x, y, f.y);
}

const mat2 m2 = mat2(
	 0.80, 0.60, -0.80, -0.60
);

float fbm(vec2 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= m2*2.01;
	f += 0.2500*noise(p); p *= m2*2.03;
	f += 0.1250*noise(p); p *= m2*2.05;
	f += 0.0625*noise(p);
	f /= 0.9375;

	return f;
}

const mat3 m3 = mat3(
	 0.00,  0.80,  0.60,
	-0.80,  0.36, -0.48,
	-0.60, -0.48,  0.64
);

float fbm(vec3 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= 2.01;
	f += 0.2500*noise(p); p *= 2.03;
	f += 0.1250*noise(p); p *= 2.05;
	f += 0.0625*noise(p);
	f /= 0.9375;

	return f;
}

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

float smin(float a, float b, float k) {
	float res = exp(-k*a) + exp(-k*b);
	return -log(res)/k;
}

float segment(vec3 p, vec3 a, vec3 b) {
	vec3 pa = p - a;
	vec3 ba = b - a;

	float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);

	return length(pa - ba*h);
}

float map(vec3 p) {
	vec3 q = p;

	p.y -= 2.0*noise(0.15*q);

	p.z = mod(p.z + 6.0, 12.0) - 6.0;
	p.x = mod(p.x + 12.0, 24.0) - 12.0;

	rotate(p.xy, 0.1*noise(p.xz));
	rotate(p.yz, 0.2*noise(p.xz));

	float g = smoothstep(1.0, 5.0, p.y);
	float s = smoothstep(-10.0, 0.0, -p.y);
	p.xz = -abs(p.xz) + g*s*0.5*p.y;

	p.xz += vec2(g*s*0.5*p.y);
	g = smoothstep(2.0, 7.0, p.y);
	s = smoothstep(-10.0, 2.0, -p.y);
	p.xz = -abs(p.xz) + g*s*0.5*p.y;

	p.xz += vec2(g*s*0.5*p.y);
	g = smoothstep(3.0, 10.0, p.y);
	s = smoothstep(-30.0, 1.0, -p.y);
	p.xz = -abs(p.xz) + g*s*0.5*p.y;

	return min(
		segment(p, vec3(0, -3, 0), vec3(0, 5.5, 0)) - 0.5 
			+ 0.20*smoothstep(1.0, 5.0, p.y) 
			+ 0.25*smoothstep(2.0, 7.0, p.y)
			+ 0.35*smoothstep(3.0, 10.0, p.y),
		q.y + 1.0 - 2.0*noise(0.15*q));
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;

	for(int i = 0; i < 400; i++) {
		float d = map(ro + rd*t);
		if(abs(d) < 0.0001 || t >= tmax) break;
		t += d*0.25;
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

	vec3 b = vec3(0);
	if(p.y + 1.0 - 2.0*noise(0.15*p) > 0.1) {
		vec3 f = vec3(10.0, 0.3, 10.0);

		b += 0.2*vec3(
			fbm(p*f + h.xyy) - fbm(p*f - h.xyy),
			fbm(p*f + h.yxy) - fbm(p*f - h.yxy),
			fbm(p*f + h.yyx) - fbm(p*f - h.yyx)
		);
	} else {
		float f = 2.0;
		b += 0.1*vec3(
			fbm(f*(p + h.xyy)) - fbm(f*(p - h.xyy)),
			fbm(f*(p + h.yxy)) - fbm(f*(p - h.yxy)),
			fbm(f*(p + h.yyx)) - fbm(f*(p - h.yyx))
		);
	}

	return normalize(n + b);
}

float shadow(vec3 p, vec3 l) {
	float res = 1.0;
	float t = 0.01;

	for(int i = 0; i < 300; i++) {
		float d = map(p + l*t);
		t += d*0.30;
		res = min(res, 32.0*d/t);
		if(abs(d) < 0.0 || t >= tmax) break;
	}

	return clamp(res, 0.0, 1.0);
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

	vec3 col = mix(vec3(0.0, 0.6, 1.0), vec3(1), smoothstep(0.4, 1.0, fbm(3.0*uv)));

	vec3 ro = vec3(10.0, 5.0, time);
	vec3 rd = normalize(camera(ro, ro + vec3(-15.0, -3.0, 3))*vec3(uv, 1.97));

	float i = march(ro, rd);
	if(i < tmax) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);

		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));
		float sha = shadow(pos, lig);
		float dif = clamp(dot(lig, nor), 0.0, 1.0)*sha;

		col  = 0.2*vec3(1);
		col += 0.7*dif;

		if(pos.y + 1.0 - 2.0*noise(0.15*pos) > 0.1) {
			col *= vec3(0.6, 0.5, 0.2);
		} else {
			vec3 mat = vec3(0.1, 0.4, 0.1);
			mat = mix(mat, vec3(2.0), smoothstep(0.0, 1.0, 2.0*smoothstep(0.4, 1.0, fbm(1.0*pos))));
			col *= mat;
		}

		col += 0.9*pow(clamp(dot(lig, ref), 0.0, 1.0), 2.0)*dif;
		col += 0.9*pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0)*sha;
	}

	fragColor = vec4(col, 1);
}