<img src="src/js/assets/bolt-cep.svg" alt="Bolt CEP" width="300">

# Bolt CEP

A lightning-fast boilerplate for building Adobe CEP Extensions in React, Vue, or Svelte built on Vite + TypeScript + Sass

![npm](https://img.shields.io/npm/v/bolt-cep)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/hyperbrew/bolt-cep/blob/master/LICENSE)
[![Chat](https://img.shields.io/badge/chat-discord-7289da.svg)](https://discord.gg/N675AFSS)

## Features

- Lightning Fast Hot Module Replacement (HMR)
- Write Modern ES6 in both the JavaScript and ExtendScript layers
- Type-safe ExtendScript with Types-for-Adobe
- Easily configure in cep.config.ts
- Setup for single or multi-panel extensions
- Comes with multi-host-app configuration
- Optimized Build Size
- Easy Publish to ZXP for Distribution
- GitHub Actions ready-to-go for ZXP Releases

_Full Blog Post:_ https://hyperbrew.co/blog/bolt-cep-build-extensions-faster/

---

## Quick Start

<img src="src/js/assets/create-bolt-cep.jpg" alt="Bolt CEP">

`yarn create bolt-cep myApp --template react`

or

`yarn create bolt-cep myApp --template vue`

or

`yarn create bolt-cep myApp --template svelte`

- Create Extension

`cd myApp`

- CD into Directory

`yarn`

- Installs all dependencies

`yarn build`

- Runs initial build
- Creates cep folder structure
- Creates symlink to extensions folder

`yarn dev`

- Runs in dev mode with HMR Hot-reloading.
- Both JS and ExtendScript folders re-build on changes
- Viewable in browser via localhost:3000/panel/
  - (e.g. http://localhost:3000/main/, http://localhost:3000/settings/, etc.)

`yarn serve`

- Serve files after running `yarn build`
- Viewable in browser via localhost:5000/panel/
  - (e.g. http://localhost:5000/main/, http://localhost:5000/settings/, etc.)

`yarn debug && yarn tools`

- Adds snippet for debugging with React Dev Tools
- Launches standalone React Dev Tools

`yarn zxp`

- Builds and bundles your project into a zxp for publishing in the `dist/zxp` folder

---

## Config

Update your CEP build and package settings in `cep.config.ts` safely typed

Start building your app in `src/js/main/index(.tsx or .vue or .svelte)`

Write ExtendScript code in `src/jsx/main.ts`

---

## CEP Panel Structure

Each panel is treated as it's own page, with shared code for efficiency. The Boilerplate currently comes with 2 panels, `main` and `settings`. These are configured in the `cep.config.ts`.

Each panel can be edited in their respective folders:

```
src
 └─ js
    ├─ main
    │   ├─ index.html
    |   └─ index.tsx
    └─ settings
        ├─ index.html
        └─ index.tsx
```

To add panels, add an item to the panels object in `cep.config.ts`, and duplicate the folder structure and adjust as needed.

---

## ExtendScript

ExtendScript can be written in ES6 and will be compiled down to a single ES3 file for compatibility.

JSON 2 is included by default, and any external JS libraries added with the include directive will be bundled as well:

```
// @include './lib/library.js'
```

App-specific code is split into modules for type-safe development by the application's name as seen in the `index.ts`.

```
aftereffects >> aeft/aeft.ts
illustrator >> ilst/ilst.ts
animate >> anim/anim.ts
```

Write your app-specific functions in each of these separate modules, and they will be required per each application.

To add support for additional host apps:

- Add additional app module files (aeft.ts, anim.ts, etc).
- Extend the main `switch()` in `scr/jsx/index.ts` with your additional.
- Add the host to your `cep.config.ts` file.

---

## Calling ExtendScript from JS

As demonstrated in `main.tsx`, ExtendScript functions can be called with the `evalES()` function that will append your panel's namespace in the background to avoid namespace clashes.

```
console.log(await evalES(`helloWorld("${csi.getApplicationID()}")`));
```

If you wish to skip this scoping and call a global function directly, simply pass `true` to the second parameter:

```
evalES(`alert("Hello from ExtendScript :: " + app.appName + " " + app.version)`, true);
```

---

## GitHub Actions ZXP Releases

This repo comes with a configured GitHub Action workflow to build a ZXP and add to the releases each time a git tag is added.

```
git tag 1.0.0
git push origin --tags
```

Then your new build will be available under GitHub Releases.

---

---

## Copy Assets

If you have assets that you would like copied without being affected by the bundler, you can add the optional `copyAssets:[]` array inside your cep.config.ts to include files or entire folders.

```
  copyAssets: ["public", "custom/my.jsx"],
```

---

## Custom Ponyfills

Unlike Polyfills which modify the global prototype, Ponyfills replace functionality with custom methods. Built-in Ponyfills include:

- Object.freeze()
- Array.isArray()

You can add your own Ponyfils by passing them into the `jsxPonyfill()` function in  `vite.es.config.ts`:

```
jsxPonyfill([{
  find: "Array.isArray",
  replace: "__isArray",
  inject: `function __isArray(arr) { try { return arr instanceof Array; } catch (e) { return false; } };`,
}])
```

If you have a common Ponyfill you feel should be built-in, create a ticket and we'll look into it.

---

## ExtendScript Scope

This boilerplate is flavored for a single JSX object attached to helper object `$` for all your panels to prevent pollution in the global namespace. If you prefer to include your own raw JSX, include it in the Copy Assets object (above), and add the optional scriptPath object to your cep.config.ts file.

```
  panels: [
    {
      name: "main",
      scriptPath: "custom/index.jsx",
      [...]
    },
    {
      name: "settings",
      scriptPath: "custom/settings.jsx",
      [...]
    },
  ],
  copyAssets: ["custom"],
```

---

## Troubleshooting Modules

Node.js Built-in modules can be imported from the `src/js/lib/node.ts` file.

```
import { os, path, fs } from "../lib/node";
```

To use 3rd party libraries, first attempt to use with the standard import syntax.

```
import { FaBolt } from "react-icons/fa";
```

If the import syntax fails (typically with modules that use the Node.js runtime) you can resort to the Node.js `require()` syntax,

```
const unzipper = require("unzipper");
```

The build system will detect any non-built-in Node.js modules using `require()` and copy them to the output `node_modules` folder, but if a package is missed, you can add it explicitly to the `installModules:[]` array inside your `cep.config.ts` file.

```
  installModules: ["unzipper"],
```

Also if they're Node.js-specific modules, it's best to place the requires inside functions so they are only required at runtime and don't break your panel when previewing in the browser.

---

## A Note on Routers

If you would like to set up a routing system like react-router, be aware that you'll have to make adjustments for CEP. React Router for instance bases the router path off of `window.location.pathname` which in the browser resolves to the page:

`/main/index.html`

yet in CEP context resolves to the full system path:

`file:///C:/Users/Username/AppData/Roaming/Adobe/CEP/extensions/com.bolt.cep/main/index.html`

To solve this, you'll need to adjust the router basename for each context, here is one way of accomplishing that with the panel named `main`:

```
const posix = (str: string) => str.replace(/\\/g, "/");

const cepBasename = window.cep_node
  ? `${posix(window.cep_node.global.__dirname)}/`
  : "/main/";

ReactDOM.render(
  <React.StrictMode>
    <Router basename={cepBasename}>
    [...]
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
```

## Misc Troubleshooting

- If you're getting permissions errors running ZXPSignCmd on the latest Mac releases, try a fresh clone. If that does't work open the `vite-cep-plugin/bin` directory and run `chmod 700 ./ZXPSignCmd`.

## Limitations

- Built for Adobe CC 2020 and up
