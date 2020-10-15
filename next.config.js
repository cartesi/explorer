const config = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            graphUrl: 'http://localhost:8000/subgraphs/name/cartesi/cartesi-subgraph',
        };
    }

    return {
        graphUrl: 'https://api.thegraph.com/index-node/graphql',
    };
};

module.exports = config;
