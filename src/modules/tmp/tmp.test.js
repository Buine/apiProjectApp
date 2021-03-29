const fetch = require('node-fetch');
const port = process.env.PORT || 3000;
const host = process.env.FRONTEND_HOST || "localhost";
const address = `http://${host}:${port}/api`;

describe("Hello World!", () => {
    test("make sure it works", async () => {
        const response = await fetch(address, {
            method: 'POST', 
            body: JSON.stringify({ query: `query { hello }` }),
            headers: { "Content-Type": "application/json" },
        });
        const json = await response.json();
        expect(json.data.hello).toBe('Hello world!');
    });
})
