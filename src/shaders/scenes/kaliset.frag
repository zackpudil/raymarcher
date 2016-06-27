#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

const float tmax = 100.0;

float orb;
float de(vec3 p) {
	p.x = mod(p.x + 1.2, 2.4) - 1.2;
	vec4 q = vec4(p, 1);
	orb = 10000.0;
	for(int i = 0; i < 15; i++) {
		q = 5.0*abs(q)/dot(q.xyz, q.xyz) - vec4(2.4, 0.9, 2.4, 0);
		orb = min(orb, sin(abs(q.x)*abs(q.y)));
	}
	
	return (length(q.xyz))/q.w - 0.01;
}

void main( void ) {
	vec2 uv = -1.0 + 2.0*(gl_FragCoord.xy/resolution);
	uv.x *= resolution.x/resolution.y;
	
	vec3 ro = vec3(time, 0, -3);
	vec3 ww = normalize(vec3(time - 3.0*sin(time), 2.0*smoothstep(-0.5, 0.5, cos(time))*sign(cos(time*0.5)), 0) - ro);
	vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
	vec3 vv = normalize(cross(ww, uu));
	vec3 rd = normalize(uu*uv.x + vv*uv.y + ww*1.97);
	
	float t = 0.0;
	float g = 0.0;
	for(int i = 0; i < 200; i++) {
		float d = de(ro + rd*t);
		
		if(d < 0.0001*(1.0 + 80.0*t) || t >= 10.0) break;
		t += d*(0.1 + 0.01*t);
		
		g += 0.05*(1.0 - d);
	}
	
	g = t >= 10.0 ? 0.0 : clamp(g, 0.0, 1.0);
	
	vec3 col = vec3(0);
	if(t < 10.0) {
		vec3 pos = ro + rd*t;
		vec2 h = vec2(0.001, 0.0);
		vec3 nor =  normalize(vec3(
		de(pos + h.xyy) - de(pos - h.xyy),
		de(pos + h.yxy) - de(pos - h.yxy),
		de(pos + h.yyx) - de(pos - h.yyx)));
		
		vec3 key = normalize(vec3(0.8, 0.7, -0.6));
		vec3 gro = vec3(0, -1, 0);
		
		col = 0.2*vec3(1);
		col += 0.7*clamp(dot(key, nor), 0.0, 1.0);
		col += 0.5*clamp(0.2 + 0.8*dot(-key, nor), 0.0, 1.0);
		col += 0.3*clamp(dot(gro, nor), 0.0, 1.0);
		
		col *= mix(vec3(0, 0.3, 1), vec3(1, 0.2, 0.2), 4.0*orb);
	}
	
	col += g*mix(vec3(0, 0.3, 1), vec3(1, 0.2, 0.2), 4.0*orb);
	col = mix(col, vec3(1), 1.0 - exp(-0.1*t));
	col = sqrt(col);
	
	fragColor = vec4(col, 1);
}