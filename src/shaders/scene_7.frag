#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

float hash(vec2 n) {
	return fract(sin(dot(n, vec2(12.988, 71.233)))*43758.5453);
}

float hash(float n) {
	return fract(sin(n)*43758.5453);
}

float noise(vec2 c) {
	vec2 p = floor(c);
	vec2 f = fract(c);

	f = f*f*(3.0 - 2.0*f);
	float n = p.x + p.y*57;

	float x = mix(hash(n + 0), hash(n + 1), f.x);
	float y = mix(hash(n + 57), hash(n + 58), f.x);
	return mix(x, y, f.y);
}

float noise(vec3 c) {
	vec3 p = floor(c);
	vec3 f = fract(c);

	f = f*f*f*(10 - 15*f + 6*f*f);
	float n = p.x + p.y*57 + p.z*113;

	float x = mix(hash(n + 0), hash(n + 1), f.x);
	float y = mix(hash(n + 57), hash(n + 58), f.x);
	float z = mix(hash(n + 113), hash(n + 114), f.x);
	float w = mix(hash(n + 170), hash(n + 171), f.x);

	return mix(mix(x, y, f.y), mix(z, w, f.y), f.z);
}

float fbm(vec3 p) {
	float f = 0.0;

	f += 0.5000*noise(p); p *= 2.01;
	f += 0.2500*noise(p); p *= 2.03;
	f += 0.1250*noise(p); p *= 2.05;
	f += 0.0625*noise(p);
	f /= 0.9375;

	return f;
}

float volume(vec3 p) {
	vec3 q = p;
	q.y = smoothstep(0.0, 1.0, p.y);
	float d = -(length(q) - 1.0);
	d = clamp(d + 2.0*fbm(p + time*0.3), 0, 1);

	return d;
}

vec4 volumetric(vec3 ro, vec3 rd, vec2 p) {
	float s = 0.05, t = 0;
	vec4 sum = vec4(0);

	t += 0.05*hash(p);

	for(int i = 0; i < 200; i++) {
		if(sum.a > 0.99) break;
		vec3 p = ro + rd*t;
		float d = volume(p);

		vec4 vol = vec4(mix(vec3(1.0), vec3(0.3), d), d);
		vol.rgb *= vec3(noise(p), noise(cos(p)), noise(sin(p)));

		vol.a *= 0.3;
		vol.rgb *= vol.a;
		sum += vol*(1 - sum.a);

		t += s;
	}

	return clamp(sum, 0, 1);
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

	vec3 col = vec3(1)*step(0.995, hash(uv));

	float a = time*0.3;
	vec3 ro = 3.0*vec3(sin(a*0.3), a/3.0, -cos(a));
	vec3 rd = normalize(camera(ro, vec3(0, a, 0))*vec3(uv, 1.97));

	vec4 vol = volumetric(ro, rd, uv);
	col = mix(col, smoothstep(0.0, 1.0, vol.rgb), vol.a);

	fragColor = vec4(col, 1);
}