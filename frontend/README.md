# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## How to run and build
npm run dev → local dev server, .env.dev
npm run dev:dev → local dev server, .env.dev
npm run dev:test → local dev server, .env.test
npm run dev:prod → local dev server, .env.prod
npm run build → optimized build, .env.dev
npm run build:dev → optimized build, .env.dev
npm run build:test → optimized build, .env.test
npm run build:prod → optimized build, .env.prod