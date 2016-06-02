#pragma once

#include <shader.hpp>

class Scene {
public:
	Scene(const std::string &sceneName);

	void prepareDraw(glm::vec2 resolution, float time);

private:
	Shader *_shader;
};