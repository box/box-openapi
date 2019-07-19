# Box OpenAPI 3.0 Specification

[![Build Status](https://travis-ci.com/box/box-openapi.svg?branch=master)](https://travis-ci.com/box/box-openapi)
[![Project Status](https://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges) [![Greenkeeper badge](https://badges.greenkeeper.io/box/box-openapi.svg)](https://greenkeeper.io/)

This repository contains the build system for the Box OpenAPI 3.0 Specification (OAS3) of the
[Box Platform API](https://developers.box.com/).

## Downloads

The `master` branch of this repository only contains the raw source for the specification. For a combined, resolved version please have a look at the following builds.

[![OpenAPI (en)](https://img.shields.io/static/v1.svg?label=OpenAPI%203&message=Download&color=grey&labelColor=0361D4&style=for-the-badge&logoColor=white&logo=data:image/png;base64,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)](https://raw.githubusercontent.com/box/box-openapi/en/openapi.json)
[![OpenAPI (en)](https://img.shields.io/static/v1.svg?label=OpenAPI%203&message=ダウンロード&color=grey&labelColor=0361D4&style=for-the-badge&logoColor=white&logo=data:image/png;base64,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)](https://raw.githubusercontent.com/box/box-openapi/jp/openapi.json)

[![Swagger (en)](https://img.shields.io/static/v1.svg?label=Swagger%202&message=Legacy%20Download%20(Incomplete)&color=grey&labelColor=lightgrey&style=for-the-badge&logo=json)](https://github.com/box/box-openapi/tree/swagger_2.0/v2.0)

## Usage & License

This specification is provided under the [Apache License 2.0](LICENSE) license.

As this project is a work in progress no rights can be derived from 
this specification and it may change without warning.

Currently the only recognized downstream dependency of this specification is 
the new Box developer documentation available on [Box.dev](https://box.dev).

## Development

### Prerequisites

This project requires Node for testing, linting, and compilation.

It also needs `hunspell` for spell checking to be installed, as this is what is used when running on Travis.

Additionally, we use `yamllint` to lint the yaml files.

```sh
brew install hunspell yamllint
```

Finally, this project depends on Yarn, the Node package manager.

```sh
npm install -g yarn
```

### Local Development

To work on the source, install the dependencies, start the local web server, and watch for changes.

```bash
git clone git@github.com:box/box-openapi.git
cd box-openapi
yarn install
yarn start
```

This will open a Swagger UI preview on [localhost:8080/](http://localhost:8080/),
watch for changes, and automatically run the linter, spell checker, and all other tests.

### How To: Add a resource

Request and response resources are located in the
`/v2.0/resources/` folder. They are written in [YAML](https://en.wikipedia.org/wiki/YAML).

Before editing any fules, run `yarn start` to start the dev server, Swagger UI
and tests watcher. Alternatively, just run `npm run watch` to run automatically
watch and run the linter and tests.

Resources are automatically linted by `yamllinter`, ensuring that they are valid
YAML. Resources are not automatically included into the spec, as
you will need to explicitly add them to the `v2.0/resources/_index.json` file.

Once resources have been added to this file, they are automatically tested
to ensure they are valid OpenAPI Specification 3.0, as well spell checking, and
some other tests.

#### Tips & Tricks

Please make sure:

* Every resource parameter has a type (and optional format)
* Every resource parameter has a description and example
* Every resource parameter passes the YAML linter
* Every resource parameter is separated by a new line to improve readability

Some useful resources:

* [OpenAPI Specification 3.0 (OAS3)](https://swagger.io/specification/)
* [OAS3 data types](https://swagger.io/docs/specification/data-models/data-types/)

### How To: Add an endpoint

Endpoints are located in the
`/v2.0/paths/` folder. They are written in [YAML](https://en.wikipedia.org/wiki/YAML).

Before editing any fules, run `npm start` to start the dev server, Swagger UI
and tests watcher. Alternatively, just run `npm run watch` to run automatically
watch and run the linter and tests.

Endpoints are automatically linted by `yamllinter`, ensuring that they are valid
YAML. Resources are not automatically included into the spec, as
you will need to explicitly add them to the `v2.0/paths/_index.json` file.

Once paths have been added to this file, they are automatically tested
to ensure they are valid OpenAPI Specification 3.0, as well spell checking, and
some other tests.

#### Tips & Tricks

Please make sure:

* Every endpoint parameter has a type (and optional format)
* Every endpoint parameter has a description and example
* To always return a reference to a resource
* Every parameter is separated by a new line to improve readability

Some useful resources:

* [OpenAPI Specification 3.0 (OAS3)](https://swagger.io/specification/)
* [OAS3 data types](https://swagger.io/docs/specification/data-models/data-types/)

### How to: Use OAS3 inheritance for resources

OpenAPI allows for inheritance of resources as follows:

```yaml
# in foo.yml
---
properties:
  field1:
    type: string
    description: Field 1
    example: "field1"

# in bar.yml
allOf:
  - $ref: "#/components/schemas/Foo"
  - properties:
      field2:
        type: string
        description: Field 2
        example: "field2"
```

### How to: Nest resources

Nesting objects is achieved as follows.

```yml
# in item.yml
properties:
  parent:
    allOf:
      - description: The parent item
      - $ref: '#/components/schemas/Item'
```

This is a bit longer than the alternative syntax (not shown here) but allows for
specifying a description specific to this nesting.

### Known issues

1. As Hunspell uses a different dictionary on development than on Travis the results 
   will vary. As such, Travis spell checks might fail where they pass on a Mac. Inspect
   the errors and add any missing words to the `accepted_words.yml`.
2. You may see many warnings or erors when a reference doesn't resolve properly. Make
   sure to see if there's an unresolved specification before paying attention to other 
   warnings.

## Deployment of compiled source

The Yaml files are automatically tested and compiled using [Travis CI](https://travis-ci.com/box/box-openapi/builds/113026758). The compiled 
JSON specification is then published to the `en` branch here on GitHub. 

For a combined, resolved version please have a look at this [fully build specification](https://opensource.box.com/box-openapi/openapi.json).

# Swagger 2.0

The older and incomplete Swagger 2.0 specification is stil available on the [Swagger 2.0](https://github.com/box/box-openapi/tree/swagger_2.0) branch.
