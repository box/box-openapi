// Load all specifications
const loader = require('./helpers/specLoader')


/**
 * Load and resolve the API specification
 */
let specification = null
beforeAll(async () => {
  specification = await loader.loadSpecification()
})

/**
 * Make sure the API specification has been loaded
 */
test('Expect the API specification to be loaded', async () => {
  expect(specification).not.toBeNull()
})

/**
 * Make sure the specification passes all tests
 */
test('Expect the API specification to be valid', async () => {
  await expect(specification).toBeValidSpecification()
})