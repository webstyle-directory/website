# Web Style Directory

Web Style Directory is a website where you can see all of the libraries that are help to style the Websites/Web Applications.

> This repository began as a GitHub fork of [react-native-directory/website](https://github.com/react-native-directory/website).

Website: https://webstyle-directory.vercel.app/

## I don't like how you calculate health scores.

- Submit a PR with changes to `scripts/calculate-score.js`.
- You have all the power! Tell us what you want.

## How do I add a library?

- Add it to `style-libraries.json`.
- Submit a PR.

Please follow this format and indentation:

```json
{
  "githubUrl": "<THE GITHUB URL>",
  "npmPkg": "<NPM PACKAGE NAME>",
  "nameOverride": "<PACKAGE DISPLAY NAME>",
  "examples": ["<THE URL TO REPO>", "<THE URL TO A SNACK>"],
  "images": ["<PUBLIC URL TO RELATED IMAGE>"],
  "uiComponents": false,
  "templates": false,
  "scss": false,
  "less": false,
  "vanilacss": false,
  "react": false,
  "angular": false,
  "vue": false,
  "unmaintained": false,
  "dev": false
}
```

- `githubUrl` - (**required** string) - URL to the GitHub repository (currently other git hosts are not supported).
- `npmPkg` - (_optional_ string) - package's display name (fill only when the GitHub repository name is different from the name of package published to npm).
- `nameOverride` - (_optional_ string) - override name if the name is different from the GitHub repo and npm package name.
- `examples` - (_optional_ array of strings) - URLs (snacks preferred) with demonstrations of the library.
- `images` - (_optional_ array of strings) - URLs to images that will show up in the listing to preview the library functionality.
- `uiComponents` - (_optional_ boolean) - Components for web applications.
- `templates` - (_optional_ boolean) - Free templates to help you get started building your app.
- `scss` - (_optional_ boolean) - Supports SCSS/Sass [`sass-lang`](https://sass-lang.com/).
- `less` - (_optional_ boolean) - Supports less [`lesscss`](http://lesscss.org/).
- `vanilacss` - (_optional_ boolean) - Supports Plain vanila CSS.
- `react` - (_optional_ boolean) - Supports reactjs [`reactjs`](https://reactjs.org/).
- `angular` - (_optional_ boolean) - Supports angular [`angular`](https://angular.io/).
- `vue` - (_optional_ boolean) - Supports vuejs [`vuejs`](https://vuejs.org/).
- `unmaintained` - (_optional_ boolean) - signify that a library is not maintained.
- `dev` - (_optional_ boolean) - signify that a library is a development tool.

> _Note:_ If your package is within a monorepo on GitHub, eg: https://github.com/expo/expo/tree/master/packages/expo-web-browser, then the name, description, homepage, and topics (keywords) will be extracted from package.json for that subrepo. GitHub stats will be based on the monorepo, because there isn't really another option.

## How do I run my own version locally?

Prerequisites

- Node LTS

Commands

##### With npm

```sh
npm install
npm start
```

##### With yarn

```sh
yarn
yarn start
```

You should be able to visit `localhost:3000` in your browser.

## How do I run `npm run data:update` with keys?

- Visit https://github.com/settings/developers to get your keys (don't worry about the callback URL, put whatever you want).
- Load the GITHUB_TOKEN environment variable into your shell.

This command creates site data in `./assets/data.json`

```
GITHUB_TOKEN=<*> npm run data:update
```

## How do I deploy my own version of this?

- Site is hosted on Now, and this is the easiest way to do it.
- You can deploy your own with your own Now account
- You will need to provide GITHUB_TOKEN environment variable in your Vercel configuration.

```sh
# once environment variables are configured, install now and deploy
npm i -g now
now
```

## How do I deploy to production?

Get a commit on master and it will be automatically deployed.
