module.exports = (item, _, paths) => {
  // console.dir(title)
  if (item.summary.includes(' a ') || item.summary.includes(' an ') || item.summary.includes(' the ')) {
    return [
      {
        message: `${paths.target.join('.')} - summary should not include "a", "an" or "the"`,
      }
    ]
  }
}
