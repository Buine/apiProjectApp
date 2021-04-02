const requestify = require('requestify');
const { sessions } = require('../../config');
const { register, login, tmp, logout } = require('./queryTest');

class ClientTest {
    constructor() {
        this.cookiesManager = {};
        this.port = process.env.PORT || 3000;
        this.host =  process.env.FRONTEND_HOST || "localhost";
        this.address = `http://${this.host}:${this.port}/api`;
    }

    clearSession() {
        this.cookiesManager = {};
    }

    saveSession(response) {
        let headers = response.getHeaders();
        if(headers['set-cookie']){
            let session = headers['set-cookie'][0].split(";")[0].split("=")[1];
            let key = sessions.name;
            this.cookiesManager[key] = session;
        }
    }

    async register(user, withCookies = false) {
        let cookies = withCookies ? this.cookiesManager : {};
        const { email, password } = user;
        const response = await requestify.request(this.address, {
            method: 'POST',
            body: { query: register(email, password) },
            cookies
        });
        if(withCookies){ 
            this.saveSession(response); 
        }
        return response.getBody();
    }

    async login(user, withCookies = false) {
        let cookies = withCookies ? this.cookiesManager : {};
        const { email, password } = user;
        const response = await requestify.request(this.address, {
            method: 'POST',
            body: { query: login(email, password) },
            cookies
        });
        if(withCookies){ 
            this.saveSession(response); 
        }
        return response.getBody();
    }

    async test(withCookies = false) {
        let cookies = withCookies ? this.cookiesManager : {};
        const response = await requestify.request(this.address, {
            method: 'POST',
            body: { query: tmp() },
            cookies
        });
        if(withCookies){ 
            this.saveSession(response); 
        }
        return response.getBody();
    }

    async logout(withCookies = false) {
        let cookies = withCookies ? this.cookiesManager : {};
        const response = await requestify.request(this.address, {
            method: 'POST',
            body: { query: logout() },
            cookies
        });
        if(withCookies){ 
            this.saveSession(response);
            this.clearSession(); 
        }
        return response.getBody();
    }
}

module.exports = ClientTest;