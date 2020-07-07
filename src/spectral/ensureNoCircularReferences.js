const parser = require('@apidevtools/json-schema-ref-parser')

module.exports = async (spec) => {
  try {
    const reference = JSON.parse(JSON.stringify(spec))
    const dereferenced = await parser.dereference(reference)
    JSON.stringify(dereferenced)
  } catch (error) {
    return [
      {
        message: `Circular reference detected. Please use generic resources.`,
      }
    ]
  }

}