# Box OpenAPI 3.0 specification

> This branch is a work in progress.

The Box OpenAPI 3.0 Specification (OAS3) for interacting with the
[Box Platform API](https://developers.box.com/).

This repository contains the raw source for the specification. For a combined, resolved version please check this [fully build specification](https://opensource.box.com/box-openapi/openapi.json).

## Development

### Prerequisites

This project requires Node for testing, linting, and compilation.

It also needs Hunspell for spell checking to be installed, as this is what is used when running on Travis.

```sh
brew install hunspell
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


## Copyright and License

Copyright 2019 Box, Inc. All rights reserved.

Licensed under the [Apache License](LICENSE).
