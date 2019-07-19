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
