import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const config = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            env: {
                graphUrl: 'http://localhost:8000'
            }
        };
    }

    return {
        env: {
            graphUrl: 'https://api.thegraph.com/index-node/graphql'
        }
    }
}

export default config;