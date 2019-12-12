





/**
 * Check that every item x-box-reference-category matches the ID of a tag
 */
const ensureReferenceCategoryValid = (spec) => (item) => {  
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
const ensureExampleMatchesType = ({ type, example, additionalProperties }, _, paths) => {
  if (paths.target.join('.').includes('properties.properties')) { return }

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

const ensureExampleSimpleResponseType = (schema) => {
  if (schema['x-box-resource-id'] === undefined && schema.type !== 'string') {
    return [
      {
        message: `Responses need to be of a plain type or reference a resource`
      },
    ]
  }
}

/**
 * Define the list of rules
 */
module.exports = {
  boxRules: {
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
        function: 'ensureExampleSimpleResponseType'
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
  },

  /**
   * Export the custom functions
   */
  boxFunctions: (spec) => {
    return {
      ensureAllArraysHaveItemTypes: ensureAllArraysHaveItemTypes,
      ensureReferenceCategoryValid: ensureReferenceCategoryValid(spec),
      ensureExampleMatchesType: ensureExampleMatchesType,
      falsy: falsy,
      ensureResourceIdUnique: ensureResourceIdUnique,
      ensureResourcesAreObjects: ensureResourcesAreObjects,
      ensureExampleSimpleResponseType: ensureExampleSimpleResponseType
    }
  }
}
