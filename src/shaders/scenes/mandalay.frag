#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

uniform vec3 eye;
uniform mat3 camera;
uniform float fov;

const float tmax = 100.0;

float fold(vec3 p, float fo, float g) {
	if(p.z>p.y) p.yz = p.zy;

	vec2 v = p.xy - vec2(2, 4)*fo;

	float f = abs(max(v.x, v.y) + fo) - fo;
	f = min(f, max(v.x - g, p.y));

	return min(f, max(v.x + g, 2.0*fo - p.y));
}

void fold(inout vec3 p, vec3 fo, vec3 g) {
	vec3 q = p;
	p.x = fold(q, fo.x, g.x);
	p.y = fold(q.yzx, fo.y, g.y);
	p.z = fold(q.zxy, fo.z, g.z);
}

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

float cylinder(vec3 p, vec2 h) {
	vec2 d = abs(vec2(length(p.xy), p.z)) - h;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float mr = 0.25;
float de(vec3 p) {
	vec4 q = vec4(p, 1);
	vec4 o = q;

	float hack = time;
	float d = 10000.0;

	for(int i = 0; i < 5; i++) {
		q.xyz = abs(q.xyz);
		fold(q.xyz, vec3(3), vec3(3));

		q *= clamp(1.0/dot(q.xyz, q.xyz), 1.0, 1.0/mr);
		q = q*(3.0) + o;

		d = min(d, (length(q.xz))/q.w);
	}

	return d - 0.01;
}

void main() {
	vec2 p = -2.0 + 4.0*(gl_FragCoord.xy/resolution);
	p.x *= resolution.x/resolution.y;

	vec3 rd = normalize(camera*vec3(p, fov));

	float t = 0.0;
	for(int i = 0; i < 300; i++) {
		float d = de(eye + rd*t);
		if(abs(d) < 0.001*t || t >= tmax) break;
		t += d*0.75;
	}

	vec3 col = vec3(0);

	if(t < tmax) {
		vec3 pos = eye + rd*t;
		vec2 h = vec2(0.001, 0.0);
		vec3 nor = normalize(vec3(
			de(pos + h.xyy) - de(pos - h.xyy),
			de(pos + h.yxy) - de(pos - h.yxy),
			de(pos + h.yyx) - de(pos - h.yyx)
		));

		float s = 0.01;
		float o = 0.0;
		for(int i = 0; i < 10; i++) {
			float d = de(pos + nor*s);
			o += (s - d);
			s += 0.01;
		}

		col = vec3(1.0 - clamp(o, 0.0, 1.0));
	}

	col = mix(col, vec3(0), 1.0 - exp(-0.4*t));
	col = pow(col, vec3(.454545));

	fragColor = vec4(col, 1);
}