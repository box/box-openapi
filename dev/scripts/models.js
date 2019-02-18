/**
 * A super ugly script for creating yaml files from the Objects
 * from a README export
 */
const glob = require("glob")
const fs = require('fs')
const changeCase = require('change-case')
const yaml = require('js-yaml')

const extractParameters = (content) => {
  let subsection = content.split("[block:parameters]")[1].split("[/block]")[0]
  let data = JSON.parse(subsection).data
  let params = {}
  for (const key of Object.keys(data)) {
    let item = data[key]
    if (!item) { continue }
    let [ row, column ] = key.split('-')

    if (!params[row]) { params[row] = {} }

    if (column == '0') {
      let [name, type] = item.split("\n").filter(value => !!value)
      params[row].name = name.replace(/\*/g, "").replace(/\$/g, "").trim(),
      params[row].type = type.trim()
    } else {
      params[row].description = item.trim()
    }
  }
 
  return Object.values(params)
}

const toOpenApi = (parameters) => {
  let object = {
    properties: {}
  }

  parameters.forEach(({ name, type, description}) => {
    object.properties[name] = {
      type,
      description
    }
  })

  return object
}

const objectType = (object, fileName) => {
  let type = ''
  if (object.properties.type && object.properties.type.description) {
    type = object.properties.type.description
  } 

  if (type.startsWith('`')) {
    return type.split('`')[1]
  } else {
    return changeCase.snake(fileName.split('objects\/')[1].split('Object')[0].trim().split(" ").join(""))
  }
}

const write = (type, object) => {
  fs.writeFileSync(`./dev/scripts/objects/${type}.yml`, yaml.dump(object))
}

const processFile = (fileName) => {
  let content = fs.readFileSync(fileName).toString()

  let parameters = extractParameters(content)
  let object = toOpenApi(parameters)
  let type = objectType(object, fileName)

  write(type, object)
}

const run = async () => {
  let fileNames = glob.sync("./dev/scripts/objects/*.md")
  fileNames.forEach(processFile)
}

run()