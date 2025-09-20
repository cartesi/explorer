import { useEffect } from 'react';
import { ColorMode, useColorMode } from '../src/components/ui/color-mode';
import { Globals } from 'storybook/internal/csf';

export default ({
    globals: {
        backgrounds: { value = 'dark' },
    },
}: Globals) => {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== value) setColorMode(value as ColorMode);
    }, [value, colorMode, setColorMode]);
    return null;
};
