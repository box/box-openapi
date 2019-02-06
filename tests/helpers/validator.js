// Initialize Spectral
const { Spectral } = require('@stoplight/spectral')
const { oas3Functions, oas3Rules } = require('@stoplight/spectral/rulesets/oas3')

const spectral = new Spectral()
spectral.addFunctions(oas3Functions())
spectral.addRules(oas3Rules())

module.exports = spectral