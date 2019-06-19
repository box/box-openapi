/**
 * A list of custom rules for our specification
 */

/**
 * Ensure that the operationId matches the expected value
 * for the path in question
 */
const validateOperationIdFormat = (endpoint, _, { given }) => {
  // remove the first element from the path
  given.shift()
  // create the expected ID
  const id = given.reverse()
                  .join('')
                  .replace(/\//g, '_')
                  .replace(/{[A-Za-z_]*}/g, 'id')
                  .replace(/\.id/g, '_id')

  // check the expected ID against the operationId
  if (id != endpoint.operationId) {
    return [{ message: `Expected operationId to equal ${id}`}]
  }
}

/**
 * Ensure that all references have been resolved for
 * an item
 */
const ensureReferencesResolved = (item) => {
  // check if this item is an object and has a $ref
  // and then get the reference
  if (item && typeof(item) === 'object' && '$ref' in item) {
    let ref = item['$ref']
    // if the reference is a string, and doesn't point to
    // a resource defined in this spec (#/) then it hasn't
    // been resolved
    if (!typeof(ref) === 'string' || !ref.startsWith('#/')) {
      return [
        { message: `Expected all file references to be resolved - ${ref}`}
      ]
    }
  }
}

/**
 * Ensure all local references to exist
 */
const ensureLocalReferencesExist = (item, _, __, context) => {
  // check if this item is an object and has a $ref
  // and then get the reference
  if (item && typeof(item) === 'object' && '$ref' in item) {
    let ref = item['$ref']

    // extract the resolved spec
    let spec = context.resolved

    // check that the reference is a local reference
    if (typeof(ref) === 'string' && ref.startsWith('#/')) {
      // check that the path for the reference exists
      let parts = ref.split('/')
      let match = spec[parts[1]][parts[2]][parts[3]]
      // throw an error if it does not exist
      if (!match) {
        return [
          { message: `Expected reference to exist - ${ref}`}
        ]
      }
    }
  }
}

/**
 * Ensure that examples exist for paramters/properties of
 * basic values
 */
const ensurePropertiesExample = (item, _, paths) => {
  if (
      // skip if this is an example
      paths.target.includes('example') ||
      // objects are not basic values
      item.type === 'object' ||
      // binary values are not basic values
      item.format === 'binary' ||
      // arrays can be skipped unless they are string arrays
      (item.type === 'array' && item.items.type !== 'string') ||
      // skip if the property as a reference
      item['$ref'] !== undefined ||
      item.allOf !== undefined ||
      // allow an explicit example value of null
      item.example === null ) { return }

  // if the item does not have an example
  // throw an error
  if (!item.example) {
    return [
      {
        message: `${paths.target ? paths.target.join('.') : 'property'} is not truthy`,
      }
    ]
  }
}

/**
 * Ensure that descriptions exist for simple values
 */
const ensureSimpleDescription = (item, _, paths) => {
  if (
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


/**
 * Ensure allOfs start with a $ref and then a description,
 * in that order
 */
const ensureAllofOrder = (item) => {
  // get the keys for an item
  let keys = item.map(row => Object.keys(row)[0])

  // if the item contains a reference, ensure it's
  // the first item
  if (keys.includes("$ref") && keys[0] !== "$ref") {
    return [
      {
        message: `$ref needs to be first item in allOf set`
      }
    ]
  }

  // if the item contains a reference, ensure the description is
  // the second item, unless the second option is a direct
  // list of properties
  if (keys.includes("$ref") && keys[1] !== "description" && keys[1] !== "properties") {
    return [
      {
        message: `description or properties needs to be second item in allOf set`
      }
    ]
  }

  // Check of there are any keys we did not expect
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
 * Ensure all array items in a property are of a basic type
 * or reference object
 */
const ensureItemsOfBasicTypeOrReference = (items) => {
  // get the keys of the items list
  let keys = Object.keys(items)

  // if we have more than one key, throw an error
  if (keys.length > 1 && items.type !== 'string') {
    return [
      {
        message: `Items can only contain one entry, "type" or "$ref". Found ${keys}`
      }
    ]
  }
  // if we have one key, ensure it's a type or a reference
  else if (!keys.includes("type") && !keys.includes("$ref") && !keys.includes("oneOf")) {
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
  // check if the item is a local reference
  if (item && item['$ref'] && item['$ref'].startsWith('#/')) {
    // ensure the parent path is provided
    if (paths && paths.target) {
      // get the parent and grandparent item names of this item
      let parent = paths.target[paths.target.length-1]
      let grandparent = paths.target[paths.target.length-2]

      // allow references in items and allOfs only
      if (!(parent === 'items' || grandparent === 'allOf')) {
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
  // check if the param is an array
  if (param.type === 'array' &&
    // if the param has items, ensure it has a type or a ref
    !(param.items && (param.items.type || param.items['$ref']))) {
    return [
      {
        message: `All properties and params of type array need an item type or $ref`
      }
    ]
  }
}

/**
 * Check that every item x-box-reference-category matches the ID of a tag
 */
const ensureReferenceCategoryValid = (item, _, __, context) => {
  // get the entire spec
  let spec = context.resolved

  // get the reference category
  let id = item['x-box-reference-category']
  // ensure the reference category matches a category in the tags of the specification
  let match = !spec.tags.map((tag) => tag['x-box-reference-category']).includes(id)

  // ensure an ID was found and that it matches a caegory§
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
  if (!!value) { return [
    {
      message: `${path.target ? path.target.join('.') : 'property'} is not falsy`
    },
  ]}
}

/**
 * Ensure that all resourceId's are unique within a list
 */
const ensureResourceIdUnique = (items) => {
  // get all the resourceIds
  let ids = Object.entries(items).map(([_, value]) => value['x-box-resource-id'])
  // determine a unique set
  let uniques = [...new Set(ids)]

  // if the unique set does not have the same length
  // as the whole set, throw an error
  if (ids.length !== uniques.length) {
    // determine the items that are double
    let matches = ids.filter((x, index) => ids.indexOf(x) !== index);

    return [
      {
        message: `Duplicate x-box-resource-id: ${matches}`
      },
    ]
  }
}

const ensureResourcesAreObjects = (item) => {
  if (!(item.type === undefined || item.type === 'object')) {
    return [
      {
        message: `Core resources must be objects. Found ${item.type} instead. Use attributes instead.`
      },
    ]
  }
}

/**
 * Define the list of rules
 */
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
      ensure_every_resource_has_a_title: {
        summary: 'Ensures every endpoint has a title',
        given: '$.components.schemas[*]',
        then: {
          field: 'title',
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
      },
      ensure_response_descriptions: {
        summary: 'Ensures responses have descriptions',
        given: '$.paths[*][*].responses[*]',
        then: {
          field: 'description',
          function: 'truthy'
        }
      }
    }
  },

  /**
   * Export the custom functions
   */
  boxFunctions: () => {
    return {
      validateOperationIdFormat: validateOperationIdFormat,
      ensureReferencesResolved: ensureReferencesResolved,
      ensureLocalReferencesExist: ensureLocalReferencesExist,
      ensurePropertiesExample: ensurePropertiesExample,
      ensureAllofOrder: ensureAllofOrder,
      ensureItemsOfBasicTypeOrReference: ensureItemsOfBasicTypeOrReference,
      ensureSimpleDescription: ensureSimpleDescription,
      ensureLocalReferencesInAllOf: ensureLocalReferencesInAllOf,
      ensureAllArraysHaveItemTypes: ensureAllArraysHaveItemTypes,
      ensureReferenceCategoryValid: ensureReferenceCategoryValid,
      ensureExampleMatchesType: ensureExampleMatchesType,
      falsy: falsy,
      ensureResourceIdUnique: ensureResourceIdUnique,
      ensureResourcesAreObjects: ensureResourcesAreObjects
    }
  }
}
