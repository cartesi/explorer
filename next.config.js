const config = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            graphUrl: 'http://localhost:8000/subgraphs/name/cartesi/cartesi',
        };
    }

    return {
        graphUrl: 'https://thegraph.com/explorer/subgraph/cartesi/cartesi',
    };
};

module.exports = config;
