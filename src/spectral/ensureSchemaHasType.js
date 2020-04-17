module.exports = (schema, _, paths) => {
  if (schema.oneOf) { return }
  if (!schema.type && !schema['$ref']) {
    return [{
      message: `${paths.target ? paths.target.join('.') : 'type or $ref'} is not truthy`,
    }]
  }
}