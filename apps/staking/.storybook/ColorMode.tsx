// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

export default ({ globals: { theme = 'dark' } }) => {
    const { colorMode, setColorMode } = useColorMode();
    useEffect(() => {
        if (colorMode !== theme) setColorMode(theme);
    }, [theme, colorMode]);
    return null;
};
