import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

export default ({ globals: { theme = 'dark' } }) => {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== theme) setColorMode(theme);
    }, [theme, colorMode]);
    return null;
};
