# Box OpenAPI 3.0 Specification

This repository contains the Box OpenAPI 3.0 Specification (OAS3) for the [Box Platform API](https://developers.box.com/).

## API Specifications
The main branch of this repository contains the openapi.json file, which is the latest description of the Box Platform API 
in OpenAPI 3.0. It remains here to maintain compatibility with existing integrations that use the Box API.

Box introduced versioning for Public APIs in 2025. You can find the original API specification and all new versions 
in the openapi directory. For example:
- The [openapi.json](./openapi/openapi.json) file contains all APIs from the Box API before versioning was introduced.
- The [openapi-v2025.0.json](./openapi/openapi-v2025.0.json) file contains the APIs introduced in version 2025.0. The version number is suffixed to the file name. 

Details on how versioning works in Box APIs can be found in the [Box API Versioning Strategy](https://developer.box.com/guides/api-calls/api-versioning-strategy/).

## Translations
Currently, we offer a Japanese translation of our API schema:

[![OpenAPI (jp)](https://img.shields.io/static/v1.svg?label=OpenAPI%203&message=ダウンロード&color=grey&labelColor=0361D4&style=for-the-badge&logoColor=white)](https://raw.githubusercontent.com/box/box-openapi/jp/)

## Contribution

Details can be found in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Usage & License

Copyright 2020 Box, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at <http://www.apache.org/licenses/LICENSE-2.0.>

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.