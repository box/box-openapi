// Colorize output
let colors = require('colors/safe')

// Import the validator and spell checker
const spectral = require('./validator')
const spellChecker = require('./spellchecker')

expect.extend({
  // Extend expect to spell check the specification file
  toPassSpellChecks(content) {
    const results = spellChecker.check(content)
    const pass = results.length === 0

    // Map the result to a user-friendly message
    const message = results.map(({ path, value, checks }) => {
      // Colorize the identifier according to severity
      const identifier = colors.green(path)
      let text = value
      checks.forEach(({start, end }) => {
        text = `${text.substr(0, start)}${colors.yellow(text.substr(start, end-start))}${text.substr(end)}`
      })
      return `${identifier}: ${text}`
    }).join('\n')
    

    if (pass) {
      return {
        message: () => `API Specification spellcheck did not fail as expected`,
        pass: pass
      }
    } else {
      return {
        message: () => `API Specification spellcheck failed\n\n${message}`,
        pass: pass
      }
    }
  },

  // Extend expect to use Spectral to validate the spec files
  toBeValidSpecification(content) {
    // Use spectral to validate the content
    const { results } = spectral.run(content, { resolvedTarget: content })

    // Map the result to a user-friendly message
    const message = results.map(({ severity, message, summary, path }) => {
      // Colorize the identifier according to severity
      const colorizer = severity == 50 ? colors.yellow : colors.green
      let identifier = path.join(".")
      if (path.join(".").length === 0) { identifier = 'root' }
      identifier = colorizer(identifier)
      
      const explanation = colors.grey(`(${summary})`)

      return `${identifier} ${message} ${explanation}`
    }).join('\n')
    
    const pass = results.length === 0

    if (pass) {
      return {
        message: () => {
          return `API Specification validation did not fail`
        },
        pass: pass
      }
    } else {
      return {
        message: () => {
          return `API Specification validation failed\n\n${message}`
        },
        pass: pass
      }
    }
  }
})
