/**
 * Ensures all arrays have item types
 */
module.exports = (param, _, paths) => {
  // if this is actually a property called properties, ignoree
  if (paths.target.join('.').includes('properties.properties')) { return }

  // if this is a list, check if the first item matches instead
  if (param.items && param.items.oneOf) { return }

  // check if the param is an array
  if (param.type === 'array' &&
    // if the param has items, ensure it has a type or a ref
    !(param.items && (param.items.type || param.items['$ref'] || param.items['x-box-reference-id']))) {
    return [
      {
        message: `All properties and params of type array need an item type or $ref`
      }
    ]
  }
}