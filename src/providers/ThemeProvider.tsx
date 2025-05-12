'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { Fonts } from '../components/Fonts';
import theme from '../styles/theme';
import { ColorModeProvider } from '../components/ui/color-mode';

interface ChakraProviderProps {
    children: ReactNode;
}

const Provider: FC<ChakraProviderProps> = (props) => {
    return (
        <ChakraProvider value={theme}>
            <Fonts />
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
};

export default Provider;
