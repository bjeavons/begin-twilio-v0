let arc = require('@architect/functions');
let game = require('./game.js');

exports.handler = async function http(req) {
  console.log(Date());
  try {
    response = await game(arc.http.helpers.bodyParser(req));
    return {
      statusCode: 200,
      headers: response.headers,
      body: 'body' in response ? response.body.toString() : ''
    }
  }
  catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: 'Internal server error'
    }
  }
}
