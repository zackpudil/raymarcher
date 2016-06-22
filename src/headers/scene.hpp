#pragma once

#include <shader.hpp>

class Scene {
public:
	Scene(const std::string &sceneName, bool ut, bool uc);

	void prepareDraw(glm::vec2, float, glm::mat3, glm::vec3, float);

private:
	Shader *_shader;

	bool _usesTime;
	bool _usesCamera;
};