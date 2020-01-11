let arc = require('@architect/functions');
let msgStore = require('@architect/shared/msg');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

exports.handler = async function http(req) {
  let payload = arc.http.helpers.bodyParser(req);
  const twiml = new MessagingResponse();
  
  console.log('got body:', payload.Body);
  
  await msgStore.set(payload.Body);
  let msgs = await msgStore.get();

  twiml.message('hello robo');

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/xml',
    },
    body: twiml.toString()
  }
}
