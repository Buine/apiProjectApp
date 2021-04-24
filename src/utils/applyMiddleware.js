/**
 * Apply Middleware
 * @param { Function } middleware 
 * @param { Function } resolver 
 * @returns { Function }
 */
module.exports = (middleware, resolver) => async (parent, args, context, info) => {
    return middleware(resolver, parent, args, context, info, );
}