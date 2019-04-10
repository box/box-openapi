// Colorize output
let colors = require('colors/safe')

// Import the validator and spell checker
const spectral = require('./validator')

expect.extend({
  // Extend expect to spell check the specification file
  async toPassSpellChecks(content, spellChecker) {
    const results = await spellChecker.check(content)
    const pass = results.length === 0

    // Map the result to a user-friendly message
    const message = results.map(({ path, plain_value, checks }) => {
      // Colorize the identifier according to severity
      const identifier = colors.green(path)
      let text = plain_value
      let offset = 0
      checks.forEach(({ start, end }) => {
        let length = end-start
        text = `${text.substr(0, offset+start)}${colors.yellow(text.substr(offset+start, length))}${text.substr(offset+end)}`
        // increment offet because coloring adds 10 character points
        offset += 10
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
  async toBeValidSpecification(content) {
    // Use spectral to validate the content
    const results = await spectral.run(content, { resolvedTarget: content })

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
