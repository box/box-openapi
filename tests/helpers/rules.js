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
        summary: 'Ensure th[e operation ID matches the path and verb',
        given: '$.paths[*][*]',
        then: {
          function: 'validateOperationIdFormat'
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