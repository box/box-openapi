const validateOperationIdFormat = (endpoint, options, { given }) => {
  given.shift()
  const id = given.reverse().join('').replace(/\//g, '_')

  if (id != endpoint.operationId) {
    return [
      { message: `Expected operationId to equal ${id}`}
    ]
  }
}

module.exports = {
  boxRules: () => {
    return {
      ensure_operations_summary: {
        summary: 'Ensures every resource has a summary',
        given: '$.paths[*][*]',
        then: {
          field: 'summary',
          function: 'truthy'
        }
      },
      ensure_parameters_description: {
        summary: 'Ensures every parameter has a description',
        given: '$.paths[*][*].parameters[*]',
        then: {
          field: 'description',
          function: 'truthy'
        }
      },
      ensure_operation_id_format: {
        summary: 'Ensure the operation ID matches the path and verb',
        given: '$.paths[*][*]',
        then: {
          function: 'validateOperationIdFormat'
        }
      },
      ensure_parameters_example: {
        summary: 'Ensures every parameter has an example',
        given: '$.paths[*][*].parameters[*]',
        then: {
          field: 'example',
          function: 'truthy'
        }
      }, 
      ensure_properties_example: {
        summary: 'Ensures every property has an example',
        given: '$.components.schemas[*].properties[*]',
        then: {
          field: 'example',
          function: 'truthy'
        }
      } 
    } 
  },

  boxFunctions: () => {
    return {
      validateOperationIdFormat: validateOperationIdFormat,
    }
  }
}