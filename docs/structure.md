# OpenAPI structure & custom attributes

[**Previous:** Notes for Box employees](./boxers.md) |
[**Next:** Adding an API resource](./add-resource.md)

---

As it would be unwieldy to maintain our API specification as one massive OpenAPI 
file, we instead have opted to break the specification into a file for every API
endpoint (**path**) and every object model (**schema**).

The OpenAPI specication is **build** by starting at the `content/openapi.yml`
file, resolving every reference (signified by `$ref` fields) to other files, and
writing out the compiled specification to `build/openapi.json`

## Project structure

The following is the rough layout of this project.

- `content/` - The folder that contains all the API specification. If you only
  want to make changes to the API specification, then this is the only file you
  need.
    - `openapi.yml` - The entry file from where the API specification is build.
      This includes references to other files.
    - `paths.yml` - A list of paths, verbs, and a mapping for each one of those
      to a file in `content/paths/*`. This is the canonnical list of API
      endpoints in our API specification.
    - `schemas.yml` - A list re-usable object models (called **schemaas** in
      OpenAPI terms) and a mapping for each one of those
      to a file in `content/schemas/*`, `content/errors/*`,
      `content/requests/*`, `content/responses/*`. This is the canonnical list
      of objects that the API can return.
    - `common/` - This folder contains the rarerly updated parts of the API
      specification, like its name, description, security protocols, and tags.
      In most cases you would not need to edit this, with the exception of
      adding new tags for new APIs.
    - `paths/` - A list of files that each represent an API endpoint (defined by
      the HTTP verb and the path).
    - `requests/` - A list of request objects. We currently only have
      a handful of these in use, but we recommend every new API to create a
      request object if the request has a `requestBody` value.
    - `responses/` - A list of response objects as returned by APIs.
    - `errors/` - A list of error objects that can be returned by APIs. There is
      nothing special about this folder, it's just a way to keep this apart from
      the regular response objects.
    - `callbacks/` - A list of callback payloads that are not returned
      by any API, but are instead the payloads provided in webhooks and skills
      events.
    - `schemas` - A list of schemas that do not fit any of the other categories
      above.
    - `attributes.` - A list of re-usable fields, parameters, and other little
      tidbits. The do not represent entire schemas, but instead only represent
      smaller parts of the API spec. 
- `build/` - This is where the compiled `openapi.json` is written to after
  running `yarn build`.
- `src/` - The code base that includes our linting code, as well as our
  functional tests.
- `.spelling` - Contains additional words to add to the dictionary.
  
## Using `$ref` references

Across the API spec we use references (`$ref`) to other files as well as other
parts of the OpenAPI spec.

- To link to a request, response, error, callback, or other schema you can use
  the following syntax `$ref: '#/components/schemas/User'`. This requires `User`
  to exist in the `content/schemas.yml`, and for it to have a reference to a
  valid file itself. These references will **not** be resolved during the build
  process, and the final `openapi.json` will have all these references in place.
- To link to a file, use the relative path of the file including its extension,
  for example `$ref: '../attributes/fields.yml'`. These references will be
  resolved during the build process, effectively copy-pasting the content of the
  file at the location of the `$ref`.

For more information on using `$ref`, please see the [OpenAPI
documentation](https://swagger.io/docs/specification/using-ref/).

## Using inheritance

Sometimes it might make sense for a schema to inherit the properties of another
schema. To do this, you can use `allOf` and a reference to another schema.

For example, assume the following `Item`

```yml
---
title: Item 
type: object
description: An item

properties:
  id:
    type: string
    description: The unique identifier for this item
    example: "11446498"
```

A `TypedItem` would inherit from `Item`.

```yml
---
## We want all of the following to apply
allOf:
  # Inherit everything from the Item
  - $ref: '#/components/schemas/Item'
  # Overwrite the title & description of
  # the Item with a new description
  - title: Typed Item
  - description: A typed item
  # Add another field
  - properties:
      type: 
        type: string
        description: The type of this item
        example: file
```

## Custom OpenAPI attributes

We use a few custom attributes in our API specification.

| Name                       | Description                                                                                                                                                                                                                                  |
|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `x-box-tag`                | Used to assign a response schema or endpoint/path to a `Tag`. Must match one of the values in `content/common/tags.yml`.                                                                                                                     |
| `x-box-resource-id`        | Used to define specify that a resource needs to be listed in the API documentation. This ID needs to be unique is part of the slug of the resource. Without this ID the resource will be hidden from the documentation.                      |
| `x-box-enable-explorer`    | Used to explicitly turn the API explorer in the documentation on or off for this API endpoint. Defaults to `true` for all non-`DELETE` endpoints                                                                                             |
| `x-box-sanitized`          | Used to mark of an endpoint has ever been sanitized. AS we imported a lot of this spec from an old specification, we are not always 100% sure of the quality of an endpoint. A sanitized endpoint has been reviewed by a human since import. |
| `x-box-has-field-variants` | Used to define if a response resource has different variants, like a `Base`, `Mini`, `Standard`, and `Full` variant. See [`variants.md`](./variants.md) for more details.                                                                    |
| `x-box-field-variant`      | Used to define what resource variant a field belongs to: a `Base` (`0`), `Mini`, (`1`), `Standard` (`2`), pr `Full` (`3`) variant. See [`variants.md`](./variants.md) for more details.                                                      |
| `x-box-resource-variant`   | Used to send a hint to the API documentation as to what variant a nested resource would appear as by default.                                                                                                                                |

## Naming conventions

### Endpoints

Each endpoint has to be put into its own file. The name of this file is
determined as follows:

| Format                     | Example                           |
|----------------------------|-----------------------------------|
| `{tag}__{operationId}.yml` | `uploads__post_files_content.yml` |

In this case `tag` represents the `x-box-tag` value in the file. The
`operationId` is the value with the same name in the file.

The `operationId` is determined as follows:

| Steps                                                 |                                                   |
|-------------------------------------------------------|---------------------------------------------------|
| Take the full verb and path of the endpoint.          | `GET /2.0/files/{file_id}/metadata/{metadata_id}` |
| Remove the version number.                            | `GET /files/{file_id}/metadata/{metadata_id}`     |
| Replace any variable in the path with `id`.           | `GET /files/id/metadata/id`                       |
| Replace any `/` (except for trailing one) with a `_`. | `GET _files_id_metadata_id`                       |
| Downcase the `verb` and append to the path.           | `get_files_id_metadata_id`                        |

### Resources / Schemas

A schema file name should ideally resemmble the name of title of the schema.
For example, a `Metadata Template` should have the file name
`metadata_template.yml`. Ideally, the filename should match the value for any
`x-box-resource-id` value in the file.

---

[**Next:** Adding an API resource](./add-resource.md)
