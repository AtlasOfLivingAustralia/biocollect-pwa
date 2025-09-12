# BioCollect PWA Demo

> A progressive web application version of BioCollect, built with React.

- [BioCollect PWA Demo](#biocollect-pwa-demo)
	- [Dependencies](#dependencies)
		- [Why Mantine?](#why-mantine)
	- [Setup / Installation](#setup--installation)
		- [IDE](#ide)
		- [Application](#application)

## Dependencies

Some of the NPM packages used by this project are:

- [axios](https://axios-http.com): HTTP requests
- [mantine](https://mantine.dev): UI component library / styling
- [react-oidc-context](https://www.npmjs.com/package/react-oidc-context): OpenID authentication
- [react-router-dom](https://reactrouter.com): Client-side routing

### Why Mantine?

As this application is a demonstration (and not indicative of a final product), Mantine is a great choice to quickly prototype UI.

## Setup / Installation

### IDE

The recommended IDE for this project is [Visual Studio Code](https://code.visualstudio.com), with the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Setup VSCode to format on save using [this](https://www.alphr.com/auto-format-vs-code) guide.

### Application

1. Install Node.js `22.19.0` (or later)
   1. Use [nvm](https://github.com/nvm-sh/nvm) to manage multiple versions of node
2. Clone the repository
3. Install dependencies using [pnpm](https://pnpm.io) simply with `pnpm install`
   1. Installation instructions available [here](https://pnpm.io/installation)
4. Allow `esbuild` to run via `pnpm approve-builds`
5. Start the project with `pnpm dev`
