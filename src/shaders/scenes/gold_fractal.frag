#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float tmax = 20.0;

float map(vec3 p) {
	p.xz = mod(p.xz + 1.0, 2.0) - 1.0;
	vec4 q = vec4(p, 1);
	for(int i = 0; i < 15; i++) {
		q.xyz = abs(q.xyz) - vec3(-0.02, 1.07, -0.02);
		q = 2.0*q/clamp(dot(q.xyz, q.xyz), 0.4, 1.0) - vec4(1.0, 0.0, 0.6, 0.0);
	}

	return length(q.xyz)/q.w;
}

float march(vec3 ro, vec3 rd) {
	float d = 1.0, e = 0.0, t = 0.0;

	for(int i = 0; i < 70; i++) {
		if(d < e || t >= tmax) break;
		d = map(ro + rd*t);
		e = 0.0001*(1.0 + t*0.8);
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

mat3 camera(vec3 eye, vec3 lat) {
	vec3 ww = normalize(lat - eye);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));

	return mat3(uu, vv, ww);
}

void main() {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;

	vec3 col = vec3(1.0);

	vec3 ro = vec3(-(time + 1.0)*0.05, sin((time + 1.0)*0.05), -0.6);
	vec3 rd = normalize(camera(ro, ro + vec3(0, 0, 1))*vec3(uv, 1.97));

	float i = march(ro, rd);
	if(i < tmax) {
		vec3 pos = ro + rd*i;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		vec3 lig = normalize(vec3(0.8, 0.7, -0.6));

		col = clamp(dot(lig, nor), 0.0, 1.0)*vec3(1.00, 0.97, 0.40);
		col += 0.7*pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0)*vec3(1.00, 0.97, 0.40)/(0.5*i);
	}

	col = mix(col, vec3(1.0), 1.0 - exp(-0.8*i));
	col = pow(col, vec3(.454545));

	fragColor = vec4(col, 1);
}