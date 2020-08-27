/**
  * Ensure that examples exist for paramters/properties of
  * basic values
  */
 
module.exports =(item, _, paths) => {
  if (
      paths.target.join('.').includes('properties.properties') ||
      // skip if this is an example
      paths.target.includes('example') ||
      // objects are not basic values
      item.type === 'object' ||
      // binary values are not basic values
      item.format === 'binary' ||
      // arrays can be skipped unless they are string arrays
      (item.type === 'array' && item.items && item.items.type !== 'string') ||
      // skip if the property as a reference
      item['$ref'] !== undefined ||
      item.allOf !== undefined ||
      // if this is a list 
      item.oneOf !== undefined ||
      // allow an explicit example value of null
      item.example === null ) { return }
  
  // if the item does not have an example
  // throw an error
  if (!item.example && item.example !== false) {
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
    ]
  }
}
