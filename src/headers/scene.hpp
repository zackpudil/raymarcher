#pragma once

#include <shader.hpp>

class Scene {
public:
	Scene(const std::string &sceneName, bool ut);

	void prepareDraw(glm::vec2 resolution, float time);

private:
	Shader *_shader;

	bool _usesTime;
};