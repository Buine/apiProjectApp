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

describe("me function", () => {
    it("me not authenticated", async () => {
        let response = await client.me(true);
        expect(response.errors[0].name).toBe("NotAuthenticatedError");
    })

    it("me successfully", async () => {
        await client.register({ email: "me1@test.com", password: "123456789" }, false);
        await client.login({ email: "me1@test.com", password: "123456789" }, true);
        let response = await client.me(true);
        const user = await db.User.findOne({ where: { email: "me1@test.com" } });
        expect(response.data.me.id).toBe(user.id);
    });
});