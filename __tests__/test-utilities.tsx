import { ChakraProvider } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import theme from '../src/styles/theme';

/**
 * A HOC for tests where the component uses any of our custom theme properties e.g. color grey.support
 * @param Component A functional component
 * @returns
 */
export const withChakraTheme =
    <T,>(Component: FunctionComponent<T>): FunctionComponent<T> =>
    (props: T) =>
        (
            <ChakraProvider theme={theme}>
                <Component {...props} />
            </ChakraProvider>
        );
