module.exports = (item, _, paths) => {
  // console.dir(title)
  if (item.summary.includes(' a ') || item.summary.includes(' an ') || item.summary.includes(' the ')) {
    return [
      {
        message: `${paths.target.join('.')} - summary should not include "a", "an" or "the"`,
      }
    ]
  }
}
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