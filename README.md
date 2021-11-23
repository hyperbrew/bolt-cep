# Bolt CEP

_A boilerplate for Adobe CEP Extensions built on Vite + React + TypeScript + Scss_

## What?

A Modern CEP Boilerplate.

Build your React CEP Panel app with HMR (Hot Module Reloading).

Adjust manifest settings in your cep.config.json. Running in dev mode will hot-reload upon changes.

Build to create your consolidated production-ready CEP panel.

## Why?

While UXP is going to replace CEP in all Adobe apps at some point, we still need CEP panels in the meantime, also there should be a fair amount of overlap time between them in order for us to switch over.

For now, Vite development is one of the fastest available, and uses Rollup for build time to create super optmized bundle sizes.

## How?

Write in React and TypeScript start building your app like lightning!

---

## Quickstart

- Install: `yarn`
- First Build: `yarn build`
- Develop: `yarn dev`
- Debug React: `yarn debug` && `yarn tools`
- Build: `yarn build`
- Serve (browser preview only): `yarn serve`

---

## Modify

Update your CEP build and package settings in `cep.config.json`

Add your custom id in `shared.ts` as your scoped namepsace for ExtendScript

Start building your app in `index.tsx`

Write ExtendScript code in `main.ts`

---

## Limitations

- Built for Adobe CC 2019 and above

---

## Roadmap

1. Add ZXP Bundling
2. Add Multi-Panel compatibility
3. Add additional CEP debug tools
