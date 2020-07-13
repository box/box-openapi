/**
 * Ensure allOfs start with a $ref and then a description,
 * in that order
 */
module.exports = (item) => {
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
  if (keys.includes("$ref") && keys[1] && keys[1] !== "description" && keys[1] !== "properties" && keys[1] !== "x-box-reference-hide") {
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
