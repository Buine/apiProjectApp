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
const queryLogin = (e, p) => `
mutation {
    login(email: "${e}", password: "${p}"){
        id
        email
    }
}
`;
const queryRegister = (e, p) => `
mutation {
    register(email: "${e}", password: "${p}"){
        id
        email
    }
}
`;

describe('login function', () => {
    it('login successfully', async () => {
        await postApi(queryRegister(email, password), true);
        const response = await postApi(queryLogin(email, password), false);
        const user = await db.User.findOne({ where: { email } });
        expect(response.data.login).toEqual({ id: user.id, email: user.email });
    }),
    it('session already exists', async () => {
        const response = await postApi(queryLogin(email, password), false);
        expect(response.errors[0].extensions.code).toEqual('ACTIVE_SESSION');
    })
});

async function postApi(query, notCookies) {
    const response = await axios({
        method: 'post',
        jar: !notCookies ? cookieJar : undefined,
        withCredentials: !notCookies ? true :  false,
        url: address,
        data: { query },
    });

    return response.data;
}