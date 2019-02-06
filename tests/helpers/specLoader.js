const fs = require('fs')
const glob = require('glob')

/**
 * Reads in all specification filenames
 */
const loadFileNames = () => {
  return glob.sync('./v2.0/*.openapi.json')
}

/**
 * Reads in a file by name
 * 
 * @param {String} fileName 
 */
const read = (fileName) => {
  return JSON.parse(fs.readFileSync(fileName))
}

/**
 * A loader for reading specifications from file
 */
class SpecLoader {
  loadSpecifications() {
    let fileNames = loadFileNames()
    return fileNames.map(fileName => {
      return { fileName, content: read(fileName) }
    })
  }
}

module.exports = new SpecLoader()