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
    return [{ message: `Expected operationId to equal ${id}`}]
  }
}

/**
 * Check if all path references are resolved
 * 
 * @param {Object} item the item that might have unresolved
 * references
 */
const ensureReferencesResolved = (item) => {
  // check if this item is an object and has a $ref
  if (item && typeof(item) === 'object' && '$ref' in item) {
    // fetch the reference
    let ref = item['$ref']
    // if the reference is a string, and doesn't start with 
    // a local pointer, it hasn't been resolved
    if (!typeof(ref) === 'string' || !ref.startsWith('#/')) {
      return [
        { message: `Expected all file references to be resolved - ${ref}`}
      ]
    } 
  }
}

/**
 * Expect all local references to exist
 * 
 * @param {object} item The item to check references for
 * @param {object} context The context, including the full specification
 */
const ensureLocalReferencesExist = (item, _, __, context) => {
  // check if this item has a reference
  if (item && typeof(item) === 'object' && '$ref' in item) {
    let ref = item['$ref']
    let spec = context.resolved

    // check that the reference is a local reference
    if (typeof(ref) === 'string' && ref.startsWith('#/')) {
      // check that the reference exists
      let parts = ref.split('/')
      if (!spec[parts[1]][parts[2]][parts[3]]) {
        return [
          { message: `Expected reference to exist - ${ref}`}
        ]
      }
    }
  }
}

/**
 * Ensures references are in the right syntax
 * 
 * @param {object} item the item to ensure references for
 */
const ensureReferencesFormat = (item) => {
  if (item && typeof(item) === 'object' && '$ref' in item) {
    let ref = item['$ref']

    if (!ref.startsWith('./') && !ref.startsWith('#/')) {
      return [
        { message: `Expected reference to be a file ("./filename") or local ("#/components/etc") - ${ref}`}
      ]
    }
  }
}

/**
 * Ensure examples exist for simple values
 * 
 * @param {object} item the item to ensure examples for
 */
const ensureSimpleExample = (item, _opts, paths) => {
  if (item.type === 'object' || 
      item.type === 'array' || 
      item.allOf !== undefined ) { return }
  
  if (!item.example) {
    console.log(item)
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
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
        given: '$..*.parameters[*]',
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
        given: '$..*.parameters[*]',
        then: {
          field: 'example',
          function: 'truthy'
        }
      }, 
      ensure_properties_example: {
        summary: 'Ensures every property has an example',
        given: '$..*.properties[*]',
        then: {
          function: 'ensureSimpleExample'
        }
      },
      ensure_references_resolved: {
        summary: 'Ensures every file reference has been resolved',
        given: '$..*',
        then: {
          function: 'ensureReferencesResolved'
        }
      },
      ensure_references_exist: {
        summary: 'Ensures every local reference exists',
        given: '$..*',
        then: {
          function: 'ensureLocalReferencesExist'
        }
      },
      ensure_references_format: {
        summary: 'Ensures every reference is local or a file reference',
        given: '$..*',
        then: {
          function: 'ensureReferencesFormat'
        }
      } 
    } 
  },

  boxFunctions: () => {
    return {
      validateOperationIdFormat: validateOperationIdFormat,
      ensureReferencesResolved: ensureReferencesResolved,
      ensureLocalReferencesExist: ensureLocalReferencesExist,
      ensureReferencesFormat: ensureReferencesFormat,
      ensureSimpleExample: ensureSimpleExample
    }
  }
}