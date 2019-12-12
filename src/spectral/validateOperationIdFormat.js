/**
 * Ensure that the operationId matches the expected value
 * for the path in question
 */
module.exports = (endpoint, _, { given }) => {
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