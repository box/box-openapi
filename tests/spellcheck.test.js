const loader = require('./helpers/specLoader')
const systemLang = process.env.LANG

/**
 * Load the specification, ensure it's 
 * resolved, and configure the spell checker
 */
let specification = null
let spellChecker = null
beforeAll(async () => {
  specification = await loader.loadSpecification()

  // make sure we use en-US spelling
  process.env.LANG = 'en_US'
  spellChecker = require('./helpers/spellChecker')
  // make sure to reset the system language
  process.env.LANG  = systemLang
})

/**
 * Make sure the system language is reset at the end of 
 * the tests
 */
afterAll(() => {
  expect(process.env.LANG).toBe(systemLang)
})

/**
 * Test all titles and descriptions for spelling mistakes
 */
test('Expect titles and descriptions to pass spell checks', async () => {
  await expect(specification).toPassSpellChecks(spellChecker)
})