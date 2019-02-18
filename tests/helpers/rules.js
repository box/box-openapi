/**
 * Verify that the operationId is as expected.
 * 
 * @param {object} endpoint The endpoint to verify
 * @param {object} options The options passed into this validator
 * @param {object} object.given JSON path for this object
 */
const validateOperationIdFormat = (endpoint, options, { given }) => {
  // remove the first element
  given.shift()
  // create the ID
  const id = given.reverse()
                  .join('')
                  .replace(/\//g, '_')
                  .replace(/{.*}/g, 'id')

  // check that the ID is as expected
  if (id != endpoint.operationId) {
    return [
      { message: `Expected operationId to equal ${id}`}
    ]
  }
}

const ensureReferencesResolved = (item) => {
  if (typeof(item) === 'object' && '$ref' in item) {
    let ref = item['$ref']
    if (!typeof(ref) === 'string' || !ref.startsWith('#/')) {
      return [
        { message: `Expected all file references to be resolved - ${ref}`}
      ]
    } 
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
      },
      ensure_references_resolved: {
        summary: 'Ensures every file reference has been resolved',
        given: '$..*',
        then: {
          function: 'ensureReferencesResolved'
        }
      } 
    } 
  },

  boxFunctions: () => {
    return {
      validateOperationIdFormat: validateOperationIdFormat,
      ensureReferencesResolved: ensureReferencesResolved
    }
  }
}