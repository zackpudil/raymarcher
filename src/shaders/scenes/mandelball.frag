#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

float de(vec3 p, inout vec4 o) {
	vec4 q = vec4(p, 1);
	vec4 c = q;

	o = vec4(10000.0);
	
	q.xyz *= abs(cos(time*0.1));
	for(int i = 0; i < 10; i++) {
		q.xyz = 2.0*clamp(q.xyz, -1.0, 1.0) - q.xyz;
		q *= clamp(1.0/dot(q.xyz, q.xyz), 1.0, 1.0/0.5);
		
		q = 3.0*q - c;

		o = min(o, vec4(abs(q.xzy), length(q.xyz)));
	}

	return min(length(p) - 1.0 - smoothstep(-2.0, -1.97, -length(p))*(length(q.xyz)/q.w - 0.001), p.y + 1.0);
}

vec3 render(vec3 ro, vec3 rd, inout vec3 pos, inout vec3 ref) {
	float t = 0.0;
	vec4 orb;
	for(int i = 0; i < 200; i++) {
		float d = de(ro + rd*t, orb);
		if(d < 0.0001*t || t >= 10.0) break;
		t += d*0.35;
	}
	
	vec3 col = vec3(0.15);
	if(t < 10.0) {
		vec4 tmp;
		pos = ro + rd*t;
		vec2 eps = vec2(0.001, 0.0);
		vec3 nor = normalize(vec3(
			de(pos + eps.xyy, tmp) - de(pos - eps.xyy, tmp),
			de(pos + eps.yxy, tmp) - de(pos - eps.yxy, tmp),
			de(pos + eps.yyx, tmp) - de(pos - eps.yyx, tmp)
		));
		ref = reflect(rd, nor);
		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		
		float occ = 0.0, w = 1.0, s = 0.006;
		for(int i = 0; i < 15; i++) {
			float d = de(pos + nor*s, tmp);
			occ += (s - d)*w;
			w *= 0.95;
			s += s/(float(i) + 1.0);
		}
		occ = 1.0 - clamp(occ, 0.0, 1.0);
		
		float sha = 1.0; s = 0.002;
		for(int i = 0; i < 50; i++) {
			float d = de(pos + key*s, tmp);
			s += d;
			sha = min(sha, 8.0*d/s);
			if(d < 0.0 || t >= 10.0) break;
		}
		sha = clamp(sha, 0.0, 1.0);
		
		col = clamp(dot(nor, key), 0.0, 1.0)
			*vec3(1.64, 1.57, 0.99)
			*sha;
		
		col += clamp(0.5 + 0.5*nor.y, 0.0, 1.0)
			*vec3(0.16, 0.20, 0.28)
			*occ;
		
		col += clamp(dot(nor, key*vec3(-1, 0, -1)), 0.0, 1.0)
			*vec3(0.40, 0.28, 0.20)
			*occ;

		vec3 mat; 
					
		if(pos.y > -0.99) {
			mat = mix(vec3(1.0, 0.3, 0.0), vec3(0.3, 1.0, 0.3), orb.x);
			mat = mix(mat, vec3(0.3, 0.3, 1.0), orb.y);
			mat = mix(mat, vec3(1.1, 0.8, 0.1), orb.z);
		}
		else mat = 0.5 + 0.5*vec3(mod(floor(pos.x) + floor(pos.z), 2.0));

		col *= 0.2*mat;
		col += pow(clamp(dot(key, ref), 0.0, 1.0), 8.0)*vec3(1.00, 0.95, 0.5)*mat*occ;
	}

	return col;
}

void main() {
	vec2 p = -1.0 + 2.0*gl_FragCoord.xy/resolution;
	p.x *= resolution.x/resolution.y;

	vec3 ro = 2.0*vec3(cos(time*0.4), 0.5, -sin(time*0.4));
	vec3 ww = normalize(-ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(p.x*uu + p.y*vv + 1.97*ww);

	vec3 td, tp;
	vec3 col = render(ro, rd, tp, td);

	vec3 mp, md;
	vec3 rcol = render(tp, td, mp, md);

	col = mix(col, rcol, 0.2);
	
	col = pow(col, vec3(1.0/2.2));
	fragColor = vec4(col, 1);
}
