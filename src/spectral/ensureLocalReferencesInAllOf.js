/**
 * Ensures all local references are in an allOf
 */
module.exports = (item, _, paths) => {
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