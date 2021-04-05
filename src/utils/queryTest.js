module.exports = {
    tmp: () => `{ hello }`,
    register: (email, password) => `
        mutation {
            register(email: "${email}", password: "${password}"){
                id
                email
            }
        }
    `,
    login: (email, password) => `
    mutation {
        login(email: "${email}", password: "${password}"){
            id
            email
        }
    }
    `,
    logout: () => `mutation { logout }`,
    me: () => `{ me{ id } }`,
}