/**
 * @jest-environment node
 */

const axios = require('axios').default;
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const port = process.env.PORT || 3000;
const host = process.env.FRONTEND_HOST || "localhost";
const address = `http://${host}:${port}/api`;
var cookieJar;

beforeAll(async () => {
    axiosCookieJarSupport(axios);
    cookieJar = new tough.CookieJar();
});

describe("Hello World!", () => {
    test("make sure it works", async () => {
        const json = await postApi('query { hello }', true);
        expect(json.data.hello).toBe('Hello world!');
    });
})

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