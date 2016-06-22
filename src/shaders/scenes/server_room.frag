#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float tmax = 20.0;

float hash(float n) {
	return fract(sin(n)*43758.5453);
}

float noise(float g) {
	float p = floor(g);
	float f = fract(g);

	return mix(hash(p), hash(p + 1.0), f);
}

vec3 hash(vec3 n) {
	vec3 x = vec3(
		dot(n, vec3(171.0, 311.0, 157.0)),
		dot(n, vec3(279.0, 382.0, 113.0)),
		dot(n, vec3(231.0, 400.0, 212.0))
	);
	return fract(sin(x)*43758.5453);
}

float voronoi(vec3 x) {
	vec3 p = floor(x);
	vec3 f = fract(x);

	vec2 res = vec2(8.0);

	for(int i = -1; i <= 1; i++)
	for(int j = -1; j <= 1; j++)
	for(int k = -1; k <= 1; k++) {
		vec3 g = vec3(float(i), float(j), float(k));
		vec3 r = g + hash(p + g) - f;

		float d = max(abs(r.x), max(abs(r.y), abs(r.z)));

		if(d < res.x) {
			res.y = res.x;
			res.x = d;
		} else if(d < res.y) {
			res.y = d;
		}
	}

	return res.y - res.x;
}

vec2 path(float z) {
	return vec2(cos(z/8.0)*sin(z/12.0)*12.0, 0.0);
}

float map(vec3 p) {
	vec4 q = vec4(p, 1.0);
	q.x += 1.0;

	for(int i = 0; i < 10; i++) {
		q.xyz = -1.0 + 2.0*fract(0.5 + 0.5*q.xyz);
		q = 1.3*q/max(dot(q.xyz, q.xyz), 0.1);
	}

	vec2 tun = abs(p.xy - path(p.z))*vec2(0.6, 0.5);

	return min(0.25*abs(q.y)/q.w, 1.0 - max(tun.x, tun.y));
}

float march(vec3 ro, vec3 rd) {
	float t = 0.0;

	for(int i = 0; i < 100; i++) {
		float d = map(ro + rd*t);
		if(d < 0.001*t || t >= tmax) break;
		t += d;
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

vec3 material(vec3 p) {
	float v = 0.0;
	float a = 0.7, f = 1.0;

	for(int i = 0; i < 4; i++) {
		float v1 = voronoi(p*f + 5.0);
		float v2 = 0.0;

		if(i > 0) {
			v2 = voronoi(p*f*0.1 + 50.0 + 0.15*time);

			float va = 0.0, vb = 0.0;
			va = 1.0 - smoothstep(0.0, 0.1, v1);
			vb = 1.0 - smoothstep(0.0, 0.08, v2);
			v += a*pow(va*(0.5 + vb), 4.0);
		}

		v1 = 1.0 - smoothstep(0.0, 1.0, v1);
		v2 =  a*noise(v1*5.5 + 0.1);

		v += v2;

		f *= 3.0;
		a *= 0.5;
	}

	return vec3(pow(v, 6.0), pow(v, 4.0), pow(v, 2.0))*2.0;
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

	vec3 ro = vec3(0.63*cos(time), 0.67, time);
	vec3 la = ro + vec3(0, 0, 0.3);

	ro.xy += path(ro.z);
	la.xy += path(la.z);
	vec3 rd = normalize(camera(ro, la)*vec3(uv, 1.97));

	float i = march(ro, rd);
	if(i < tmax) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);

		vec3 rig = ro + vec3(0, 0, 3);
		rig.xy += path(rig.z);
		vec3 key = normalize(pos - rig);

		col  = 0.1*vec3(0, 1, 1);
		col += 0.9*clamp(dot(key, nor), 0.0, 1.0)*vec3(1.0/max(1.0, i), 1, 1);
		col += 0.4*clamp(dot(-key, nor), 0.0, 1.0)*vec3(1.0/max(1.0, i), 1, 1);

		col *= material(pos);
	}

	col = mix(col, vec3(0), 1.0 - exp(-0.5*i));

	fragColor = vec4(col, 1);
}