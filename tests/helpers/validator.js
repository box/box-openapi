// Initialize Spectral
const { Spectral } = require('@stoplight/spectral')
const { oas3Functions, rules } = require('@stoplight/spectral/rulesets/oas3')
const { boxFunctions, boxRules } = require('./rules')

const spectral = new Spectral()

// Remove the valid-example rule from Spectral's
// rules, as we have our own
const myOas3Rules = rules()
delete myOas3Rules['valid-example']

// Add default OAS3 rules and our own
spectral.addFunctions(oas3Functions())
spectral.addRules(myOas3Rules)
spectral.addFunctions(boxFunctions())
spectral.addRules(boxRules())

module.exports = spectral