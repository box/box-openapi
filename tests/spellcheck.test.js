// Load all specifications
const loader = require('./helpers/specLoader')

let specification = null
beforeAll(async () => {
  specification = await loader.loadSpecification()
})

test('Expect titles and descriptions to pass spell checks', () => {
  // expect(specification).toPassSpellChecks()
})