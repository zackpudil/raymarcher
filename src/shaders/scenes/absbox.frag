#version 330 core

out vec4 fragColor;

uniform float time;
uniform vec2 resolution;

uniform vec3 eye;
uniform mat3 camera;
uniform float fov;

vec2 res = resolution;
vec3 key = vec3(3, 1, -1);

float hack = time;

float hash(float n) {
	return fract(sin(n)*43758.54543);
}

float hash(vec2 n) {
	return hash(dot(n, vec2(12.232, 93.343)));
}

void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

float box(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float box(vec2 p, vec2 b) {
	vec2 d = abs(p) - b;
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.));
}

float mixTime(float t) {
		float g = mod(t, 4.0);
		if(g <= 1.0) return fract(t);
		else if(g > 1.0 && g <= 2.0) return 1.0;
		else if(g > 2.0 && g <= 3.0) return 1.0 - fract(t);
		
		return 0.0;
}

float maze(vec3 p) {
	vec2 t = floor(p.xz);
	p.xz = fract(p.xz) - 0.5;
	p.x *= 2.0*floor(fract(hash(t))*1.8) - 1.0;

	float d = abs(1.0 - 2.0*abs(dot(p.xz, vec2(1.0))))/(2.0*sqrt(5.0));
	d = max(d - 0.4/4.0, p.y - 0.2);
	d = max(d, -p.y - 0.4);

	return d;
}

float de(vec3 p) {
	vec3 op = p;

	p.xz = abs(p.xz + 2.0) - 2.0;
	vec4 qc = vec4(p, 1);
	qc.xyz -= vec3(1.0, 1.6, 1.0);

	for(int i = 0; i < 5; i++) {
		qc.xyz = abs(qc.xyz + 1.0) - 1.0;
		qc /= clamp(dot(qc.xyz, qc.xyz), 0.25, 1.0);
		qc = 1.1*qc;
	}

	float b = box(p.xy-vec2(0, 0.70), vec2(0.35, 0.35));
	b = min(b, box(p.zy-vec2(0, 0.70), vec2(0.35, 0.35)));
	b = min(b, box(p.xz, vec2(0.35, 0.35)));

	float fc = (length(qc.xyz) - 1.5)/qc.w;
	fc = max(-b, fc);

	op.xz = -abs(op.xz + 2.0) + 2.0;
	if(op.z > op.x) op.xz = op.zx;

	float a = box(op.zy - vec2(0, 0.70), vec2(0.35));
	fc = min(fc, a);
	fc = min(fc, maze(op));

	return fc;
}

float trace(vec3 ro, vec3 rd, float mx) {
    float t = 0.0;
    
    for(int i = 0; i < 200; i++) {
        float d = de(ro + rd*t);
        if(d < 0.001*t || t >= mx) break;
        t += d*0.5;
    }

    return t < mx ? t : -1.0;
}

vec3 normal(vec3 p, inout float e) {
    vec2 h = vec2(0.001, 0.0);
	vec3 n1 = vec3(de(p + h.xyy), de(p + h.yxy), de(p + h.yyx));
	vec3 n2 = vec3(de(p - h.xyy), de(p - h.yxy), de(p - h.yyx));

	vec3 v = abs(de(p) - 0.5*(n1 + n2));
	e = min(1.0, pow(v.x+v.y+v.z, 0.95)*10.0);

    return normalize(n1 - n2);
}


float ao(vec3 p, vec3 n) {
    float o = 0.0, s = 0.006, w = 1.0;
    for(int i = 0; i < 15; i++) {
        float d = de(p + n*s);
        o += (s - d)*w;
	w *= 0.96;
        s += s/(float(i) + 1.0);
    }
    return 1.0 - clamp(o, 0.0, 1.0);
}

vec3 color(vec3 ro, vec3 rd, float t) {
	vec3 col = vec3(0);
    
	if(t < 0.0) return col;

	vec3 pos = ro + rd*t;
	float edg;
	vec3 nor = normal(pos, edg);
	vec3 ref = reflect(rd, nor);

	vec3 lig = normalize(key - pos);
	float dis = length(key - pos) - 0.31;

	float occ = ao(pos, nor);
	float dom = step(0.0, -trace(pos + nor*0.001, ref, 1.0));

	col += 0.1*occ;
	col += dom*occ*pow(clamp(1.0 + dot(rd, nor), 0.0, 2.0), 0.5);
	col += vec3(50.0, 0.2, 0.2)*edg;

	return col;
}

const float aa = 6.0; 
vec3 render(vec2 uv) {
	float hack0 = fov;
	vec3 hack1 = eye;
	mat3 hack2 = camera;

	vec3 ro = eye + vec3(0, 0, 3);
	vec3 rd = normalize(camera*vec3(uv, fov));

	// float time = 0.5*time;
	// vec3 ro = 1.5*vec3(1.3*cos(time), 2.1/1.6, -1.3*sin(time));
	// vec3 ww = normalize(vec3(0, 0.5, 0)-ro);
	// vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	// vec3 vv = normalize(cross(ww, uu));
	// vec3 rd = normalize(camera*vec3(uv, fov));

	vec2 of = vec2(2.0/(5.0*res.y));

	float t = trace(ro, rd, 60.0);
	vec3 col = color(ro, rd, t)/aa;

	for(float i = 0.0; i < (aa - 1.0); i++) {
		uv = uv + of;
		vec3 rd = normalize(camera*vec3(uv, fov));
		t = trace(ro, rd, 60.0);
		col += color(ro, rd, t)/aa;

		of = rotate(of, 3.14159/4.0);
	}

	return col;
}

void main() {
	vec2 uv = (-res + 2.0*gl_FragCoord.xy)/res.y;
	vec3 col = render(uv);

	col = 1.0 - exp(-col*1.0);
	col = pow(col, vec3(1.0/2.2));
	fragColor = vec4(col, 1);
}
