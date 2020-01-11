let data = require('@begin/data');

exports.handler = async function http(req) {
  let msgs = await data.get({
    table: 'msg'
  });

  return {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(msgs)
  }
}
