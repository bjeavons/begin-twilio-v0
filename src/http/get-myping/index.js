// HTTP function
exports.handler = async function http(req) {
  console.log(req)
  return {
    headers: {
      'content-type': 'text/html; charset=utf8'
    },
    body: 'pong'
  }
}
