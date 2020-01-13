const mocha = require('mocha'),
    assert = require('assert'),
    rdsClient = require('../service/redis');

describe('test-redis', async () => {
    it('str-set', async () => {
        await rdsClient.setAsync('temp-111', 'hello');
        let value = await rdsClient.getAsync('temp-111');
        assert(value == 'hello', 'str-set failed');
    });

    it('str-del', async () => {
        await rdsClient.delAsync('temp-111');
        let value = await rdsClient.getAsync('temp-111');
        assert(value == null, 'str-del failed');
    });
});