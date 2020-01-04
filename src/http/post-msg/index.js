let arc = require('@architect/functions');
let data = require('@begin/data');
let twilio = require('twilio');

exports.handler = async function http(req) {
  //let msg = arc.http.helpers.bodyParser(req);
  let twiml = new twilio.TwimlResponse();
  console.log('got', req);
  twiml.message('hello robo');
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/xml',
    },
    body: twiml.toString()
  }
}
