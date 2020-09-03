# Box OpenAPI 3.0 Specification

![CI](https://github.com/box/box-openapi/workflows/CI/badge.svg) [![Project Status](https://opensource.box.com/badges/active.svg)](http://opensource.box.com/badges)

This repository contains the build system for the Box OpenAPI 3.0 Specification
(OAS3) of the
[Box Platform API](https://developers.box.com/).

## Downloads

The `main` branch of this repository only contains the raw source for the
specification. For a combined, resolved version please have a look at the
following builds.

[![OpenAPI (en)](https://img.shields.io/static/v1.svg?label=OpenAPI%203&message=Download&color=grey&labelColor=0361D4&style=for-the-badge&logoColor=white)](https://raw.githubusercontent.com/box/box-openapi/en/openapi.json)
[![OpenAPI (en)](https://img.shields.io/static/v1.svg?label=OpenAPI%203&message=ダウンロード&color=grey&labelColor=0361D4&style=for-the-badge&logoColor=white)](https://raw.githubusercontent.com/box/box-openapi/jp/openapi.json)

[![Swagger (en)](https://img.shields.io/static/v1.svg?label=Swagger%202&message=Backported&color=grey&labelColor=0361D4&style=for-the-badge)](https://github.com/box/box-openapi/tree/swagger-2.0)
[![Swagger (en)](https://img.shields.io/static/v1.svg?label=Swagger%202&message=Legacy%20/%20Incomplete&color=grey&labelColor=lightgrey&style=for-the-badge)](https://github.com/box/box-openapi/tree/legacy-swagger-2.0/v2.0)

## Swagger 2.0

The older and incomplete Swagger 2.0 specification is still available on the
[Swagger 2.0](https://github.com/box/box-openapi/tree/swagger_2.0) branch.

## Development & Contribution

Please follow the [contribution guidelines](./CONTRIBUTING.md) when contributing
to the source of this project.

1. [Installation & setup](./docs/index.md)
1. [Notes for Box employees](./docs/boxers.md)
1. [The OpenAPI structure and custom attributes](./docs/structure.md)
1. [Adding a new API resource](./docs/add-resource.md)
1. [Base, mini, standard, and full API resources](./docs/variants.md)
1. [Adding a new API endpoint](./docs/add-endpoint.md)
1. [Contributing a pull request](./docs/pull-request.md)
1. [Markdown styleguide](./docs/markdown.md)

## Usage & License

Copyright 2020 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at <http://www.apache.org/licenses/LICENSE-2.0.>

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
