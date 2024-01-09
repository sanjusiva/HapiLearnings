import { expect } from '@hapi/code';
const Lab = require('@hapi/lab');
const {test} = require('../../src/server')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
describe('UserController', () => {
  describe('getUser', () => {
    let server:any;

    beforeEach(async() => {
    server = await test();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('returns a user successfully', async () => {
    const res = await server.inject({
        method: 'get',
        url: '/admin'
    });
    expect(res.result).to.equal('admin base');
    });
  });
});


