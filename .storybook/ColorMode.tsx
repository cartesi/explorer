import { useEffect } from 'react';
import { ColorMode, useColorMode } from '../src/components/ui/color-mode';

export default ({ value }: { value: ColorMode }) => {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== value) setColorMode(value);
    }, [value, colorMode, setColorMode]);
    return null;
};
