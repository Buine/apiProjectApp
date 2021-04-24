const Validator = require('fastest-validator');
const v = new Validator(); 

const messages = {
    email: "Email invalid"
}

module.exports = {
    registerValidator: (value) => {
        return v.validate(value, {
            email: { type: "email", messages },
            password: { type: "string", min: 6, max: 128 },
        })
    },
    loginValidator: (value) => {
        return v.validate(value, {
            email: { type: "email", messages },
            password: { type: "string", min: 6, max: 128 },
        })
    },
    forgetPasswordValidator: (value) => {
        return v.validate(value, {
            email: { type: "email", messages },
        })
    }
}