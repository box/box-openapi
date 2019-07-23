const axios = require('axios')

class DownstreamNotifier {
  notify() {
    const [_, org, repo] = process.argv
    const { TRAVIS_TOKEN } = process.env
    
    axios.post(`https://api.travis-ci.com/repo/${org}%2F${repo}/requests`, {
      request: {
        branch: 'master'
      }
    }, {
      headers: {
        Authorization: `token ${TRAVIS_TOKEN}`,
        'Travis-API-Version': 3
      }
    })
  }
}

module.exports = new DownstreamNotifier()