const config = () => {
    // if (process.env.NODE_ENV === 'development') {
    //     return {
    //         graphUrl: 'http://localhost:8000/subgraphs/name/cartesi/cartesi',
    //     };
    // }

    return {
        graphUrl: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
    };
};

module.exports = config;
