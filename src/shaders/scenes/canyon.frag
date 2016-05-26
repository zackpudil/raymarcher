#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float tmax = 20.0;

float hash2(vec2 n) {
	return fract(sin(dot(n, vec2(12.988, 71.233)))*43758.5453);
}

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

const mat2 m2 = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm(vec2 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= m2*2.01;
	f += 0.2500*noise(p); p *= m2*2.04;
	f += 0.1250*noise(p); p *= m2*2.07;
	f += 0.0625*noise(p);

	return f;
}

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float fbm(vec3 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= m3*2.01;
	f += 0.2500*noise(p); p *= m3*2.04;
	f += 0.1250*noise(p); p *= m3*2.07;
	f += 0.0625*noise(p);

	return f;
}

float len(vec3 p, float l) {
	p = pow(abs(p), vec3(l));
	return pow(p.x + p.y + p.z, 1.0/l);
}

vec2 segment(vec3 p, vec3 a, vec3 b) {
	vec3 pa = p - a;
	vec3 ba = b - a;

	float h = clamp(dot(pa, ba)/dot(ba, ba), 0, 1);

	return vec2(length(pa - ba*h), h);
}

float smin(float a, float b, float k) {
	float res = exp(-k*a) + exp(-k*b);
	return -log(res)/k;
}

float map(vec3 p) {
	return p.y + 1.0  
		- 0.1*smoothstep(0.5, 1.0, noise(p))*fbm(70.0*p) //grass
		- smoothstep(0.4, 0.7, fbm(2.0*p.xz)) // mountains
		- 0.8*noise(p); // hills
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;

	for(int i = 0; i < 400; i++) {
		float d = map(ro + rd*t);
		if(abs(d) < 0.001 || t >= tmax) return t;
		t += d*0.1;
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

	float f = 10.0;
	vec3 b = vec3(
		fbm(f*(p + h.xyy)) - fbm(f*(p - h.xyy)),
		fbm(f*(p + h.yxy)) - fbm(f*(p - h.yxy)),
		fbm(f*(p + h.yyx)) - fbm(f*(p - h.yyx))
	);
	return normalize(n + 0.1*b);
}

float ao(vec3 p, vec3 n) {
	float s = 0.006, t = s;
	float o = 0.0, w = 1.0;

	for(int i = 0; i < 25; i++) {
		float d = map(p + n*t);
		o += (t - d)*w;
		w *= 0.90;
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

	vec3 ro = vec3(0, 1.0 - 0.25*cos(time*0.5), time);
	float g = smoothstep(-1.0, 1.0, 2.0*cos(time))*sign(cos(0.5*time));
	vec3 rd = normalize(camera(ro, ro + vec3(5.0*g, -0.75, 3))*vec3(uv, 1.97));

	vec3 col = vec3(0.2, 0.6, 1.0);

	float i = march(ro, rd);

	if(i < tmax) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);

		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));
		vec3 gli = normalize(vec3(0, -1.0, 0.0));

		col  = 0.2*vec3(1);
		col += 0.7*clamp(dot(lig, nor), 0, 1);
		col += 0.1*clamp(dot(gli, nor), 0, 1);

		col *= mix(
			mix(vec3(0.59, 0.31, 0.1), vec3(0.33, 0.2, 0.0), fbm(3.0*pos)), 
			vec3(0.1, 0.4, 0.1), smoothstep(0, 1, 2.0*smoothstep(0.6, 1, noise(pos))));

		col += 0.2*pow(clamp(1.0 + dot(rd, nor), 0, 1), 2);

		col *= vec3(ao(pos, nor));

		col = mix(col, vec3(0.5), 1.0 - exp(-0.2*i));
	}

	fragColor = vec4(col, 1);
}