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
CMAKE_SOURCE_DIR = /Users/zackpudil/Projects/raytracer

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/zackpudil/Projects/raytracer/build

# Include any dependencies generated for this target.
include vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/depend.make

# Include the progress variables for this target.
include vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/progress.make

# Include the compile flags for this target's objects.
include vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/flags.make

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/flags.make
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o: ../vendor/bullet/src/Bullet3Common/b3AlignedAllocator.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raytracer/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o -c /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3AlignedAllocator.cpp

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.i"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3AlignedAllocator.cpp > CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.i

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.s"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3AlignedAllocator.cpp -o CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.s

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.requires:

.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.requires

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.provides: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.requires
	$(MAKE) -f vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build.make vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.provides.build
.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.provides

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.provides.build: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o


vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/flags.make
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o: ../vendor/bullet/src/Bullet3Common/b3Vector3.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raytracer/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/Bullet3Common.dir/b3Vector3.o -c /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Vector3.cpp

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/Bullet3Common.dir/b3Vector3.i"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Vector3.cpp > CMakeFiles/Bullet3Common.dir/b3Vector3.i

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/Bullet3Common.dir/b3Vector3.s"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Vector3.cpp -o CMakeFiles/Bullet3Common.dir/b3Vector3.s

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.requires:

.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.requires

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.provides: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.requires
	$(MAKE) -f vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build.make vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.provides.build
.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.provides

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.provides.build: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o


vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/flags.make
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o: ../vendor/bullet/src/Bullet3Common/b3Logging.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/zackpudil/Projects/raytracer/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Building CXX object vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++   $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/Bullet3Common.dir/b3Logging.o -c /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Logging.cpp

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/Bullet3Common.dir/b3Logging.i"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Logging.cpp > CMakeFiles/Bullet3Common.dir/b3Logging.i

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/Bullet3Common.dir/b3Logging.s"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common/b3Logging.cpp -o CMakeFiles/Bullet3Common.dir/b3Logging.s

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.requires:

.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.requires

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.provides: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.requires
	$(MAKE) -f vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build.make vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.provides.build
.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.provides

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.provides.build: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o


# Object files for target Bullet3Common
Bullet3Common_OBJECTS = \
"CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o" \
"CMakeFiles/Bullet3Common.dir/b3Vector3.o" \
"CMakeFiles/Bullet3Common.dir/b3Logging.o"

# External object files for target Bullet3Common
Bullet3Common_EXTERNAL_OBJECTS =

vendor/bullet/src/Bullet3Common/libBullet3Common.a: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o
vendor/bullet/src/Bullet3Common/libBullet3Common.a: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o
vendor/bullet/src/Bullet3Common/libBullet3Common.a: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o
vendor/bullet/src/Bullet3Common/libBullet3Common.a: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build.make
vendor/bullet/src/Bullet3Common/libBullet3Common.a: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/zackpudil/Projects/raytracer/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_4) "Linking CXX static library libBullet3Common.a"
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && $(CMAKE_COMMAND) -P CMakeFiles/Bullet3Common.dir/cmake_clean_target.cmake
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/Bullet3Common.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build: vendor/bullet/src/Bullet3Common/libBullet3Common.a

.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/build

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/requires: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3AlignedAllocator.o.requires
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/requires: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Vector3.o.requires
vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/requires: vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/b3Logging.o.requires

.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/requires

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/clean:
	cd /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common && $(CMAKE_COMMAND) -P CMakeFiles/Bullet3Common.dir/cmake_clean.cmake
.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/clean

vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/depend:
	cd /Users/zackpudil/Projects/raytracer/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/zackpudil/Projects/raytracer /Users/zackpudil/Projects/raytracer/vendor/bullet/src/Bullet3Common /Users/zackpudil/Projects/raytracer/build /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common /Users/zackpudil/Projects/raytracer/build/vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : vendor/bullet/src/Bullet3Common/CMakeFiles/Bullet3Common.dir/depend

