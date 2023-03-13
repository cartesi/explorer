// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ChakraProvider } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import theme from '../src/styles/theme';

/**
 * A HOC for tests where the component uses any of our custom theme properties e.g. color grey.support
 * @param Component A functional component
 * @returns
 */
const withChakraTheme =
    <T,>(Component: FunctionComponent<T>): FunctionComponent<T> =>
    (props: T) =>
        (
            <ChakraProvider theme={theme}>
                <Component {...props} />
            </ChakraProvider>
        );
/**
 * Type definition so return mocks can be manipulated at ease e.g. useStaking or useCartesiToken
 */
type ReturnOf<T> = T extends (...a: any) => infer R ? R : any;

export type { ReturnOf };

export { withChakraTheme };
