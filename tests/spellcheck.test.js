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
  spellChecker = require('./helpers/spellChecker')
})

/**
 * Test all titles and descriptions for spelling mistakes
 */
test('Expect titles and descriptions to pass spell checks', async () => {
  await expect(specification).toPassSpellChecks(spellChecker)
})