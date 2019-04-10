// Initialize Spectral
const { Spectral } = require('@stoplight/spectral')
const { oas3Functions, oas3Rules } = require('@stoplight/spectral/rulesets/oas3')
const { boxFunctions, boxRules } = require('./rules')

const spectral = new Spectral()
const myOas3Rules = oas3Rules()
delete myOas3Rules['valid-example']

spectral.addFunctions(oas3Functions())
spectral.addRules(myOas3Rules)
spectral.addFunctions(boxFunctions())
spectral.addRules(boxRules())

module.exports = spectral