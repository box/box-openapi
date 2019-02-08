const checker = require('spellchecker')
const fs = require('fs')
const yaml = require('js-yaml')

// Extend the dictionary with our own accepted words
const acceptedWords = fs.readFileSync('./v2.0/dictionary/accepted_words.yml')
checker.add(yaml.load(acceptedWords))

/** 
 * Extracts all titles and descriptions from a specification
 */
const extract = (item, corpus=[], parents=[]) => {
  Object.keys(item).forEach(key => {
    // Loop every item
    const value = item[key]
    
    // Extract every description and title with String values and add them to the list
    if (['description', 'title'].includes(key) && typeof(value) === 'string') {
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
const check = (item) => {
  item.checks = checker.checkSpelling(item.value)
  return item 
}

/**
 * Spell checks a file's titles and descriptions
 */
class SpellChecker {
  check(specification) {
    return extract(specification)
           .map(item => check(item))
           .filter(item => item.checks.length > 0)
  }
}

module.exports = new SpellChecker()