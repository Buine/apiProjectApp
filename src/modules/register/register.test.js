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

describe("register function", () => {
    it("user create successfully", async () => {
        const response = await client.register({ email, password }, true);
        const user = await db.User.findOne({ where: { email } });
        expect(response.data.register).toEqual({ id: user.id, email: user.email });
    });

    it("user already exists", async () => {
        const response = await client.register({email, password}, false);
        expect(response.errors[0].name).toEqual("EmailAlreadyRegisteredError");
    });

    it("session already exists", async () => {
        const response = await client.register({ email: "test2@test.com", password}, true);
        expect(response.errors[0].name).toEqual("AlreadyAuthenticatedError");
    });

    it("email invalid", async () => {
        const response = await client.register({ email: "", password }, false);
        expect(
            response.errors[0]
            .data.fields
            .filter(
                (item) => item.path == "email").length > 0
            ).toBe(true);
    });

    it("password invalid", async () => {
        const response = await client.register({ email: "", password: ""}, false);
        expect(
            response.errors[0]
            .data.fields
            .filter(
                (item) => item.path == "password").length > 0
            ).toBe(true);
    });
});
