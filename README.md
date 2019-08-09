# WebGL-GettingStarted-Project

Project configured for webgl development (using typescript/javascript).
The project is set to webgl2.

## Requirements

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com).

## Usage

```sh
$ npm install
#develop (the application will run on http://localhost:8080)
$ npm run dev
#or build
$ npm run build
```

./src contains all the scripts of the application. The project contains an example of a cube rendered.
If you see a cube with the texture uvmap.png on it, it means that you installed all correctly

./dist is the output folder that contains distribution files.

## Contents

There are also some class that could help you.
Keep in mind that these classes have some limitation and they're not optimized (expecially Model loading).

```
src
├── global.d.ts
├── index.html (entry file)
├── main.ts
├── models (samples)
│   ├── bunny_lp.obj
│   └── cube.obj
├── script
│   ├── Model.ts (obj importer)
│   ├── Shader.ts
│   ├── Utils.ts
│   └── webgl-core.ts (instance of the webgl rendering context)
├── shader (samples)
│   ├── shader.frag
│   └── shader.vert
└── textures
    ├── SoilCracked.png
    └── SoilCracked.png.b64 (base64 of the SoilCracked.png)
```
