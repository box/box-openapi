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
                  .replace(/{[A-Za-z_]*}/g, 'id')
                  .replace(/\.id/g, '_id')

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
const ensurePropertiesExample = (item, _opts, paths) => {  
  if (
      paths.target.includes('example') ||
      item.type === 'object' || 
      (item.type === 'array' && item.items.type !== 'string') || 
      item['$ref'] !== undefined ||
      item.example === null ||
      item.allOf !== undefined ) { return }
  
  if (!item.example) {
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
    ]
  }
}

/**
 * Ensure descriptions exist for simple values
 * 
 * @param {object} item the item to ensure descriptions for
 */
const ensureSimpleDescription = (item, _opts, paths) => {
  if (
      paths.target.includes('example') ||
      item.type === 'object' || 
      item.type === 'array' || 
      item['$ref'] !== undefined ||
      item.allOf !== undefined ) { return }
  
  if (!item.description) {
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
    ]
  }
}


/**
 * Ensure allOfs start with a $ref 
 */
const ensureAllofOrder = (item, _, paths) => {
  let keys = item.map(row => Object.keys(row)[0])
  
  if (keys.includes("$ref") && keys[0] !== "$ref") {
    return [
      {
        message: `$ref needs to be first item in allOf set`
      }
    ]
  }

  if (keys.includes("$ref") && keys[1] !== "description" && keys[1] !== "properties") {
    return [
      {
        message: `description or properties needs to be second item in allOf set`
      }
    ]
  }

  let excessKeys = keys && ["$ref", "description"]
  
  if (keys["$ref"] && excessKeys.length > 0) {
    return [
      {
        message: `Unexpected items under allOf: ${excessKeys}`
      }
    ]
  }
}

/**
 * Ensure all items in a property are of a basic type
 * or reference object
 */
const ensureItemsOfBasicTypeOrReference = (items) => {
  let keys = Object.keys(items)
  if (keys.length > 1) {
    return [
      {
        message: `Items can only contain one entry, "type" or "$ref". Found ${keys}`
      }
    ]
  }
  else if (!keys.includes("type") && !keys.includes("$ref")) {
    return [
      {
        message: `Items should contain "type" or "$ref" key. Found ${keys}`
      }
    ]
  }
}

/**
 * Ensures all local references are in an allOf
 */
const ensureLocalReferencesInAllOf = (item, _, paths) => {
  if (item && item['$ref'] && item['$ref'].startsWith('#/')) {
    if (paths && paths.target) {
      let parent = paths.target[paths.target.length-1]
      let grandparent = paths.target[paths.target.length-2]

      if (parent !== 'items' && grandparent !== 'allOf') {
        return [
          {
            message: `Local references should be contained within an allOf`
          }
        ]
      }
    }
  }
}

/**
 * Ensures all arrays have item types
 */
const ensureAllArraysHaveItemTypes = (param) => {
  if (param.type === 'array' && !(param.items && (param.items.type || param.items['$ref']))) {
    return [
      {
        message: `All properties and params of type array need an item type or $ref`
      }
    ]
  }
}

/**	
 * Check that every item x-box-reference-category matches the ID of a tag	
 * 	
 * @param {object} item The item to check x-box-reference-category for	
 * @param {object} context The context, including the full specification	
 */	
const ensureReferenceCategoryValid = (item, _, __, context) => {	
  let spec = context.resolved	

  let id = item['x-box-reference-category']
  let match = !spec.tags.map((tag) => tag['x-box-reference-category']).includes(id)

  if (id && match) { 	
    return [{ message: `Expected x-box-reference-category to match a similar ID in the root tags object (${item['x-box-reference-category']})`}] 	
  }	
}	

/**
 * Ensure that the example matches the listed type
 */
const ensureExampleMatchesType = ({ type, example, additionalProperties }) => {
  // only run if an example is present
  if (type && example) {
    // determine the example type and constructor
    let exampleTypes = [typeof example]
    let exampleConstructor =  example.constructor.name.toLowerCase()

    // if the example type is number, make it match for integer as well
    if (exampleTypes[0] === 'number') { exampleTypes.push('integer') }

    // if there are additionalProperties, then this is a key:value pair 
    // and the example should be an object
    if (additionalProperties) { type = 'object' }

    // throw an error if none of the types or constructors match
    if (!exampleTypes.includes(type) && type !== exampleConstructor) {
      return [{ message: `Expected example to match type ${type}, instead found ${exampleTypes[0]}`}]
    }
  }
}

/**
 * Ensure a property is falsy
 */
const falsy = (value, _, path) => {
  if (!!value) {
    return [
      {
        message: `${path.target ? path.target.join('.') : 'property'} is not falsy`
      },
    ];
  }
}

/**
 * Ensure that all resource IDs are unique
 */
const ensureResourceIdUnique = (items) => {
  let ids = Object.entries(items).map(([_, value]) => value['x-box-resource-id'])
  let uniques = [...new Set(ids)]


  if (ids.length !== uniques.length) {
    let matches = ids.filter((x, index) => ids.indexOf(x) !== index);

    return [
      {
        message: `Duplicate x-box-resource-id: ${matches}`
      },
    ];
  }
}

