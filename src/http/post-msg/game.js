const chats = require('@architect/shared/chat');
const tokens = require('@architect/shared/token');
const twilio = require('@architect/shared/twilio');

async function game(payload) {
    const {sender, message} = twilio.parseMessage(payload);
    console.log('Message:', message, 'From:', sender);

    var response = {
        headers: {
            'content-type': 'text/xml',
        }
    };

    if (message.toLowerCase() === 'help') {
        response = {
            body: twilio.twiml("Text an access token to join a chat. Text 'stop' to leave a chat. Msg&data rates may apply.")
        }
    }
    else {
        const chat = await chats.get(sender);
        if (!chat) {
            // If no pending chat then start one.
            const pendingChat = await chats.pending(message.toLowerCase());
            if (tokens.includes(message.toLowerCase()) && pendingChat === null) {
                await chats.start(sender, message.toLowerCase());
                response.body = twilio.twiml("Started chat, waiting for another to join. Text 'help' for help or 'stop' to leave. Msg&data rates may apply.");
            }
            else if (tokens.includes(message.toLowerCase()) && pendingChat !== sender) {
                await chats.join(sender, message.toLowerCase());
                response.body = twilio.twiml("Joined chat, your messages will be relayed. Text 'help' for help or 'stop' to leave. Msg&data rates may apply.");
            }
            else if (pendingChat === sender) {
                console.log("Cannot join chat with self");
                response.body = twilio.twiml("Get a friend to join this chat!");
            }
            else {
                console.log("No pending or active chat, message won't be relayed");
                response.body = twilio.twiml("❓");
            }
        }
        else if (message.toLowerCase() === "stop") {
            await chats.end(sender);
            response.body = twilio.twiml("You've left the chat. 👋");
        }
        else if (chat) {
            let receiver = chats.getReceiver(chat, sender);

            console.log("Relay message to", receiver);
            if (process.env.NODE_ENV === 'production') {
                try {
                    const relayedMessage = await twilio.sendMessage(message, receiver);
                    console.log('Relayed message SID', relayedMessage.sid);
                } 
                catch (e) {
                    console.log('ERROR:', e);
                }
            }
        }
    }

    return response;
}

module.exports = game;