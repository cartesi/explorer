'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { FC, ReactNode } from 'react';
import { Fonts } from '../components/Fonts';
import theme from '../styles/theme';
import { ColorModeScript } from '@chakra-ui/react';

interface ChakraProviderProps {
    children: ReactNode;
}

const Provider: FC<ChakraProviderProps> = ({ children }) => {
    return (
        <ChakraProvider theme={theme}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Fonts />
                {children}
            </ThemeProvider>
        </ChakraProvider>
    );
};

export default Provider;
