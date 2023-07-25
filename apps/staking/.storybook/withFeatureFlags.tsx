import { StoryContext } from '@storybook/react';
import FlagProvider from '@unleash/proxy-client-react';
import { config } from '../src/utils/featureFlags';

export default (Story: Function, _context: StoryContext) => (
    <FlagProvider config={config}>
        <Story />
    </FlagProvider>
);
