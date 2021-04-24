const { createError } = require('apollo-errors');

module.exports = {
    InputError: createError('InputError', {
        message: 'There are one or more invalid fields',
    }),
    AlreadyAuthenticatedError: createError('AlreadyAuthenticatedError', {
        message: "You're already authenticated",
    }),
    UserNotExistError: createError('UserNotExistError', {
        message: "User not found",
    }),
    BadPasswordError: createError('BadPasswordError', {
        message: "Password is incorrect",
    }),
    EmailAlreadyRegisteredError: createError('EmailAlreadyRegisteredError', {
        message: 'The email is already in use',
    }),
    NotAuthenticatedError: createError('NotAuthenticatedError', {
        message: 'You are not authenticated',
    }),
}