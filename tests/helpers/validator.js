// Initialize Spectral
const { Spectral } = require('@stoplight/spectral')
const { oas3Functions, rules } = require('@stoplight/spectral/dist/rulesets/oas3')
const { boxFunctions, boxRules } = require('./rules')

module.exports = class Validator {
  async spectral(spec) {
    const spectral = new Spectral()

    let oas3Rules = await rules()

    // Remove the valid-example rule from Spectral's
    // rules, as we have our own
    delete oas3Rules['valid-example']
    await spectral.addFunctions(oas3Functions())
    await spectral.addRules(oas3Rules)
  
    // Add default OAS3 rules and our own
    await spectral.addFunctions(boxFunctions(spec))
    await spectral.addRules(boxRules)
    return spectral
  }
}