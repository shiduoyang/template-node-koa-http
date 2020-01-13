"use strict"
const blueBird = require("bluebird"),
    env = process.env.NODE_ENV || 'development',
    config = require('../config/redisConfig.json')[env],
    redis = require("redis");

let client = redis.createClient(config);
client.on('ready', function (res) {
    console.log(`redis-${config.host}:${config.port} ${redis.db || 0} ready`); 
});
client.on('error', function (error) {
    console.log("RedisServer is error!\n" + error);
});
client.on("connect", function () {
    console.log("RedisServer is connected!");
});
client.on("end", function () {
    console.log("RedisServer is end!");
});
blueBird.promisifyAll(client);
module.exports = client;