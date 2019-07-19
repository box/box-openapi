const fs = require('fs-extra')
const { URL } = require('url')
const { Resolver } = require('@stoplight/json-ref-resolver')
const jp = require('jsonpath')

class SwaggerConverter {
  /**
   * Converts an openapi.json file in a folder
   * to a Swagger 2.0 file
   */
  async writeSpecification(folder) {
    const openapiFilename = `build/openapi/openapi.json`
    if (!fs.existsSync(openapiFilename)) { return }

    let openapi = JSON.parse(fs.readFileSync(openapiFilename))
    let resolved = await new Resolver().resolve(openapi)
    openapi = resolved.result

    if (!fs.existsSync(`${folder}`)) { fs.mkdirpSync(`${folder}`)}

    let sw1 = new Swagger(openapi).convert('https://api.box.com/2.0')
    fs.writeFileSync(`${folder}/swagger.json`, JSON.stringify(sw1, null, 2))

    let sw2 = new Swagger(openapi).convert('https://account.box.com/api/oauth2')
    fs.writeFileSync(`${folder}/swagger.authentication.json`, JSON.stringify(sw2, null, 2))

    const sw3 = new Swagger(openapi).convert('https://api.box.com')
    fs.writeFileSync(`${folder}/swagger.authorization.json`, JSON.stringify(sw3, null, 2))

    let sw4 = new Swagger(openapi).convert('https://upload.box.com/api/2.0')
    fs.writeFileSync(`${folder}/swagger.uploads.json`, JSON.stringify(sw4, null, 2))
  }
}

class Swagger {
  constructor(openapi) {
    this.openapi = JSON.parse(JSON.stringify(openapi))
  }

  convert(baseUrl) {
    this.serverUrl = baseUrl
    this.defaultServerUrl = this.openapi.servers[0].url

    return {
      swagger: '2.0',
      info: this.openapi.info,
      host:  new URL(this.serverUrl).host,
      basePath: new URL(this.serverUrl).pathname,
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      paths: this.paths(),
      securityDefinitions: this.securityDefinitions(),
      security: this.openapi.security
    }
  }

  securityDefinitions() {
    return {
      OAuth2Security: {
        type: this.openapi.components.securitySchemes.OAuth2Security.type,
        flow: 'accessCode',
        authorizationUrl: this.openapi.components.securitySchemes.OAuth2Security.flows.authorizationCode.authorizationUrl,
        tokenUrl: this.openapi.components.securitySchemes.OAuth2Security.flows.authorizationCode.tokenUrl,
        scopes: this.openapi.components.securitySchemes.OAuth2Security.flows.authorizationCode.scopes
      }
    }
  }

  paths() {
    let paths = { ...this.openapi.paths }
    paths = this.filterPaths(paths)
    paths = this.mapPaths(paths)
    this.deleteOneOf(paths)
    this.simplifyQueryItems(paths)
    return paths
  }

  /**
   * Removes endpoints that dont belong to this server
   */
  filterPaths(paths) {
    Object.keys(paths).forEach(path => {
      Object.keys(paths[path]).forEach(verb => {
        // get the server override
        const servers = paths[path][verb].servers
        // if the override server does not match the specified server
        // delete this operation
        if (servers && servers[0] && servers[0].url !== this.serverUrl) {
          delete paths[path][verb]
        } else if (!servers && this.defaultServerUrl !== this.serverUrl) {
          delete paths[path][verb]
        } else if (paths[path][verb].servers) {
          delete paths[path][verb].servers
        }
      })
      if (Object.keys(paths[path]).length === 0) {

        delete paths[path]
      }
    })
    return paths
  }

  mapPaths(paths) {
    Object.keys(paths).forEach(path => {
      Object.keys(paths[path]).forEach(verb => {
        paths[path][verb] = this.operation(paths[path][verb])
      })
    })
    return paths
  }

  operation(endpoint) {
    endpoint = this.removeVendorAttributes(endpoint)
    endpoint.parameters = this.parameters(endpoint)
    endpoint.responses = this.responses(endpoint.responses)

    this.deleteAllAttributes(endpoint, 'example')
    this.deleteAllAttributes(endpoint, 'explode')
    this.deleteAllAttributes(endpoint, 'nullable')

    return endpoint
  }

  removeVendorAttributes(item) {
    Object.keys(item).forEach(key => {
      if (key.startsWith('x-')) { delete item[key] }
    }) 
    return item
  }

  parameters(endpoint) {
    let parameters = []
    if (!endpoint.parameters) { endpoint.parameters = [] }

    endpoint.parameters.forEach(parameter => {
      parameters.push(this.parameter(parameter))
    })

    if (endpoint.requestBody) {
      const body = Object.values(endpoint.requestBody)[0]
      const [contentType, { schema }] = Object.entries(body)[0]
      if (contentType === 'application/x-www-form-urlencoded') {
        endpoint.consumes = [contentType]
        this.formData(parameters, schema)
      } else if (contentType === 'application/json') {
        this.body(parameters, schema)
      }
    }

    delete endpoint.requestBody
    return parameters
  }

  parameter(parameter) {
    if (parameter.in !== 'body') {
      parameter = { ...parameter, ...parameter.schema }
      delete parameter.schema
    }
    return parameter
  }

  responses(responses) {
    if (!responses) { return {} }
    Object.keys(responses).forEach(key => {
      responses[key] = this.response(responses[key])
    })
    return responses
  }


  response(response) {
    if (response.content) {
      const content = Object.entries(response.content)[0][1]
      response = { ...response, ...content }
      delete response.content
    }
    if (response.headers) {
      this.responseHeaders(response.headers) 
    } 
    return response
  }

  responseHeaders(headers) {
    Object.keys(headers).forEach(key => {
      headers[key] = this.responseHeader(headers[key])
    })
  }

  responseHeader(header) {
    if (header.schema) {
      header = { ...header, ...header.schema }
      delete header.schema
    }
    return header
  }

  formData(parameters, schema) {
    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, property]) => {
        const required = schema.required && schema.required.includes(key)
        parameters.push(this.formDataEntry(key, property, required))
      })
    }
    return parameters
  } 

  formDataEntry(key, property, required) {
    delete property.example
    property.name = key
    property.in = 'formData'
    property.required = required
    return property 
  }

  body(parameters, schema) {
    parameters.push({
     name: 'body',
     in: 'body',
     schema: schema
    })
  } 

  deleteAllAttributes(object, key) {
    const paths = jp.paths(object, `$..${key}`)
    paths.forEach(path => {
      path.pop()
      jp.apply(object, jp.stringify(path), (value) => {
        delete value[key]
        return value
      })
    })
  }

  deleteOneOf(object) {
    const paths = jp.paths(object, `$..oneOf`)
    paths.forEach(path => {
      path.pop()
      jp.apply(object, jp.stringify(path), (value) => {
        return value.oneOf[0]
      })
    })
  }

  simplifyQueryItems(object) {
    const paths = jp.paths(object, `$..items`)
    paths.forEach(path => {
      path.pop()
      jp.apply(object, jp.stringify(path), (value) => {
        if (value.in === 'query') {
          value.items = { type: 'string' }
        }
        return value
      })
    })
  }
}

module.exports = new SwaggerConverter()