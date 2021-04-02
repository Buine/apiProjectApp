/**
 * @jest-environment node
 */

const ClientTest = require('../../utils/clientTest');
const db = require('../../database');
var client;

beforeAll(async () => {
    await db.sequelize.sync();
    client = new ClientTest();
});

const email = "test@test.com";
const password = "123456";

describe('login function', () => {
    it('login successfully', async () => {
        await client.register({ email, password }, false);
        const response = await client.login({ email, password }, true);
        const user = await db.User.findOne({ where: { email } });
        expect(response.data.login).toEqual({ id: user.id, email: user.email });
    }),
    it('session already exists', async () => {
        const response = await client.login({ email, password }, true);
        expect(response.errors[0].extensions.code).toEqual('ACTIVE_SESSION');
    })
});