let twilio = require('twilio');
let arc = require('@architect/functions');
let game = require('./game.js');

exports.handler = async function http(req) {
  console.log(req);
  let body = arc.http.helpers.bodyParser(req);
  const requestIsValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    req.headers['x-twilio-signature'],
    process.env.URL,
    body
  );
  console.log(body, req);
  if ((process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging') && !requestIsValid) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    }
  }

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
