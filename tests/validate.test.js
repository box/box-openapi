// Load all specifications
const loader = require('./helpers/specLoader')

let specification = null
beforeAll(async () => {
  specification = await loader.loadSpecification()
})

test('Expect the API specification to be loaded', async () => {
  expect(specification).not.toBeNull()
})

test('Expect the API specification to be valid', () => {
  expect(specification).toBeValidSpecification()
})