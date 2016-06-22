#include <scene.hpp>

Scene::Scene(const std::string &name, bool ut, bool uc) : 
_usesTime(ut), _usesCamera(uc) {
	_shader = new Shader();

	_shader->attach("vert.vert")
		.attach("scenes/" + name + ".frag")
		.link();
}

void Scene::prepareDraw(glm::vec2 resolution, float time, glm::mat3 camera, glm::vec3 eye, float fov) {
	_shader->activate().bind("resolution", resolution);


	if(_usesTime) _shader->bind("time", time);
	if(_usesCamera) _shader->bind("camera", camera).bind("eye", eye).bind("fov", fov);
}