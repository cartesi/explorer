import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { join } from 'path';
import { BigInt, Float, Int, String } from './custom-scalars';
const typesArray = loadFilesSync(join(__dirname, '../schema'), {
    recursive: true,
});
const typeDefs = mergeTypeDefs(typesArray);
const schema = makeExecutableSchema({ typeDefs });
console.log(join(__dirname, '../schema'));
const mocks = {
    BigInt,
    Int,
    Float,
    String,
};

const schemaWithMocks = addMocksToSchema({
    schema,
    mocks,
    preserveResolvers: false,
});

const yoga = createYoga({
    schema: schemaWithMocks,
    cors: (request) => {
        const requestOrigin = request.headers.get('origin');
        return {
            origin: requestOrigin,
            methods: ['POST'],
        };
    },
});

const server = createServer(yoga);
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
});
