#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

float hash(float n) {
	return fract(sin(n)*42758.4545);
}

float noise(vec3 x) {
	vec3 p = floor(x);
	vec3 f = fract(x);
	
	f = f*f*(3.0 - 2.0*f);
	
	float n = p.x + p.y*57.0 + p.z*113.0;
	
	return mix(
		mix(
			mix(hash(n + 000.0), hash(n + 001.0), f.x),
			mix(hash(n + 057.0), hash(n + 58.0), f.x),
			f.y),
		mix(
			mix(hash(n + 113.0), hash(n + 114.0), f.x),
			mix(hash(n + 170.0), hash(n + 171.0), f.x),
			f.y),
		f.z);
}

float len(vec3 p, float l) {
	p = pow(abs(p), vec3(l));
	return pow(p.x + p.y + p.z, 1.0/l);
}

float dTeeth(vec3 p) {
  vec3 q = p;
  p.x = mod(p.x + 1.0, 2.0) - 1.0;
	p.y -= 0.7*dot(p.xz, p.xz) - 0.25 - 0.2*smoothstep(0.2, 1.0, noise(3.0*p));
	p.y *= 1.25;
	return len(p, 2.8) - 1.00 - 0.03*smoothstep(0.2, 0.8, noise(3.0*q));
}

float dMouth(vec3 p) {
    float f = 0.4*smoothstep(0.1, 0.9, noise(2.0*p));
    vec3 q = p;
    p.y -= 1.0 - smoothstep(0.4, 2.0, abs(p.z));
    return min(p.y + 1.0 + f, q.z + 2.5 + 0.3*f);
}

vec2 map(vec3 p) {
    p.x += sign(p.y)*sin(time*5.0)*0.1;
    p.y = -abs(p.y) + 1.0 + 0.3*smoothstep(-0.3, 0.3, cos(time));
    
    vec2 m = vec2(dMouth(p), 0.0);
    vec2 t = vec2(dTeeth(p), 1.0);
    
    return m.x < t.x ? m : t;
}

vec2 march(vec3 ro, vec3 rd) {
	float t = 0.0;
    float m = 0.0;
	
	for(int i = 0; i < 80; i++) {
		vec2 h = map(ro + rd*t);
		if(abs(h.x) < 0.0001 || t >= 15.0) break;
		t += h.x*0.5;
        m = h.y;
	}
	
	return vec2(t, m);
}

vec3 normal(vec3 p) {
	vec2 h = vec2(0.001, 0.0);
	vec3 g = (vec3(
		map(p + h.xyy).x,
		map(p + h.yxy).x,
		map(p + h.yyx).x) - map(p).x)/h.x;
	
	return normalize(g);
}

float ao(vec3 p, vec3 n) {
    float s = 0.013;
    float t = s;
    
    float o = 0.0;
    
    for(int i = 0; i < 10; i++) {
        float h = map(p + n*t).x;
        o += t - h;
        t += s;
    }
    
    return clamp(1.0 - o, 0.0, 1.0);
    
}

mat3 camera(vec3 eye, vec3 lat) {
	vec3 ww = normalize(lat - eye);
	vec3 vv = normalize(cross(vec3(0, 1, 0), ww));
	vec3 uu = normalize(cross(ww, vv));
	
	return mat3(vv, uu, ww);
}

void main() {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution.xy);
	uv.x *= resolution.x/resolution.y;
	
	vec3 ro = vec3(time, 1.5, 4);
	vec3 rd = camera(ro, ro + vec3(-1.0, -1.5, -4.0))*normalize(vec3(uv, 1.97));
	
	vec3 col = vec3(1, .1, .1);
	
	vec2 i = march(ro, rd);
	
	if(i.x < 15.0) {
		vec3 pos = ro + rd*i.x;
		vec3 nor = normal(pos);
		vec3 ref = reflect(rd, nor);
		
		vec3 lig = normalize(vec3(0.8, 0.0, 0.6));
		
		float amb = clamp(0.5 + 0.5*nor.y, 0.0, 1.0);
		float dif = clamp(dot(lig, nor), 0.0, 1.0);
		float spe = pow(clamp(dot(lig, ref), 0.0, 1.0), 32.0);
		float fre = pow(clamp(1.0 + dot(nor, rd), 0.0, 1.0), 2.0);
        
        float occ = ao(pos, nor);
		
		col  = 0.2*amb*vec3(1);
		col += 0.7*dif*vec3(1);
		
		if(i.y == 1.0) {
			vec3 mat = vec3(1);
            
      pos.x += sign(pos.y)*sin(time*5.0)*0.1;
      pos.y -= sign(pos.y)*0.3*smoothstep(-0.3, 0.3, cos(time));
			float f = smoothstep(0.1, 0.4, noise(3.0*pos));
			mat = mix(mat, vec3(0.7, 0.7, 0.1), 1.0 - f);
            
			pos.x = mod(pos.x + 1.0, 2.0) - 1.0;
			f = smoothstep(0.0, 0.4, length(pos.xz));
			mat = mix(mat, vec3(0.0), smoothstep(0.0, 1.0, 2.0*(1.0 - f)));
			
			col *= mat;
		} else {
			col *= vec3(0.8, 0.1, 0.1);
		}
		
		col += 1.0*spe*vec3(1)*dif;
		col += 0.4*fre*vec3(1);
        
        col *= occ;
	}
	
	col = pow(col, vec3(.454545));
	
	fragColor = vec4(col, 1);
}