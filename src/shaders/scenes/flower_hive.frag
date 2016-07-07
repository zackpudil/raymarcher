#version 330 core

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

uniform mat3 camera;
uniform vec3 eye;
uniform float fov;

// basic 2d rotation.
void rotate(inout vec2 p, float a) {
	float s = sin(a);
	float c = cos(a);

	p = mat2(c, s, -s, c)*p;
}

vec4 orb;
float de(vec3 p) {
	vec4 q = vec4(p, 1);
	vec4 c = vec4(p, 0);

	rotate(q.xy, time*step(-0.5, -length(p)));
	rotate(q.xz, 2.*time*step(-0.5, -length(p)));
	orb = vec4(10000.0);

	for(int i = 0; i < 10; i++) { //kaliset fractal with no mirroring offset
		q.xyz = abs(q.xyz);
		float r = dot(q.xyz, q.xyz);
		q /= clamp(r, 0.0, 1.7);
		
		q = 2.0*q - vec4(2, 1, 2, 0); // julia offset.
		
		orb = min(orb, vec4(abs(q.xyz), sqrt(r)));
	}
	
	return (length(q.xy)/q.w - 0.003); // cylinder primative instead of a sphere primative.
}

void main() {
    // pixel coords
	vec2 p = -1.0 + 2.0*gl_FragCoord.xy/resolution.xy;
	p.x *= resolution.x/resolution.y;
	
	vec3 col = vec3(0);
	
    // ray origin and ray direction.
	vec3 ro = eye;
	vec3 rd = normalize(camera*vec3(p, fov));
	
    // ray marching.
	float t = 0.0;
	for(int i = 0; i < 200; i++) {
		float d = de(ro + rd*t);
		if(abs(d) < 0.001*t || t >= 1000.0) break;
		t += d*0.25; // fudge factor = 1/4.
	}
	
	if(t < 1000.0) {
        // position and normal.
		vec3 pos = ro + rd*t;
		vec2 eps = vec2(0.001, 0.0);
		vec3 nor = normalize(vec3(
			de(pos + eps.xyy) - de(pos - eps.xyy),
			de(pos + eps.yxy) - de(pos - eps.yxy),
			de(pos + eps.yyx) - de(pos - eps.yyx)
		));
		
        // ambient occlusion.
		float o = 0.0, w = 1.0, s = 0.003;
		for(int i = 0; i < 15; i++) {
			float d = de(pos + nor*s);
			o += (s - d)*w;
			s += s/(float(i) + 1.0);
		}
		
        // color by orbit trap.
		vec3 oc = vec3(0.3, 0.3, 1.0)*orb.x
			+ vec3(0.1, 0.5, 0.6)*orb.y
			+ vec3(0.3, 0.3, 1.0)*orb.z
			+ vec3(0.9, 0.3, 0.5)*orb.w;
		
        // mix color with base color.
		col = mix(vec3(1), 3.0*oc, 0.4);
		
        // apply ambient occlusion.
		col *= vec3(1.0 - clamp(o, 0.0, 1.0));
	}
	
    // mix with black fog...good fake for attenuation.
	col = mix(col, vec3(0), 1.0 - exp(-0.5*t));
	
	fragColor = vec4(col, 1);
}