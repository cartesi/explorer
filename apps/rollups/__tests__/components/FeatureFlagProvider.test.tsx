// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, render, screen } from '@testing-library/react';
import { withChakraTheme } from '../test-utilities';
import { WhenReady, Props } from '../../src/components/FeatureFlagProvider';
import { useFlagsStatus } from '@unleash/proxy-client-react';

jest.mock('@unleash/proxy-client-react', () => ({
    useUnleashContext: () => jest.fn(),
    useFlagsStatus: jest.fn(),
}));
const useFlagsStatusStub = useFlagsStatus as jest.MockedFunction<
    typeof useFlagsStatus
>;

const Component = withChakraTheme<Props>(WhenReady);

describe('FeatureFlagProvider component', () => {
    describe('WhenReady component', () => {
        afterEach(() => {
            jest.clearAllMocks();
            cleanup();
        });

        it('should render content when flags are ready', () => {
            useFlagsStatusStub.mockImplementation(() => ({
                flagsReady: true,
                flagsError: null,
            }));

            const text = 'feature-flagged-content';
            render(
                <Component>
                    <div>{text}</div>
                </Component>
            );

            expect(screen.getByText(text)).toBeInTheDocument();
        });

        it('should render spinner while flags are not ready', () => {
            useFlagsStatusStub.mockImplementation(() => ({
                flagsReady: false,
                flagsError: null,
            }));

            const text = 'feature-flagged-content';
            render(
                <Component>
                    <div>{text}</div>
                </Component>
            );

            expect(
                screen.getByTestId('when-ready-spinner')
            ).toBeInTheDocument();
        });
    });
});
