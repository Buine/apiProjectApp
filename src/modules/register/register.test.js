/**
 * @jest-environment node
 */

const axios = require('axios').default;
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const db = require('../../database');
const port = process.env.PORT || 3000;
const host = process.env.FRONTEND_HOST || "localhost";
const address = `http://${host}:${port}/api`;
var cookieJar;

beforeAll(async () => {
    await db.sequelize.sync();
    axiosCookieJarSupport(axios);
    cookieJar = new tough.CookieJar();
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
    it("user create successfully", async () => {
        const response = await postApi(query(email, password));
        const user = await db.User.findOne({ where: { email } });
        expect(response.data.register).toEqual({ id: user.id, email: user.email });
    });

    it("user already exists", async () => {
        const response = await postApi(query(email, password), true);
        expect(response.errors[0].extensions.code).toEqual("USER_EXIST");
    });

    it("session already exists", async () => {
        const response = await postApi(query("test2@test.com", password));
        //console.log(response);
        expect(response.errors[0].extensions.code).toEqual("ACTIVE_SESSION");
    });

    it("email invalid", async () => {
        const response = await postApi(query("", password));
        expect(
            response.errors[0]
            .extensions.error
            .filter(
                (item) => item.path == "email").length > 0
            ).toBe(true);
    });

    it("password invalid", async () => {
        const response = await postApi(query("", ""));
        expect(
            response.errors[0]
            .extensions.error
            .filter(
                (item) => item.path == "password").length > 0
            ).toBe(true);
    });
});

async function postApi(query, notCookies) {
    const response = await axios({
        method: 'post',
        jar: !notCookies ? cookieJar: undefined,
        withCredentials: !notCookies ? true :  false,
        url: address,
        data: { query },
    });

    return response.data;
}