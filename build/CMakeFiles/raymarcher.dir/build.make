# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.4

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/local/Cellar/cmake/3.4.1/bin/cmake

# The command to remove a file.
RM = /usr/local/Cellar/cmake/3.4.1/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/zackpudil/Projects/raymarcher

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/zackpudil/Projects/raymarcher/build

# Include any dependencies generated for this target.
include CMakeFiles/raymarcher.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/raymarcher.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/raymarcher.dir/flags.make

CMakeFiles/raymarcher.dir/src/code/main.cpp.o: CMakeFiles/raymarcher.dir/flags.make
CMakeFiles/raymarcher.dir/src/code/main.cpp.o: ../src/code/main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raymarcher/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/raymarcher.dir/src/code/main.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/raymarcher.dir/src/code/main.cpp.o -c /Users/zackpudil/Projects/raymarcher/src/code/main.cpp

CMakeFiles/raymarcher.dir/src/code/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/raymarcher.dir/src/code/main.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/zackpudil/Projects/raymarcher/src/code/main.cpp > CMakeFiles/raymarcher.dir/src/code/main.cpp.i

CMakeFiles/raymarcher.dir/src/code/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/raymarcher.dir/src/code/main.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/zackpudil/Projects/raymarcher/src/code/main.cpp -o CMakeFiles/raymarcher.dir/src/code/main.cpp.s

CMakeFiles/raymarcher.dir/src/code/main.cpp.o.requires:

.PHONY : CMakeFiles/raymarcher.dir/src/code/main.cpp.o.requires

CMakeFiles/raymarcher.dir/src/code/main.cpp.o.provides: CMakeFiles/raymarcher.dir/src/code/main.cpp.o.requires
	$(MAKE) -f CMakeFiles/raymarcher.dir/build.make CMakeFiles/raymarcher.dir/src/code/main.cpp.o.provides.build
.PHONY : CMakeFiles/raymarcher.dir/src/code/main.cpp.o.provides

CMakeFiles/raymarcher.dir/src/code/main.cpp.o.provides.build: CMakeFiles/raymarcher.dir/src/code/main.cpp.o


CMakeFiles/raymarcher.dir/src/code/shader.cpp.o: CMakeFiles/raymarcher.dir/flags.make
CMakeFiles/raymarcher.dir/src/code/shader.cpp.o: ../src/code/shader.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raymarcher/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/raymarcher.dir/src/code/shader.cpp.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/raymarcher.dir/src/code/shader.cpp.o -c /Users/zackpudil/Projects/raymarcher/src/code/shader.cpp

CMakeFiles/raymarcher.dir/src/code/shader.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/raymarcher.dir/src/code/shader.cpp.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/zackpudil/Projects/raymarcher/src/code/shader.cpp > CMakeFiles/raymarcher.dir/src/code/shader.cpp.i

CMakeFiles/raymarcher.dir/src/code/shader.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/raymarcher.dir/src/code/shader.cpp.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/zackpudil/Projects/raymarcher/src/code/shader.cpp -o CMakeFiles/raymarcher.dir/src/code/shader.cpp.s

CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.requires:

.PHONY : CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.requires

CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.provides: CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.requires
	$(MAKE) -f CMakeFiles/raymarcher.dir/build.make CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.provides.build
.PHONY : CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.provides

CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.provides.build: CMakeFiles/raymarcher.dir/src/code/shader.cpp.o


CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o: CMakeFiles/raymarcher.dir/flags.make
CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o: ../vendor/glad/src/glad.c
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raymarcher/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building C object CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -o CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o   -c /Users/zackpudil/Projects/raymarcher/vendor/glad/src/glad.c

CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing C source to CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.i"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -E /Users/zackpudil/Projects/raymarcher/vendor/glad/src/glad.c > CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.i

CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling C source to assembly CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.s"
	/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/cc  $(C_DEFINES) $(C_INCLUDES) $(C_FLAGS) -S /Users/zackpudil/Projects/raymarcher/vendor/glad/src/glad.c -o CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.s

CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.requires:

.PHONY : CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.requires

CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.provides: CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.requires
	$(MAKE) -f CMakeFiles/raymarcher.dir/build.make CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.provides.build
.PHONY : CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.provides

CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.provides.build: CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o


# Object files for target raymarcher
raymarcher_OBJECTS = \
"CMakeFiles/raymarcher.dir/src/code/main.cpp.o" \
"CMakeFiles/raymarcher.dir/src/code/shader.cpp.o" \
"CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o"

# External object files for target raymarcher
raymarcher_EXTERNAL_OBJECTS =

raymarcher: CMakeFiles/raymarcher.dir/src/code/main.cpp.o
raymarcher: CMakeFiles/raymarcher.dir/src/code/shader.cpp.o
raymarcher: CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o
raymarcher: CMakeFiles/raymarcher.dir/build.make
raymarcher: vendor/assimp/code/libassimp.a
raymarcher: vendor/glfw/src/libglfw3.a
raymarcher: vendor/bullet/src/BulletDynamics/libBulletDynamics.a
raymarcher: vendor/bullet/src/BulletCollision/libBulletCollision.a
raymarcher: vendor/bullet/src/LinearMath/libLinearMath.a
raymarcher: /usr/lib/libz.dylib
raymarcher: CMakeFiles/raymarcher.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/zackpudil/Projects/raymarcher/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Linking CXX executable raymarcher"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/raymarcher.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/raymarcher.dir/build: raymarcher

.PHONY : CMakeFiles/raymarcher.dir/build

CMakeFiles/raymarcher.dir/requires: CMakeFiles/raymarcher.dir/src/code/main.cpp.o.requires
CMakeFiles/raymarcher.dir/requires: CMakeFiles/raymarcher.dir/src/code/shader.cpp.o.requires
CMakeFiles/raymarcher.dir/requires: CMakeFiles/raymarcher.dir/vendor/glad/src/glad.c.o.requires

.PHONY : CMakeFiles/raymarcher.dir/requires

CMakeFiles/raymarcher.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/raymarcher.dir/cmake_clean.cmake
.PHONY : CMakeFiles/raymarcher.dir/clean

CMakeFiles/raymarcher.dir/depend:
	cd /Users/zackpudil/Projects/raymarcher/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/zackpudil/Projects/raymarcher /Users/zackpudil/Projects/raymarcher /Users/zackpudil/Projects/raymarcher/build /Users/zackpudil/Projects/raymarcher/build /Users/zackpudil/Projects/raymarcher/build/CMakeFiles/raymarcher.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/raymarcher.dir/depend
