const Twilio = require('twilio');
const msgStore = require('@architect/shared/msg');
const chatStore = require('@architect/shared/chat');
const tokens = require('@architect/shared/token');

function router(payload) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioSender = process.env.TWILIO_SENDER;

    const twiml = new Twilio.twiml.MessagingResponse();
    var twilioClient = new Twilio(accountSid, authToken);

    const sender = payload.From.replace(/[^\d.-]/g, "");
    const msg = payload.Body;

    msgStore.set(msg);

    if (msg.toLowerCase() === 'help') {
        twiml.message('i can help you');
    }
    else {
        const chat = chatStore.getChat(sender);
        if (!chat && tokens.includes(msg.toLowerCase())) {
            console.log("Start chat");
        }
        else if (!chat) {
            console.log("No active chat!");
        }
        else if (chat.participant_2 === "" && tokens.includes(msg.toLowerCase())) {
            console.log("Join chat");
        }
        else if (msg.toLowerCase() === "stop") {
            console.log("Stopping chat");
        }
        else {
            if (chat.participant_1 === sender) {
                receiver = chat.participant_2;
            }
            else {
                receiver = chat.participant_1;
            }
            console.log("Relay message to",receiver);

            twilioClient.messages
                .create({body: msg, from: twilioSender, to: receiver})
                .then(message => console.log(message.sid))
                .catch(e => console.log(e));
        }

        twiml.message('hello robo');
    }

    return twiml;
}

module.exports = router;