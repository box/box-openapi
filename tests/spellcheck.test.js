// Load all specifications
const loader = require('./helpers/specLoader')
const specifications = loader.loadSpecifications()

specifications.forEach(({ fileName, content }) => {
  test(`Validating spelling in: ${fileName}`, () => {
    expect(content).toPassSpellChecks()
  })
})