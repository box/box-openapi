/**
* Ensure that descriptions exist for simple values
*/

module.exports = (item, _, paths) => {
 if (
     paths.target.join('.').includes('properties.properties') ||
     // skip if this is an example
     paths.target.includes('example') ||
     // skip if this is an object or array
     item.type === 'object' ||
     item.type === 'array' ||
     // skip if this has a reference
     item['$ref'] !== undefined ||
     item.allOf !== undefined ) { return }

  // if the item does not have an decription
  // throw an error

  if (!item.description) {
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
    ]
  }
}