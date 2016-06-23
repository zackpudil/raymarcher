#version 330 core

out vec4 fragColor;

uniform vec2 resolution;

uniform vec3 eye;
uniform mat3 camera;
uniform float fov;

const float tmax = 100.0;

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

vec4 orb;
float md = 0.6;
float fl = 1.0;

float map(vec3 p) {
	p.x -= 2.0;
	p.y += 0.8;
	p.z = mod(p.z + 1.0, 2.0) - 1.0;

	vec4 q = vec4(p, 1.0);
	vec4 o = q;

	orb = vec4(1000.0);

	for(int i = 0; i < 11; i++) {
		rotate(q.xy, 1.00);
		q.xyz = clamp(q.xyz, -fl, fl)*2.0 - q.xyz;
		float r = dot(q.xyz, q.xyz);
		q *= clamp(max(md/r, md), 0.0, 1.0);
		q = (3.0/md)*q - o;

		orb = min(orb, vec4(abs(q.xyz), r));
	}

	return (length(q.xyz) - 2.0)/q.w - pow(3.0, -10.0) - 0.01;
}

vec2 march(vec3 ro, vec3 rd) {
	float t = 0.0;
	float g = 0.0;

	for(int i = 0; i < 250; i++) {
		float d = map(ro + rd*t);
		if(d < 0.00007*(1.0 + 80.0*t) || t >= tmax) break;
		t += d*(0.25 + 0.1*t);

		g += 0.01;
	}

	return vec2(t, t >= tmax ? 0.0 : clamp(g, 0.0, 1.0));
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.0001, 0.0);
	vec3 n = vec3(
		map(p + h.xyy) - map(p - h.xyy),
		map(p + h.yxy) - map(p - h.yxy),
		map(p + h.yyx) - map(p - h.yyx)
	);
	return normalize(n);
}

float ao(vec3 p, vec3 n) {
	float s = 0.01, t = s;
	float o = 0.0, w = 1.0;

	for(int i = 0; i < 15; i++) {
		float d = map(p + n*t);

		o += (t - d)*w;
		w *= 0.95;

		t += s;
	}

	return 1.0 - clamp(o, 0.0, 1.0);
}

void main() {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;

	vec3 col = vec3(0);
	vec3 rd = normalize(camera*vec3(uv, fov));
	vec3 mat;

	vec2 i = march(eye, rd);
	if(i.x < tmax) {
		vec3 pos = eye + rd*i.x;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);

		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		vec3 gro = vec3(0, 1, 0);

		col  = 0.1*vec3(1);
		col += 0.9*clamp(dot(key, nor), 0.0, 1.0);
		col += 0.6*clamp(0.2 + 0.8*dot(-key, nor), 0.0, 1.0);
		col += 0.5*clamp(dot(gro, nor), 0.0, 1.0);

		mat = mix(vec3(1), vec3(0.3, 0.2, 0.2), clamp(2.0*(orb.x + orb.z), 0.0, 1.0));
		mat = mix(mat, vec3(0.5, 0.2, 0.3), clamp(0.5*orb.y, 0.0, 1.0));
		mat = mix(mat, vec3(0.2, 0.3, 0.5), orb.w);

		col *= mat;

		col += 0.3*pow(clamp(dot(key, ref), 0.0, 1.0), 16.0);
		col += 0.4*pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 2.0);


		col *= ao(pos, nor);
	}

	col += vec3(pow(abs(i.y), 5.0))*vec3(1.00, 0.97, 0.3)*0.5;
	col = mix(col, vec3(1), 1.0 - exp(-0.1*i.x));
	col = sqrt(col);

	fragColor = vec4(col, 1);
}