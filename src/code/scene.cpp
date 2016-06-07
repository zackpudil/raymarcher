#include <scene.hpp>

Scene::Scene(const std::string &name, bool ut) : _usesTime(ut) {
	_shader = new Shader();

	_shader->attach("vert.vert")
		.attach("scenes/" + name + ".frag")
		.link();
}

void Scene::prepareDraw(glm::vec2 resolution, float time) {
	_shader->activate().bind("resolution", resolution);

	if(_usesTime)
		_shader->bind("time", time);
}