/**
 * A crude script for creating path yaml files from the 
 * legacy Swagger spec
 */
const converter = require('swagger2openapi')
const fs = require('fs')
const changeCase = require('change-case')
const yaml = require('js-yaml')

const readSpec = (fileName) => {
  return JSON.parse(fs.readFileSync(fileName).toString())
}

const convertSpec = async (oldSpec) => {
  return (await converter.convertObj(oldSpec, {
    targetVersion: '3.0.2'
  })).openapi
}

const exportResponse = (key, resource) => {
  let snakeName = changeCase.snake(key)
  let fileName = `./dev/importers/assets/${snakeName}.yml`
  let content = "---\n"+yaml.safeDump(resource)
  fs.writeFileSync(fileName, content)
}

const exportResponses = (spec) => {
  let schemas = spec.components.schemas
  for (const key in schemas) {
    if (schemas.hasOwnProperty(key)) {
      const resource = schemas[key];
      exportResponse(key, resource)
    }
  }
}

const importResponses = async (fileName) => {
  let oldSpec = readSpec(fileName)
  let newSpec = await convertSpec(oldSpec)
  exportResponses(newSpec)
}

const operationIdFor = (verb, path) => {
  let lowerVerb = verb.toLowerCase()
  let snakePath = path.replace(/\//g, "_").replace(/{.*}/g, 'id')
  return `${lowerVerb}${snakePath}`
}

const fileNameFor = (operationId, tag) => {
  let snakeTag = changeCase.snake(tag)
  return `${snakeTag}__${operationId}.yml`
}

const exportPath = (verb, path, resource) => {
  let operationId = operationIdFor(verb, path)
  let fileName = fileNameFor(operationId, resource.tags[0])
  resource.operationId = operationId
  delete resource.externalDocs
  let content = "---\n"+yaml.safeDump(resource)
  fs.writeFileSync(`./dev/importers/assets/${fileName}`, content)
}

const exportPaths = (spec) => {
  let resources = spec.paths
  Object.keys(resources).forEach((path) => {
    Object.keys(resources[path]).forEach(verb => {
      let resource = resources[path][verb]
      exportPath(verb, path, resource)
    })
  })
}

const importPaths = async (fileName) => {
  let oldSpec = readSpec(fileName)
  let newSpec = await convertSpec(oldSpec)
  console.log(newSpec)
  // exportPaths(newSpec)
}

const run = async () => {
  // importResponses('./v2.0/legacy/openapi-v2.json')
  // importResponses('./v2.0/legacy/upload.openapi-v2.json')
  importPaths('./v2.0/legacy/openapi-v2.json')
  importPaths('./v2.0/legacy/upload.openapi-v2.json')
}

run()