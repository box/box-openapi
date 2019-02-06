// Load all specifications
const loader = require('./helpers/specLoader')
const specifications = loader.loadSpecifications()

test('Expect there to be at least one specification', () => {
  expect(specifications).not.toBeNull()
  expect(specifications.length).not.toBe(0)
})

specifications.forEach(({ fileName, content }) => {
  test(`Validating specification: ${fileName}`, () => {
    expect(content).toBeValidSpecification()
  })
})

  

