# raymarcher
![alt](https://github.com/zackpudil/raymarcher/raw/master/screenshot.png)
A small C++/OpenGL raymarcher with a bunch of scenes in them. All scenes can be found at https://www.shadertoy.com/user/zackpudil

## Building and Running

Project uses CMake to create build files. Install [CMake](https://cmake.org/) and follow the below instructions to build project.

```
$ cd /project/root/
$ mkdir build/
$ cd build/
```

### Linux

```
$ cmake ..
$ make
```

creates an executable as "raymarcher"

### Mac OS X
(Could use Linux/GNU make for building if desired)
```
$ cmake -G "Xcode" ..
```
creates an XCode project file.

### Windows
```
$ cmake -G "Visual Studio <version> <arch> .."
```

Where <version> is Visual Studio version, and <arch> is Win64, Win32
Creates a Visual Studio solution file.

## Running

Switch to a new scene using the <Enter> key.
Some scenes support camera movement with WASD and mouse.
