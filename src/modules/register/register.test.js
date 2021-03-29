const fetch = require('node-fetch');
const db = require('../../database');
const { test } = require('../../database/config');
const port = process.env.PORT || 3000;
const host = process.env.FRONTEND_HOST || "localhost";
const address = `http://${host}:${port}/api`;

beforeAll(async () => {
    await db.sequelize.sync();
});

const email = "test@test.com";
const password = "123456";
const query = (e, p) => `
mutation {
    register(email: "${e}", password: "${p}"){
        id
        email
    }
}
`;

describe("register function", () => {
    it("case successfully", async () => {
        const response = await postApi(query(email, password));
        const user = await db.User.findOne({ where: { email } });
        expect(response.data.register).toEqual({ id: user.id, email: user.email });
    });

    it("case user already exists", async () => {
        const response = await postApi(query(email, password));
        expect(response.errors[0].extensions.code).toEqual("USER_EXIST");
    });
});

async function postApi(query) {
    const response = await fetch(address, {
        method: 'POST', 
        body: JSON.stringify({ query }),
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
    });
    return await response.json();
}