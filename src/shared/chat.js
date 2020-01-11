let data = require('@begin/data');

function getChat(participant) {
    if (participant === '17203355236' || participant === '19703966815') {
        return {
            "id":"1",
            "participant_1":"7203355236",
            "participant_2":"19703966815"
        }
    }
    return false;
}

module.exports = {
    getChat: getChat
}