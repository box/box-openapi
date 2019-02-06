const fs = require('fs')
const { Resolver } = require("@stoplight/json-ref-resolver")
const yaml = require('js-yaml')

// Initialize our custom resolver of the specification
const resolver = new Resolver({
  readers: {
    file: {
      // Translate paths to the right path
      read(uri) {
        const path = uri.path()
        const content = fs.readFileSync(`./v2.0/${path}`)
        if (path.endsWith('.json')) { return JSON.parse(content) }
        else if (path.endsWith('.yml')) { return yaml.load(content) }
      }
    }
  }
})

/**
 * A loader for reading the API specification from file and merging it into one file
 */
class SpecLoader {
  async loadSpecification() {
    const root = JSON.parse(fs.readFileSync('./v2.0/openapi.json'))
    return await resolver.resolve(root).then(resolved => resolved.result)
  }

  async writeSpecification() {
    const specification = await this.loadSpecification()
    if (!fs.existsSync('build')){
      fs.mkdirSync('build');
    }
    fs.writeFileSync('./build/openapi.json', JSON.stringify(specification, null, 2))
  }
}

module.exports = new SpecLoader()