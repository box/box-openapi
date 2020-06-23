# Markdown styleguide

[**Previous:** Contributing a pull request](./pull-request.md) 

---

Most of the titles and descriptions in the API specification support Markdown.
The following guidance will help you pass all spell checks and other common
issues.

## Use multi-line text

As descriptions get longer then will be easier to read on multiple lines.

Yaml supports multi-line syntax with the `|-` syntax:

```yaml
description: |-
  This is a long description. It spans 
  multiple lines.

  Additionally by adding a blank line
  in-between text it creates 2 paragraphs.
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

| Endpoint                                  | Verb      | Example          |
|-------------------------------------------|-----------|------------------|
| `GET` to get multiple resources           | List      | List comments    |
| `GET` to get 1 resource                   | Get       | Get comment      |
| `POST` to create a resource               | Create    | Create comment   |
| `POST` to create a relationship           | Assign    | Assign policy    |
| `PUT`/`PATCH` to update a resource        | Update    | Update comment   |
| `DELETE` to delete a resource permanently | Remove    | Remove comment   |
| `DELETE` to delete a relationship         | Un-assign | Un-assign policy |

## Add syntax highlighting 

When writing longer code-blocks, add the language of the sample in the
definition of the code block. This will enable syntax highlighting for the
sample.

~~~
```yaml
---
- title: This is Yaml
```
~~~

## Avoid using `a`, `an` and `the` in titles

Titles of endpoints and resources should not include `a`, `an`, or `the`.

| Bad                   | Good          |
|-----------------------|---------------|
| Get a comment         | Get comment   |
| Assign the policy     | Assign policy |
| List all the comments | List comments |
