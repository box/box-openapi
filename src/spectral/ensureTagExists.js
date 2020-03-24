/**
 * Ensure that an x-tag matches a real tag value
 */
module.exports = (tag, _, __, schema) => {
  if (!tag) { return }

  const tags = schema.documentInventory.resolved.tags.map(tag => tag['x-box-tag'])

  if (!tags.includes(tag)) {
    return [{ message: `Expected x-box-tag ${tag} to be a registered tag`}]
  }
}