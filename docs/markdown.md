# Markdown styleguide

[**Previous:** Contributing a pull request](./pull-request.md) |
[**Next:** Updating dependencies](./dependencies.md)

---

Most of the titles and descriptions in the API specification support Markdown.
The following guidance will help you pass all spell checks and other common
issues.

## Use multi-line text

As descriptions get longer then will be easier to read on multiple lines.

`Yaml` supports multi-line syntax with the `|-` syntax:

```yaml
description: |-
  This is a long description. It spans
  multiple lines.

  Additionally by adding a blank line
  in-between text it creates 2 paragraphs.
```

## Limit line length

We enforce a maximum line length of 80 characters. In general this is enough for
most people to easily read the content. Most advanced code editors allow for
automatic wrapping of content at the 80 character mark. Check your code editor
for details.

In the extreme case that a line can not be kept under 80 characters, for example
when creating markdown tables, you can use the following syntax to make an
exception.

```md
<!-- markdownlint-disable line-length -->

Do something long here ...........................................

<!-- markdownlint-enable line-length -->
```

## Escape any code and brand names

The spell-checker will often fail on brand names
and any pieces of code. Rather than adding these
words to the dictionary, we recommend instead that you
use backticks to describe any of these words.

```yaml
description: |-
  The `ad_id` field represents the `Active Directory`
  identifier of this user.
```

For example:

* Product names like `NodeJS`
* References to function names like `getFileById()`, `BoxConfig.doThatThing()`,
  etc
* References to variable names like `file_id`, `allow_access`, etc
* Version numbers, like `v1.0.0`, or `V2.0`
* Or alternatively capitalize acronyms, like TLS, SSH, etc, as these will be
  ignored by the spell-checker as well.

Backticked words will not be translated, so only use
backticks for words that do not require translation.

## Add unknown words to dictionary

In the extreme case that a word is not recognized
by our dictionary, and it's a word that needs to be
translated and therefore can not be escaped using
backticks, the word can be added to the `.spelling`
file at the root of the project.

## Endpoint titles start with verbs

Ideally the title of an endpoint should start with
a verb.

| Endpoint                                  | Verb     | Example         |
|-------------------------------------------|----------|-----------------|
| `GET` to get multiple resources           | List     | List comments   |
| `GET` to get 1 resource                   | Get      | Get comment     |
| `POST` to create a resource               | Create   | Create comment  |
| `POST` to create a relationship           | Assign   | Assign policy   |
| `PUT`/`PATCH` to update a resource        | Update   | Update comment  |
| `DELETE` to delete a resource permanently | Remove   | Remove comment  |
| `DELETE` to delete a relationship         | Unassign | Unassign policy |

## Add syntax highlighting

When writing longer code-blocks, add the language of the sample in the
definition of the code block. This will enable syntax highlighting for the
sample.

<!-- markdownlint-disable code-fence-style fenced-code-language -->

~~~
```yaml
---
- title: This is Yaml
```
~~~

<!-- markdownlint-enable code-fence-style fenced-code-language -->

## Avoid using `a`, `an` and `the` in titles

Titles of endpoints and resources should not include `a`, `an`, or `the`.

| Bad                   | Good          |
|-----------------------|---------------|
| Get a comment         | Get comment   |
| Assign the policy     | Assign policy |
| List all the comments | List comments |

## Don't over capitalize titles

Titles and headers should only be capitalized at the start of the title, and for
names.

| Bad                        | Good                       |
|----------------------------|----------------------------|
| Add `owner` Field to Files | Add `owner` field to files |
| Allow File API To Use JWT  | Allow file API to use JWT  |
| Box CLI `3.0.0` Release    | Box CLI `3.0.0` release    |

## Standards for Box terminology

* Custom App refers to the type of app selected in the create new app flow
whereas custom application refers to the custom solution build by the customer
* Access Token
* Box Admin
* App Users and Managed Users
* Developer Console
* Service Account
* support article or support resource
* bold button names
* capitalize setting names
* use application vs app when possible

[**Next:** Updating dependencies](./dependencies.md)
