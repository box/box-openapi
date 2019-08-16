Contributing
============

All contributions are welcome to this project.

Contributor License Agreement
-----------------------------

Before a contribution can be merged into this project, please fill out the
Contributor License Agreement (CLA) located at:

http://opensource.box.com/cla

To learn more about CLAs and why they are important to open source projects,
please see the [Wikipedia entry][1].

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

How to contribute
-----------------

* **File an issue** - if you found a bug, want to request an enhancement, or
  want to implement something (bug fix or feature).
* **Send a pull request** - if you want to contribute to Box API
  specification. Please be sure to file an issue first.

Pull request best practices
---------------------------

Following these steps will help ensure that your pull request gets reviewed and
accepted as quickly as possible.

### Step 1: File an issue

Before making any changes to the specification, please file an issue stating the
problem you want to solve or the feature you want to implement. This allows us
to give you feedback before you make any changes. There may be a known
limitation that can't be addressed, or a bug that has already been fixed in a
different way. The issue allows us to communicate and figure out if it's worth
your time for the project.

### Step 2: Fork this repository in GitHub

This will create your own copy of our repository.

### Step 3: Add the upstream source

The upstream source is the project under the Box organization on GitHub. To add
an upstream source for this project, type:

```
git remote add upstream git@github.com:box/box-openapi.git
```

This will come in useful later.

### Step 4: Create a feature branch

Create a branch with a descriptive name, such as `add-upload-session`.

### Step 5: Push your feature branch to your fork

As you make changes, continue to push the changes to your remote feature
branch. Please make sure to include the issue number you're addressing in the
body of your commit message and adhere to
[standard git commit message guidelines][2]. For example:

```
Add upload-session

Introduced a new API endpoint /upload-session.

Closes #123.
```

This helps us out by allowing us to track which issue your commit relates to.

Keep a separate feature branch for each issue you want to address.

### Step 6: Rebase

Before sending a pull request, rebase against upstream, such as:

```
git fetch upstream
git rebase upstream/master
```

This will add your changes on top of what's already in upstream, minimizing
merge issues.

### Step 7: Send the pull request

Send the pull request from your feature branch to us. Be sure to include a
description in your commit message (not the pull request description) that lets
us know what work you did.

Keep in mind that we like to see one issue addressed per pull request, as this
helps keep our git history clean and we can more easily track down issues.

[1]: http://en.wikipedia.org/wiki/Contributor_License_Agreement
[2]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