module.exports = {
  boxRules: () => {
    return {
      ensure_operations_summary: {
        summary: 'Ensures every endpoint has a summary',
        given: '$.paths[*][*]',
        then: {
          field: 'summary',
          function: 'truthy'
        }
      },
      ensure_resource_description: {
        summary: 'Ensures every resource has a description',
        given: '$.components.schemas[*]',
        then: {
          field: 'description',
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
      ensure_properties_description: {
        summary: 'Ensures every basic property has an description',
        given: '$..*.properties[*]',
        then: {
          function: 'ensureSimpleDescription'
        }
      },
      ensure_properties_example: {
        summary: 'Ensures every property has an example',
        given: '$..*.properties[*]',
        then: {
          function: 'ensurePropertiesExample'
        }
      },
      ensure_additional_properties_example: {
        summary: 'Ensures every property has an example',
        given: '$..*.additionalProperties',
        then: {
          function: 'ensurePropertiesExample'
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
      },
      ensure_allof_order: {
        summary: 'Ensures references are first in an allOf situation',
        given: '$..*.allOf',
        then: {
          function: 'ensureAllofOrder'
        }
      },
      ensure_local_refernces_within_allof: {
        summary: 'Ensures local references are always in an allOf',
        given: '$.paths..*.properties..*',
        then: {
          function: 'ensureLocalReferencesInAllOf'
        }
      },
      ensure_items_are_basic_or_reference: {
        summary: 'Ensures items are either basic types or references',
        given: '$..*.items',
        then: {
          function: 'ensureItemsOfBasicTypeOrReference'
        }
      },
      ensure_arrays_have_item_type: {
        summary: 'Ensures all arrays have an item type',
        given: '$..*.properties[*]',
        then: {
          function: 'ensureAllArraysHaveItemTypes'
        }
      },
      ensure_arrays_have_item_type: {
        summary: 'Ensures all arrays have an item type',
        given: '$..*.parameters[*]',
        then: {
          function: 'ensureAllArraysHaveItemTypes'
        }
      },
      ensure_every_endpoint_has_a_reference_group: {
        summary: 'Ensures every endpoint belongs to a reference category',
        given: '$.paths[*][*]',
        then: {
          field: 'x-box-reference-category',
          function: 'truthy'
        }
      },
      ensure_every_resource_has_a_resource_id: {
        summary: 'Ensures every endpoint belongs to a reference category',
        given: '$.components.schemas[*]',
        then: {
          field: 'x-box-resource-id',
          function: 'truthy'
        }
      }, 
      ensure_every_tag_has_a_group_id: {
        summary: 'Ensures every endpoint belongs to a reference category',
        given: '$.tags[*]',
        then: {
          field: 'x-box-reference-category',
          function: 'truthy'
        }
      },
      ensure_path_reference_categories_exists: {
        summary: 'Ensures a endpoint reference category ID is defined in the tags',
        given: '$.paths[*][*]',
        then: {
          function: 'ensureReferenceCategoryValid'
        }
      },
      ensure_resource_reference_categories_exists: {
        summary: 'Ensures a resource reference category ID can be found in the tags',
        given: '$.components.schemas[*]',
        then: {
          function: 'ensureReferenceCategoryValid',
        }
      },
      ensure_property_examples_match_type: {
        summary: 'Ensures a property\'s example matches its type',
        given: '$..*.properties[*]',
        then: {
          function: 'ensureExampleMatchesType'
        }
      },
      ensure_additional_property_examples_match_type: {
        summary: 'Ensures a property\'s example matches its type',
        given: '$..*.additionalProperties[*]',
        then: {
          function: 'ensureExampleMatchesType'
        }
      },
      ensure_only_simple_responses: {
        summary: 'Ensures response is either blank or references to an object',
        given: '$.paths[*][*].responses[*].content[*].schema',
        then: {
          field: 'properties',
          function: 'falsy'
        }
      },
      ensure_resource_id_unique: {
        summary: 'Ensures a property\'s example matches its type',
        given: '$.components.schemas',
        then: {
          function: 'ensureResourceIdUnique'
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
      ensurePropertiesExample: ensurePropertiesExample,
      ensureAllofOrder: ensureAllofOrder,
      ensureItemsOfBasicTypeOrReference: ensureItemsOfBasicTypeOrReference,
      ensureSimpleDescription: ensureSimpleDescription,
      ensureLocalReferencesInAllOf: ensureLocalReferencesInAllOf,
      ensureAllArraysHaveItemTypes: ensureAllArraysHaveItemTypes,
      ensureReferenceCategoryValid: ensureReferenceCategoryValid,
      ensureExampleMatchesType: ensureExampleMatchesType,
      falsy: falsy,
      ensureResourceIdUnique: ensureResourceIdUnique
    }
  }
}