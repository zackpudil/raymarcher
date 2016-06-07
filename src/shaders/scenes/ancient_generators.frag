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

	float x = mix(hash(n + 000.0), hash(n + 001.0), f.x);
	float y = mix(hash(n + 57.0), hash(n + 58.0), f.x);
	float z = mix(hash(n + 113.0), hash(n + 114.0), f.x);
	float w = mix(hash(n + 170.0), hash(n + 171.0), f.x);

	return mix(mix(x, y, f.y), mix(z, w, f.y), f.z);
}

const mat3 m3 = mat3(
	 0.00,  0.80,  0.60,
	-0.80,  0.36, -0.48,
	-0.60, -0.48,  0.64
);


float fbm(vec3 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= m3*2.01;
	f += 0.2500*noise(p); p *= m3*2.02;
	f += 0.1250*noise(p); p *= m3*2.04;
	f += 0.0625*noise(p);
	f /= 0.9375;

	return f;
}

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

float volume(vec3 p) {
	p.xz = mod(p.xz + 1.0, 2.0) - 1.0;
	float d = -(length(p.xz) - 0.05);

	return clamp(d + 0.01*fbm(20.0*p + vec3(0, 3.0*time, 0)), 0.0, 1.0);
}

vec4 volumetric(vec3 ro, vec3 rd, vec2 p, float mt) {
	float s = 0.05, t = 0.0;
	vec4 sum = vec4(0);

	t += 0.05*hash2(p);
	for(int i = 0; i < 100; i++) {
		if(sum.a > 2.0) continue;
		if(t >= mt) continue;

		float d = volume(ro + rd*t);

		vec4 v = vec4(mix(vec3(1.00, 0.97, 0.5), vec3(1.00),  d), d);
		v.rgb = mix(v.rgb, vec3(0), 1.0 - exp(-0.2*t));

		v.a *= 10.0;
		v.rgb *= v.a;
		sum += v*(1.0 - sum.a);

		t += s;
	}

	return clamp(sum, 0.0, 1.0);
}

float map(vec3 p) {
	vec3 op = p;
	p.y -= 2.5;
	p.xz = mod(p.xz + 1.0, 2.0) - 1.0;
	vec4 q = vec4(p, 1.0);
	for(int i = 0; i < 5; i++) {
		q.xyz = abs(q.xyz) - vec3(-0.1, 0.97, -0.1);
		q = 2.0*q/clamp(dot(q.xyz, q.yzx), 0.4, 1.0) - vec4(0.6, 1.0, 0.6, 0);
	}
	return min(length(q.xyz)/q.w - 0.1, min(op.y + 0.5, -op.y + 5.5));
}

float march(vec3 ro, vec3 rd) {
	float d = 1.0;
	float e, t = 0.0;

	for(int i = 0; i < 100; i++) {
		if(d < e || t >= tmax) break;
		d = map(ro + rd*t);
		e = 0.00005*(1.0 + t*1.0);
		t += d*0.5;
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

mat3 camera(vec3 eye, vec3 lat) {
	vec3 ww = normalize(lat - eye);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));

	return mat3(uu, vv, ww);
}

vec3 material(vec3 p) {
	p = abs(0.5 - fract(p*0.5));

	vec3 c = vec3(3);
	float es = 0.0, l = 0.0;

	for(int i = 0; i < 7; i++) {
		p = abs(p + c) - abs(p - c) - p;
		p /= clamp(dot(p, p), 0.0, 1.0);
		p = -1.5*p + c;
		if(mod(float(i), 2.0) < 1.0) {
			float pl = l;
			l = length(p);
			es += exp(-1.0/abs(l - pl));
		}
	}

	es = es*0.23 + 0.2;
	return mix(vec3(es, es*es, es*es*es), vec3(es), 0.3);
}

void main() {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;

	vec3 col = vec3(0);

	vec3 ro = vec3(cos(1.57*time), 2.1 + 2.0*sin(time*0.5), time);
	vec3 rd = normalize(camera(ro, ro + vec3(cos(1.57*time + 2.0), 2.0*sin(time*0.5 + 2.0), 3))*vec3(uv, 1.97));

	float i = march(ro, rd);

	if(i < tmax) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);

		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));

		col = clamp(dot(lig, nor), 0.0, 1.0)*vec3(1);
		col *= material(pos);

		col += 0.3*pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0);
	}

	vec4 vol = volumetric(ro, rd, uv, i);
	col = mix(col, vec3(0.0), 1.0 - exp(-0.5*i));
	col = mix(col, 2.0*vol.rgb, vol.a);
	col = pow(col, vec3(.454545));

	fragColor = vec4(col, 1);
}