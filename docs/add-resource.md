# Adding an API resource / schema

[**Previous:** The OpenAPI structure and custom attributes](./structure.md) |
[**Next:** Base, mini, standard, and full API resources](./variants.md)

---

Response schemas are located in the `content/responses/` folder. Every response
is written as a [YAML](https://en.wikipedia.org/wiki/YAML) file.

## Steps to add a resource schema

1. Determine the type of the resource, either a request, response, callback, or
   other schema.
2. Based on that answer, create a file in `content/schemas/*`, `content/errors/*`,
   `content/requests/*` ore `content/responses/*`. An example would be
   `content/responses/file.yml`.
3. Add the default content to the file:
   * A short `title` to give the resource a short human-readable name. Please do
     not use `a`, `an`, or `the` in the title.
   * A `description` to further elaborate on the title.
   * A `type`, which in most cases is either an `object` or an `array`.
   * A unique `x-box-resource-id` if you want the schema to be listed in the
     public developer documentation. Ommitting this will hide the resource.
   * A a list of `properties` for each of the fields of the resource.

## Resource example

```yml
---
title: File
description: The information about a file
type: object
x-box-resource-id: file
properties:
  id:
    type: string
    description: The unique identifier for this file
    example: "11446498"

  type:
    description: |-
      The type of this file, which is always `file`.
    type: string
    example: file
    enum:
      - file
```

## Properties

Almost every schema has a list of `properties`. Please make sure that every
property:

* has a `type` and optional `format`, for example `string` and `date-time`.
* has a `description` and a realistic `example`
* has an `enum` of values if the returned values are only a limited list
* is separated by a new line to improve readability

## Useful things to read

To learn more about the OpenAPI specification and creating schemas, we recommend
reading the following resources.

* [OpenAPI Specification 3.0 (OAS3)](https://swagger.io/specification/)
* [OAS3 data types](https://swagger.io/docs/specification/data-models/data-types/)


---

[**Next:** Base, mini, standard, and full API resources](./variants.md)
