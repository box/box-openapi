# Box OpenAPI 3.0 specification

[![Build Status](https://travis-ci.com/box/box-openapi.svg?branch=master)](https://travis-ci.com/box/box-openapi)
[![Project Status](https://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)


The Box OpenAPI 3.0 Specification (OAS3) for the
[Box Platform API](https://developers.box.com/).

This repository contains the raw source for the specification. For a combined, resolved version please have a look at this [fully build specification](https://opensource.box.com/box-openapi/openapi.json).

## Usage & License

This specification is provided under the [Apache License 2.0](LICENSE) license.

As this project is a work in progress no rights can be derived from 
this specification and it may change without warning.

Currently the only recognised downstream dependency of this specification is 
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

# Swagger 2.0

The older and incomplete Swagger 2.0 specification is stil available on the [Swagger 2.0](https://github.com/box/box-openapi/tree/swagger_2.0) branch.
