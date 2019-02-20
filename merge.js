const glob = require('glob')
const yaml = require('js-yaml')
const fs = require('fs')

const validTypes = ['string', 'number', 'integer', 'object', 'boolean', 'array']

const read = (path, fileName) => {
  let content = fs.readFileSync(`./v2.0/resources/imported_from_${path}/${fileName}`)
  return yaml.load(content)
}

const mergeProperties = (swaggerProperties, readmeProperties) => {
  Object.keys(swaggerProperties).forEach(key => {
    if (readmeProperties[key]) {
      if (!swaggerProperties[key].type) {
        swaggerProperties[key].type = readmeProperties[key].type
      }
      if (!swaggerProperties[key].format && readmeProperties[key].format) {
        swaggerProperties[key].format = readmeProperties[key].format
      }
      if (readmeProperties[key].description) {
        swaggerProperties[key].description = readmeProperties[key].description
      }
    }
  })

  Object.keys(readmeProperties).forEach(key => {
    if (!swaggerProperties[key]) {
      swaggerProperties[key] = readmeProperties[key]
    }
  })

  return swaggerProperties
}

const merge = (fileName) => {
  let readmeData = read('readme', fileName)
  let swaggerData = read('swagger2', fileName)

  if (swaggerData.properties) {
    swaggerData.properties = mergeProperties(swaggerData.properties, readmeData.properties)
  } else if (swaggerData.allOf && swaggerData.allOf[1].properties) {
    swaggerData.allOf[1].properties = mergeProperties(swaggerData.allOf[1].properties, readmeData.properties)
  } else if (swaggerData.items.properties) {
    swaggerData.items.properties = mergeProperties(swaggerData.items.properties, readmeData.properties)
  }

  return swaggerData
}

const sanitizeProperty = ([key, value]) => {
  if (value.type == 'boolean' && !value.example) {
    value.example = true
  }
  if (key.endsWith('_at') && value.format != 'date-time') {
    value.type = 'string'
    value.format = 'date-time'
  }
  if (value.format == 'date-time' && !value.example) {
    value.example = "2012-12-12T10:53:43-08:00"
  }
  if (!value.description && !value['$ref'] && !value.items) {
    value.description = ""
  }
  return [key, value]
}

const sanitizeProperties = (properties) => {
  let map = new Map(Object.entries(properties).map(sanitizeProperty))
  return Array.from(map).reduce((acc, [ key, val ]) => Object.assign(acc, { [key]: val }), {})
}

const sanitize = (data) => {
  if (data.properties) {
    data.properties = sanitizeProperties(data.properties)
  } else if (data.allOf && data.allOf[1].properties) {
    data.allOf[1].properties = sanitizeProperties(data.allOf[1].properties)
  } else if (data.items.properties) {
    data.items.properties = sanitizeProperties(data.items.properties)
  }
  return data
}

const write = (data, fileName) => {
  let content = "---\n"+yaml.safeDump(data, { lineWidth: 60 })
  fs.writeFileSync(`./v2.0/resources/imported_merged_and_sanitized/${fileName}`, content)
}

const run = async () => {
  let swagger2FileNames = glob.sync('./v2.0/resources/imported_from_swagger2/*.yml').map(fileName => fileName.split('/').reverse()[0])
  let readmeFileNames = glob.sync('./v2.0/resources/imported_from_readme/*.yml').map(fileName => fileName.split('/').reverse()[0])
  
  swagger2FileNames.forEach(fileName => {
    if (readmeFileNames.includes(fileName)) {
      console.log('----------------------------------------')
      console.log("Merging and sanitizing "+fileName)
      write(sanitize(merge(fileName)), fileName)
    } else {
      console.log('----------------------------------------')
      console.log("Just sanitizing "+fileName)
      write(sanitize(read('swagger2', fileName)), fileName)
    }
  });
}

run()