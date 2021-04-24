/**
 * @jest-environment node
 */

const ClientTest = require('../../utils/clientTest');
 var client;

 
beforeAll(async () => {
    client = new ClientTest();
});

const email = "test_logout@test.com";
const password = "123456";


describe('logout function', () => {
    it("logout successfully", async () => {
        await client.register({ email, password }, false);
        await client.login({ email, password }, true);
        const response = await client.logout(true);
        expect(response.data.logout).toBe(true);
    });

    it("logout successfully", async () => {
        const response = await client.logout(false);
        expect(response.errors[0].name).toBe("NotAuthenticatedError");
    });
});