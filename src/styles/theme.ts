// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { extendTheme } from '@chakra-ui/react';
import { Button } from './components/button';
import { Link } from './components/link';
import { Modal } from './components/modal';
import { Table } from './components/table';
import { colors } from './foundations/colors';
import { zIndices } from './foundations/zIndices';
import { fonts } from './foundations/fonts';

const theme = extendTheme({
    styles: {
        global: (props) => ({
            // apply height to the root tags, e.g. allows the initial loader to be displayed in the center of the screen.
            'html, body, body > div': {
                height: '100%',
            },
            'html, body': {
                color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            },
        }),
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    components: {
        Button,
        Link,
        Modal,
        Table,
    },
    fonts,
    colors,
    zIndices,
});

export default theme;
