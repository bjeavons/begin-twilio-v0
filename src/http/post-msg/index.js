let arc = require('@architect/functions');
let router = require('./router.js');

exports.handler = async function http(req) {
  let payload = arc.http.helpers.bodyParser(req);
  
  console.log('got body:', payload.Body, 'from:', payload.From);
  
  console.log('env',process.env.TWILIO_SENDER);

  response = router(payload);

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/xml',
    },
    body: response.toString()
  }
}
