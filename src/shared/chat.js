let data = require('@begin/data');

async function pendingChat(chatKey) {
    let response = await data.get({ table: 'pending', key: chatKey }); 
    return response !== null ? response.participant : null;
}

async function startChat(participant, chatKey) {
    console.log('Starting chat on', chatKey, 'awaiting another participant');
    await data.set({
        table: 'pending',
        key: chatKey,
        participant
    });
    await data.set({
        table: 'participant',
        key: participant,
        chatKey
    });
}

async function joinChat(participant, chatKey) {
    // If there's a pending chat then join it else start a pending chat.
    let pendingChat = await data.get({ table: 'pending', key: chatKey });
    if (pendingChat === null) {
        console.log('No pending chat on', chatKey);
        throw new Error();
    }
    else {
        // Upgrade from pending to full chat and remove pending.
        console.log('Starting chat on', chatKey);
        let chat = {
            participant_1: pendingChat.participant,
            participant_2: participant,
            created: Date.now()
        };
        await data.set({
            table: 'chat',
            key: chatKey,
            ...chat
        });
        await data.set({
            table: 'participant',
            key: participant,
            chatKey
        });
        await data.destroy({
            table: 'pending',
            key: chatKey
        })
    }
}

async function getChat(participant) {
    let record = await data.get({ table: 'participant', key: participant });
    if (record === null) {
        console.log('Not a chat participant', participant);
        return false;
    }
    let chat = await data.get({ table: 'chat', key: record.chatKey });
    if (chat === null) {
        console.log('No active chat on', record.chatKey);
        return false;
    }
    console.log('Matched chat with participants', chat.participant_1, chat.participant_2);
    return chat;
}

async function endChat(participant) {
    let record = await data.get({ table: 'participant', key: participant });
    if (record === null) {
        console.log('Not a chat participant', participant);
        return false;
    }
    else {
        let chat = await getChat(participant);
        await data.destroy({
            table: 'chat',
            key: record.chatKey
        });
        await data.destroy({
            table: 'participant',
            key: chat.participant_1
        });
        await data.destroy({
            table: 'participant',
            key: chat.participant_2
        });
        return true;
    }
}

function getReceiver(chat, sender) {
    if (chat.participant_1 === sender) {
        return chat.participant_2;
    }
    else {
        return chat.participant_1;
    }
}

module.exports = {
    pending: pendingChat,
    start: startChat,
    join: joinChat,
    get: getChat,
    end: endChat,
    getReceiver: getReceiver
}