import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { join } from 'path';
import { BigInt } from './custom-scalars';

const typeDefs = readFileSync(join(process.cwd(), 'graphql/schema.graphql'), {
    encoding: 'utf-8',
});

const schema = makeExecutableSchema({ typeDefs });
const mocks = {
    BigInt,
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
