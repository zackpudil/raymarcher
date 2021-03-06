/// Local Headers
#include <main.hpp>

// System Headers
#include <glad/glad.h>
#include <GLFW/glfw3.h>

// Standard Headers
#include <cstdio>
#include <cstdlib>

#include <shader.hpp>
#include <scene.hpp>
#include <camera.hpp>

int main() {
    // Load GLFW and Create a Window
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    auto mWindow = glfwCreateWindow(mWidth, mHeight, "OpenGL", nullptr, nullptr);

    // Check for Valid Context
    if (mWindow == nullptr) {
        fprintf(stderr, "Failed to Create OpenGL Context");
        return EXIT_FAILURE;
    }

    // Create Context and Load OpenGL Functions
    glfwMakeContextCurrent(mWindow);
    glfwSetInputMode(mWindow, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    gladLoadGL();
    fprintf(stderr, "OpenGL %s\n", glGetString(GL_VERSION));

    GLfloat vertices[] = {
       1.0f,  1.0f, 0.0f, 1.0f, 1.0f,
       1.0f, -1.0f, 0.0f, 1.0f, 0.0f,
      -1.0f, -1.0f, 0.0f, 0.0f, 0.0f,
      -1.0f,  1.0f, 0.0f, 0.0f, 1.0f
    };

    GLuint indices[] = { 0, 1, 3, 1, 2, 3 };

    GLuint fbo;
    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);

    GLuint texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, mWidth/2, mHeight/2, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0);

    if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
        fprintf(stderr, "ERROR::FRAMEBUFFER:: Framebuffer is not complete!\n");

    GLuint vbo;
    glGenBuffers(1, &vbo);

    GLuint ebo;
    glGenBuffers(1, &ebo);

    GLuint vao;
    glGenVertexArrays(1, &vao);

    glBindVertexArray(vao);
      glBindBuffer(GL_ARRAY_BUFFER, vbo);
      glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

      glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
      glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

      glEnableVertexAttribArray(0);
      glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5*sizeof(GL_FLOAT), (GLvoid*)0);
      glEnableVertexAttribArray(1);
      glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5*sizeof(GL_FLOAT), (GLvoid*)(3*sizeof(GLfloat)));
      glBindVertexArray(0);
    glBindVertexArray(0);


    std::vector<Scene> scenes;
    int activeScene = 0;
    bool enterHit = false;

    scenes.push_back(Scene("absbox", true, true));
    scenes.push_back(Scene("ancient_generators", true, false)); // 0
    scenes.push_back(Scene("creepy_forest", true, false)); // 1
    scenes.push_back(Scene("earf_day", true, false)); // 2 
    scenes.push_back(Scene("flooded_canyon", true, false)); // 3
    scenes.push_back(Scene("flower_hive", true, true)); // 4
    scenes.push_back(Scene("frozen_trees", true, false)); // 5
    scenes.push_back(Scene("gold_fractal", true, false)); // 6
    scenes.push_back(Scene("grimy_teeth", true, false)); // 7
    scenes.push_back(Scene("kalieda", true, true)); // 8
    scenes.push_back(Scene("kaliset", true, false)); // 9
    scenes.push_back(Scene("mandelbox", true, false)); // 10 
    scenes.push_back(Scene("mandelball", true, false)); // 11
    scenes.push_back(Scene("mandalay", true, false)); // 12 
    scenes.push_back(Scene("muddy_caveran", true, false)); // 13
    scenes.push_back(Scene("server_room", true, false)); // 14
    scenes.push_back(Scene("space_monolith", true, false)); // 15 
    scenes.push_back(Scene("spongebob", true, false)); // 16
    scenes.push_back(Scene("velocibox", true, false)); // 17

    Shader imageShader;
    imageShader
      .attach("vert.vert")
      .attach("image.frag")
      .link();

    glm::vec2 res(mWidth/2, mHeight/2);

    Camera camera(glm::vec3(0), glm::vec3(0, 0, 1), mWindow, 2.0, 0.5);

    float time = 0;

    // Rendering Loop
    while (glfwWindowShouldClose(mWindow) == false) {

        if (glfwGetKey(mWindow, GLFW_KEY_ESCAPE) == GLFW_PRESS)
            glfwSetWindowShouldClose(mWindow, true);

        if(glfwGetKey(mWindow, GLFW_KEY_P) == GLFW_PRESS)
            glfwSetTime(0);

        camera.handleInput();

        int key = glfwGetKey(mWindow, GLFW_KEY_ENTER);
        if(key == GLFW_PRESS) {
          enterHit = true;
        } else if(key == GLFW_RELEASE && enterHit) {
          activeScene++;
          if(activeScene >= scenes.size()) activeScene = 0;
          enterHit = false;
        }

        glBindVertexArray(vao);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);

        glBindFramebuffer(GL_FRAMEBUFFER, fbo);
        glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        scenes[activeScene].prepareDraw(res, 
            (float)glfwGetTime(), 
            camera.getViewMatrix(), 
            camera.position,
            camera.fov);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        imageShader.activate();
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        glBindVertexArray(0);

        // Flip Buffers and Draw
        glfwSwapBuffers(mWindow);
        glfwPollEvents();

        time = glfwGetTime();
    }   

    glfwTerminate();
    return EXIT_SUCCESS;
}
