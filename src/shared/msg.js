let data = require('@begin/data');

async function set(body) {
    payload = {
        body: body,
        created: Date.now()
    }
    await data.set({
        table: 'msg',
        ...payload
    })
}

async function get() {
    return await data.get({
        table: 'msg'
    })
}

module.exports = {
    set: set,
    get: get
}