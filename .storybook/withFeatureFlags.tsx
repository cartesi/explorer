import FlagProvider from '@unleash/proxy-client-react';
import React, { FC } from 'react';
import { config } from '../src/utils/featureFlags';

export default (Story: FC) => (
    <FlagProvider config={config}>
        <Story />
    </FlagProvider>
);
