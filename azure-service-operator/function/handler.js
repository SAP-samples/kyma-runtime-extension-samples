const urlUtil = require("url");

const redis = require("redis");

var redisClient = redis.createClient({
    url: `rediss://${process.env.REDIS_CACHE_NAME}.redis.cache.windows.net:6380`,
    password: process.env.REDIS_CACHE_KEY
});

(async () => {
    await redisClient.connect();
}
)();

module.exports = {
    main: async function (event, context) {
        try {
            if (event.extensions.request.method === 'POST') {
                await saveEntry(event);
                console.log('saved');
            } else if (event.extensions.request.method === 'GET') {
                const entry = await getEntry(event);
                if (entry == null) {
                    event.extensions.response.sendStatus(404);
                }else {
                    return entry;
                }
            }
        } catch (error) {
            console.log(error);
            event.extensions.response.sendStatus(500);
        }
    }
}

async function saveEntry(event) {
    console.log(JSON.stringify(event.data));
    const id = event.data.id;
    await redisClient.set(id, JSON.stringify(event.data));
}

async function getEntry(event) {
    const id = urlUtil.parse(event.extensions.request.url).pathname.replace(/\/*/, "");

    console.log(`Getting entry for id: ${id}`);
    const entryString = await redisClient.get(id);
    console.log(`Got entry for id: ${id}`);
    if (entryString == null || entryString == undefined || entryString === "") {
        return null;
    } else {
        const entry = JSON.parse(entryString);
        return entry;
    }
}