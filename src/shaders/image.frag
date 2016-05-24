#version 330 core

in vec2 tex;
out vec4 fragColor;

uniform sampler2D image;

void main() {
	fragColor = texture(image, tex);
}