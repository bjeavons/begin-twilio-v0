let data = require('@begin/data');

exports.handler = async function http(req) {
  let chats = await data.get({
    table: 'chat'
  });
  let participants = await data.get({
    table: 'participant'
  });
  let pending = await data.get({
    table: 'pending'
  });

  let body = {
    pending: pending,
    participants: participants,
    chats: chats
  };

  return {
    headers: {
      'content-type': 'application/json',
    },
    body: process.env.NODE_ENV === 'product' ? '' : JSON.stringify(body)
  }
}
