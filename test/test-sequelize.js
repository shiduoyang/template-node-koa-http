const mocha = require('mocha'),
    assert = require('assert'),
    model = require('../models');

describe('test-sequelize', async () => {
    it('test-find', async () => {
        let user = await model['User'].findOne();
    });
});