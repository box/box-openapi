const fs = require('fs')
const { Resolver } = require("@stoplight/json-ref-resolver")

// Initialize our custom resolver of the specification
const resolver = new Resolver({
  readers: {
    file: {
      // Translate paths to the right path
      read(uri) {
        return JSON.parse(fs.readFileSync(`./v2.0/${uri.path()}`))
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