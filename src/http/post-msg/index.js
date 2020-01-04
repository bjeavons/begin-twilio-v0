let arc = require('@architect/functions');
let data = require('@begin/data');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.handler = async function http(req) {
  let msg = arc.http.helpers.bodyParser(req.body);
  const twiml = new MessagingResponse();
  console.log('got msg:', msg);
  twiml.message('hello robo');
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/xml',
    },
    body: twiml.toString()
  }
}
