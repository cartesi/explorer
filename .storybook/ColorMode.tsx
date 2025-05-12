import { useEffect } from 'react';
import { ColorMode, useColorMode } from '../src/components/ui/color-mode';

export default ({ globals: { theme = 'dark' } }) => {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== theme) setColorMode(theme as ColorMode);
    }, [theme, colorMode, setColorMode]);
    return null;
};
