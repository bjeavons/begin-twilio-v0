const twilio = require('twilio');

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
    parseMessage: parseMessage,
    twiml: twiml,
    sendMessage: sendMessage
}