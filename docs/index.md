# Installation & setup

[**Previous:** Contribution guidelines](../CONTRIBUTING.md) |
[**Next:** Notes for Box employees](./boxers.md)

---

## Prerequisites

This project has a few prerequisites.

* [Git](https://git-scm.com/) to download the source code
* [Node.js](https://nodejs.org/) for compilation and linting of the API
  specification. Ideally Node 12 or above.
* [Yarn] is the Node package manager for this project. It can be installed with
  `npm i -g yarn` if Node is installed.
* [Yaml Lint](https://github.com/adrienverge/yamllint) is the linter to validate
  Yaml files. It can be installed with `brew install yamllint` if your machine
  has [Homebrew](https://brew.sh) installed.

## Download and install dependencies

To setup this project, download the source code and install all the
dependencies.

```sh
git clone git@github.com:box/box-openapi.git box-openapi
cd box-openapi
yarn install
yarn start
```

This final `yarn start` command starts up a local server and watches the files
for changes. It will open up a browser window with a preview of the compiled API
specification.

## Lint and validate the tests

With the dependencies installed, it is possible to lint the API spec. Linting
validates the API specification is correct, has no spelling mistakes, and that
there are no obvious incorrect links.

```sh
yarn test
```

Additionally, each of the lint steps can be run individually.

```sh
yarn test:spectral # validates the API spec if valid OpenAPI spec
yarn test:spelling # checks the spelling in the titles and descriptions 
yarn test:sensitivity # checks the titles and descriptions to ensure we do not use an insensitive language
yarn lint:yaml # validates all *.yml files to ensure they are valid Yaml
```

## Compile the specification

Before the API spec can be used in other applications, it needs to be compiled
and written out as one singular `openapi.json` file.

```sh
yarn build
```

---

[**Next:** Notes for Box employees](./boxers.md)
