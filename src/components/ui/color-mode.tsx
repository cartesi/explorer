'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider, useTheme } from 'next-themes';
import * as React from 'react';

export function ColorModeProvider(props: ThemeProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            defaultTheme="dark"
            {...props}
        />
    );
}

export type ColorMode = 'light' | 'dark';

export interface UseColorModeReturn {
    colorMode: ColorMode;
    setColorMode: (colorMode: ColorMode) => void;
    toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme } = useTheme();
    const toggleColorMode = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };
    return {
        colorMode: resolvedTheme as ColorMode,
        setColorMode: setTheme,
        toggleColorMode,
    };
}

export function useColorModeValue<T>(light: T, dark: T) {
    const { colorMode } = useColorMode();
    return colorMode === 'dark' ? dark : light;
}
