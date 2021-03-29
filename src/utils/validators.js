const Validator = require('fastest-validator');
const v = new Validator(); 

module.exports = {
    registerValidator: (value) => {
        return v.validate(value, {
            email: { type: "email", messages: { email: "Email invalid" } },
            password: { type: "string", min: 6, max: 128 },
        })
    }
}