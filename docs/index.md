# Installation & setup

[**Previous:** Contribution guidelines](../CONTRIBUTING.md) |
[**Next:** Notes for Box employees](./boxers.md)

---

## Prerequisites

This project has a few prerequisites.

* [`Git`](https://git-scm.com/) to download the source code
* [`Node.js`](https://nodejs.org/) for compilation and linting of the API
  specification. Ideally Node 12 or above.
* [`Yarn`](https://yarnpkg.com/) is the Node package manager for this project.
  It can be installed with `npm i -g yarn` if Node is installed.
* [`YamlLint`](https://github.com/adrienverge/yamllint) is the linter to validate
  `Yaml` files. It can be installed with `brew install yamllint` if your machine
  has [`Homebrew`](https://brew.sh) installed.

## Download the code

To setup this project, download the source code and install all the
dependencies.

```sh
git clone git@github.com:box/box-openapi.git box-openapi
cd box-openapi
```

## Run with Node

To run with Node directly, make sure you have Node 14 or higher installed.

```sh
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
yarn lint
```

Additionally, each of the lint steps can be run individually.

<!-- markdownlint-disable line-length -->

```sh
yarn lint:spectral # validates the API spec if valid OpenAPI spec
yarn lint:spelling # checks the spelling in the titles and descriptions
yarn lint:sensitivity # checks the titles and descriptions to ensure we do not use an insensitive language
yarn lint:yaml # validates all *.yml files to ensure they are valid Yaml
```

<!-- markdownlint-enable line-length -->

## Compile the specification

Before the API spec can be used in other applications, it needs to be
compiled and written out as one singular `openapi.json` file.

```sh
yarn build
```

---

[**Next:** Notes for Box employees](./boxers.md)
