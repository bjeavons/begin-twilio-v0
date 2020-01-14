const twilio = require('twilio');
let arc = require('@architect/functions');

function validateRequest(req) {
    if (process.env.NODE_ENV != 'production' && parseInt(process.env.LOG_LEVEL) === 7) {
        console.log('twilio.validateRequest', 'provided signature:', req.headers['X-Twilio-Signature']);
        console.log('twilio.validateRequest', 'req:', req);
        console.log('twilio.validateRequest', 'parsed:', arc.http.helpers.bodyParser(req));
    }
    return twilio.validateRequestWithBody(
        process.env.TWILIO_AUTH_TOKEN,
        req.headers['X-Twilio-Signature'],
        process.env.TWILIO_URL,
        req.body
    );
}

function parseMessage(data) {
    return {
        sender: data.From.replace(/[^\d.-]/g, ""),
        message: data.Body
    }
}

function twiml(body) {
    const twiml = new twilio.twiml.MessagingResponse();
    return twiml.message(body);
}

async function sendMessage(message, to) {
    const client = new twilio.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return await client.messages.create({
        body: message,
        from: process.env.TWILIO_SENDER,
        to: to
    });
}

module.exports = {
    validateRequest: validateRequest,
    parseMessage: parseMessage,
    twiml: twiml,
    sendMessage: sendMessage
}