// Load all specifications
const loader = require('./helpers/specLoader')
const systemLang = process.env.LANG

let specification = null
let spellChecker = null

beforeAll(async () => {
  specification = await loader.loadSpecification()
  process.env.LANG = 'en_US'
  spellChecker = require('./helpers/spellChecker')
  process.env.LANG  = systemLang
})

afterAll(() => {
  expect(process.env.LANG).toBe(systemLang)
})

test('Expect titles and descriptions to pass spell checks', async () => {
  await expect(specification).toPassSpellChecks(spellChecker)
})