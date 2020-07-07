# Contributing

All contributions are welcome to this project.

## Contributor License Agreement

Before a contribution can be merged into this project, please fill out the
Contributor License Agreement (CLA). Any new contributor will be prompted to
sign this agreement our CLA bot upon creating a pull request.

## Development

To contribute to this project we highly recommend reading our guides on
making contributions.

1. [Installation & setup](./docs/index.md)
1. [Notes for Box employees](./docs/boxers.md)
1. [The OpenAPI structure and custom attributes](./docs/structure.md)
1. [Adding a new API resource](./docs/add-resource.md)
1. [Base, mini, standard, and full API resources](./docs/variants.md)
1. [Adding a new API endpoint](./docs/add-endpoint.md)
1. [Contributing a pull request](./docs/pull-request.md)
1. [Markdown styleguide](./docs/markdown.md)

## Deployment

When pushing to the `default` or `staging` branch, GitHub actions will run the
linter and tests and will push the compiled OpenAPI spec to the `en` and
`en-staging` branches respectively.

The pushing of these compiled branches will kick-off a rebuild of the developer
sites, as well as the Postman collections.

## Translation

Once every few weeks a snapshot of the `en` branch is created on the
`en-snapshot` branch and imported into out our in-house translation system
(`Moji`) and sent off for translation.

Once the translation is completed, the translated content is pushed to the `jp`
branch, which then triggers a rebuild of the Japanese developer documentation.
