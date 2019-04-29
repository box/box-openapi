const checker = require('spellchecker')
const fs = require('fs')
const yaml = require('js-yaml')
const strip = require('remark-plain-text')
const remark = require('remark')

// Extend the dictionary with our own accepted words
const acceptedWords = fs.readFileSync('./v2.0/dictionary/accepted_words.yml')
let words = yaml.load(acceptedWords)
words.forEach(checker.add)

/** 
 * Extracts all titles and descriptions from a specification
 */
const extract = (item, corpus=[], parents=[]) => {
  if (!item) { return corpus }
  Object.keys(item).forEach(key => {
    // Loop every item
    let value = item[key]
    
    // Extract every description and title with String values and add them to the list
    if (['description', 'title'].includes(key) && typeof(value) === 'string') {
      value = value.replace(/\s+/g, ' ')
      let path = [...parents, key].join('.')
      corpus.push({ path, value })
    // Otherwise, check if the item is an object and recursively continue searching
    } else if (typeof(value) === 'object') {
      extract(value, corpus, [...parents, key])
    }
  })
  return corpus
}

/**
 * Checks the spelling for an item
 * @param {Object} item the item to check
 */
const check = async (item) => {
  return new Promise((resolve, reject) => {
    remark().use(strip).process(item.value, (error, result) => {
      if (error) { reject(error) }
      item.plain_value = String(result).replace(/\n/g, " ").trim()
      item.checks = checker.checkSpelling(item.plain_value)
      resolve(item)
    })
  })
}

/**
 * Spell checks a file's titles and descriptions
 */
class SpellChecker {
  async check(specification) {
    let parts = extract(specification)
    let checks = await Promise.all(parts.map(check))
    return checks.filter(item => item.checks.length > 0)
  }
}

module.exports = new SpellChecker()