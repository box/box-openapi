# Base, mini, standard, and full API resources

[**Previous:** Adding an API resource](./add-resource.md) |
[**Next:** Adding a new API endpoint](./add-endpoint.md)

---

## Intro to variants

In Platform APIs, resources appear in API responses formatted in up to 4
different formats: **Base**, **Mini**, **Standard**, and **Full**. 

A resource format is defined as the set of fields that appear in the response to
represent that resource. Because clients do not have full flexibility of
requesting which fields they want from a resource, the API designer must
consider trade offs when defining the formats. The formats should be defined in
a way that balances the chattiness of the client against the cost to generate
the fields in the response.

| Format     | Variant | File name                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|------------|---------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Base`     | `0`     | `<resource>--base.yml`                         | This format includes the basic fields that are always returned for this resource. For most resources these fields are just `type` and `id`. They represent the fields that always appear for this resource, regardless of which `fields` the client requests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Mini`     | `1`     | `<resource>--mini.yml`                         | This format includes the most useful fields for a resource that are almost always needed to understand what the resource represents. This format appears in collections, and as sub-resources in a parent resource. For most resources these fields are the Base fields plus anything additional that uniquely represents this item. An example would be the email address of a user, or the name of a folder. It is recommended to restrict this set of fields to the ones that are inexpensive to compute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `Standard` | `2`     | `<resource>.yml` or `<resource>--standard.yml` | This format includes the standard set of fields for a resource that are returned by default when the resource is explicitly requested.  This format appears when the client explicitly calls the endpoint to get this resource.  For most resources these fields are the `Mini` fields plus anything any additional that the client would generally need. It is recommended to include fields that most clients would typically find useful for this resource, yet exclude any fields that are expensive to compute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `Full`     | `3`     | `<resource>.yml`                               | This format represents all the possible fields for a resource that could be returned. This format is generally used in the same endpoints as the `Standard` format, allowing a client to request any fields in the Full response with the help of the fields query parameter. For most resources this format represents the Standard format plus any additional field that is expensive to compute, or has been introduced since the API was released and did not warrant a backwards incompatible change to the API. It is important to note that by using the fields query parameter clients can request individual attributes of the Full format, yet rarely do clients requests all the fields in this format at once. It also worth noting that together with the specified fields in the query, this response will always include the Base fields for the object. In other words, when requesting the tags and label fields of a `Discussion`, the client will also receive the `id` and the `type` in the response. |

## Cheat sheet

Answer the following questions.

1. Do any of the endpoints that return your resource support the `fields` query
   parameter (or a similar parameter) to return extra fields for your resource?
2. Can a smaller (`Mini`) version of your resource be nested within the response
   for another resource? For example a user might be nested within a file
   resource to list person who uploaded the file.

If you answered:

* **No** to both questions:
  * The resource does not have any variants.
  * Create a `<resource>.yml` file and list all fields in that file
  * No need to add any custom attributes to specify the field variants.
* **Yes** to (1) and **No** to (2):
  * The resource has a `Base`, `Standard`, and `Full` variant.
  * Create a `<resource>.yml`, `<resource>--standard.yml`, and
    `<resource>--base.yml` file.
  * The `Full` file inherits from the `Standard` file, which inherits from the
    `Base` file.
  * List the relevant fields in each variant, and set their
    `x-box-field-variant` to `0` (`Base`), `2` (`Standard`) and `3` (`Full`)
    respectively.
  * Set the `x-box-has-field-variants: true` attribute in the `<resource>.yml`
    file only.
  * Set the `x-box-resource-id` attribute in the `<resource>.yml` file only.
    This will make sure only the full resource gets displayed in the UI.
* **No** to (1) and **Yes** to (2):
  * The resource has a `Mini` and `Standard` variant.
  * Create a `<resource>.yml` and `<resource>--mini.yml`.
  * The `Standard` file inherits from the `Mini` file.
  * List the relevant fields in each variant, and set their
    `x-box-field-variant` to `1` (`Mini`) and `2` (`Standard`).
  * Set the `x-box-has-field-variants: true` attribute in the `<resource>.yml`
    file only.
  * Set the `x-box-resource-id` attribute in the `<resource>.yml` file only.
    This will make sure only the full resource gets displayed in the UI.
* **Yes** to both questions:
  * The resource has a `Base`, `Standard`, `Mini`, and `Full` variant.
  * Create a `<resource>.yml`, `<resource>--standard.yml`, `<resource>--mini.yml` and
    `<resource>--base.yml` file.
  * The `Full` file inherits from the `Standard` file, which inherits from the
    `Mini` file, which inherits from the `Base` file.
  * List the relevant fields in each variant, and set their
    `x-box-field-variant` to `0` (`Base`), `1` (`Mini`), `2` (`Standard`) and
    `3` (`Full`) respectively.
  * Set the `x-box-has-field-variants: true` attribute in the `<resource>.yml`
    file only.
  * Set the `x-box-resource-id` attribute in the `<resource>.yml` file only.
    This will make sure only the full resource gets displayed in the UI.

## File Names

For every resource, at least the `<resource>.yml` (e.g. `file.yml`) version
needs to exist. For a resource that supports all 4 variants, the files would
inherit each other as follows.

```
file.yml -> file--standard.yml -> file-mini.yml -> file-base.yml
```

In some cases, there might only be a `Standard` and a `Mini` variant of a
resource, in these cases the `Standard` file with have the `<resource>.yml`
name, and the other variants can be omitted.

```
file.yml -> file-mini.yml 
```

## Inheritance & Field Variants

Each variant of a resource inherits from the previous resource.

For example, for a `Mini` item would inherit from a `Base` item.

```yml
---
allOf:
  - $ref: '#/components/schemas/Item--Base'
  - title: Item (Mini)
  - description: A mini variant of an item
  - properties: 
      type: 
        type: string
        description: The type of this item
        example: file
        x-box-field-variant: 1
```

Within each file it's important to specify a `x-box-field-variant` for each
property in a schema. This tells the developer documentation what version a
field belongs to.


## Used variant resources

Using variant resources in API responses and requests can be a tricky situation.
Here are some guidelines.

### Nested resource

For nested resources, we recommend creating a reference to the  `Mini` variant
when that's returned.

For example, a comment lists the user that created the comment as follows.

```yml
created_by:
  allOf:
    - $ref: '#/components/schemas/User--Mini'
    - description: |-
        A mini user object representing the author of the
        comment
```

As the `Mini` user does not have an `x-box-resource-id`, this user will be
rendered in-line in the developer documentation, which is desired.

### API responses

An API endpoint that supports a `field` query parameter by default returns a
standard object, but allows for querying additonal fields. The OpenAPI standard
doesn't support specifying which fields are returned by default. 

In our specification we recommend to simply point at the `Full` resource in
these cases in the API response.

For example, for the `GET /files/:id` endpoint, the response is as follows.

```yaml
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
```

The developer documentation will link to the `Standard` file object by default,
and will allow the user to explore the other resource variants.

### Explicitly specifying the variant

In some cases, a resource might have multiple variants but the API always
returns a specific version. In these cases, the developer UI can be given a hint
to link to that specific version as follows.

```yml
properties:
  entries:
    description: |-
      A list of files or folders.
    type: array
    x-box-resource-variant: 1
    items:
      oneOf:
        - $ref: '#/components/schemas/File'
        - $ref: '#/components/schemas/Folder'
```

In this case, this tells the developer documentation that the item nested here
is always a `Mini` representation.

---

[**Next:** Adding a new API endpoint](./add-endpoint.md)
