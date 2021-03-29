const { importSchema } = require("graphql-import");
const { mergeSchemas, makeExecutableSchema } = require("graphql-tools");
//const { GraphQLSchema } = require("graphql");
const fs = require('fs');
const path = require('path');

const genSchema = () => {
    const schemas = [];
    
    const foldersModule = fs.readdirSync(path.join(__dirname, "../modules"));
    foldersModule.forEach(folder => {
        const resolvers = require(path.join(__dirname, `../modules/${folder}/resolvers.js`));
        const typeDefs = importSchema(
            path.join(__dirname, `../modules/${folder}/schema.graphql`)
        );
        schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
    });

    return mergeSchemas({ schemas }); 
}

module.exports = genSchema;