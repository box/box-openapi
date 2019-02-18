# Box OpenAPI 3.0 specification

> This branch is a work in progress.

The Box OpenAPI 3.0 Specification (OAS3) for interacting with the
[Box Platform API](https://developers.box.com/).

This repository contains the raw source for the specification. For a combined, resolved version please check this [fully build specification](https://opensource.box.com/box-openapi/openapi.json).

## Development

### Prerequisites

This project requires Node for testing, linting, and compilation.

It also needs `hunspell` for spell checking to be installed, as this is what is used when running on Travis.

Additionally, we use `yamllint` to lint the yaml files.

```sh
brew install hunspell yamllint
```

### Local Development

To work on the source, install the dependencies, start the local web server, and watch for changes.

```bash
git clone git@github.com:box/box-openapi.git
cd box-openapi
npm install
npm start
```

This will open a Swagger UI preview.

### How To: Edit Resources

Request and response resources are located in `/v2.0/resources/` and are written
in Yaml.

Run `npm start` to start the dev server and test watcher, or just run `npm run watch`
to run the tests and linter. 

Resources are automatically linted by `yamllinter`. Resources are not automatically 
included into the spec, and will need to be added to `v2.0/resources/_index.json`
before they are tested.

Please make sure:

* Every resource parameter has a type (and optional format) -[see OAS3 spec](https://swagger.io/docs/specification/data-models/data-types/)
* Every resource parameter has a description and example
* Every resource parameter passes yaml linting
* Every resource parameter is seperated by a new line to improve readability

## Copyright and License

Copyright 2019 Box, Inc. All rights reserved.

Licensed under the [Apache License](LICENSE).
