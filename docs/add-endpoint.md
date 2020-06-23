# Adding an API endpoint

[**Previous:** Base, mini, standard, and full API resources](./variants.md) |
[**Next:** Contributing a pull request](./pull-request.md)

---

Endpoint definitions are located in the `content/paths/` folder. Every endpoint
is written as a [YAML](https://en.wikipedia.org/wiki/YAML) file.

## Quick start

1. Determine the `operationId` and `tag` of the `endpoint`.
2. Based on those answer, create a file in `content/paths/{tag}__{operationId}.yml`
3. Add the default content to the file:

   * The `operationId`
   * A short `title` to give the endpoint a short human-readable name. Please do
     not use `a`, `an`, or `the` in the title, and ideally start the title with
     `Create`, `Update`, `List`, `Get`, or `Delete`.
   * A `description` to further elaborate on the title.
   * A single tag listed under `tags`, and a reference to the same tag in
     `x-box-tag`. These tags need to match the name and ID of a tags listed in
     `content/common/tags.yml`.
   * A list of query, header, or path `parameters`
   * An optional `requestBody` for any `POST` or `PUT` endpoints.
   * A list of responses, with at least 1 response in the `2XX` range, and a
     `default` response that points to a `ClientError`.

## `operationId` syntax

The `operationId` is determined as follows:

<!-- markdownlint-disable line-length -->

| Steps                                                 |                                                   |
|-------------------------------------------------------|---------------------------------------------------|
| Take the full verb and path of the endpoint.          | `GET /2.0/files/{file_id}/metadata/{metadata_id}` |
| Remove the version number.                            | `GET /files/{file_id}/metadata/{metadata_id}`     |
| Replace any variable in the path with `id`.           | `GET /files/id/metadata/id`                       |
| Replace any `/` (except for trailing one) with a `_`. | `GET _files_id_metadata_id`                       |
| Lower case the `verb` and append to the path.           | `get_files_id_metadata_id`                        |

<!-- markdownlint-enable line-length -->

## Example

```yml
---
operationId: get_files_id

summary: Get file information

tags:
  - Files

x-box-tag: files

description: |-
  Retrieves the details about a file.

parameters:
  - $ref: '../attributes/file_id.yml'
  - $ref: '../attributes/fields.yml'

responses:
  200:
    description: |-
      Returns a file object.

      Not all available fields are returned by default. Use the
      [fields](#param-fields) query parameter to explicitly request
      any specific fields.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/File'

  404:
    description: |-
      Returned if the file is not found, or the user does not
      have access to the file.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ClientError'

  default:
    description: |-
      An unexpected client error.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ClientError'

```

### Parameters & Properties

Almost every endpoint has a list of `parameters` or a `requestBody` with a list
of `properties`. Please make sure that every parameter or property:

* has a `type` and an optional `format`, for example `string` and `date*time`.
* has a `description` and a realistic `example`
* has an `enum` of values if the returned values are only a limited list

## Additional reads

To learn more about the OpenAPI specification and creating endpoints, we
recommend reading the following resources.

* [OpenAPI Specification 3.0 (OAS3)](https://swagger.io/specification/)
* [Path objects](hhttps://swagger.io/specification/#path-item-object)

---

[**Next:** Contributing a pull request](./pull-request.md)
