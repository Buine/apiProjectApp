/**
 * @jest-environment node
 */

const ClientTest = require('../../utils/clientTest');
var client;

beforeAll(async () => {
    client = new ClientTest();
});

describe("Hello World!", () => {
    test("make sure it works", async () => {
        const json = await client.test(true);
        expect(json.data.hello).toBe('Hello world!');
    });
});