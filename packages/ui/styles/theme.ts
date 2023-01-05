// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { extendTheme } from '@chakra-ui/react';
import { Heading } from './components/heading';
import { Text } from './components/text';
import { Button } from './components/button';
import { Link } from './components/link';
import { Modal } from './components/modal';
import { Table } from './components/table';
import { Input } from './components/input';
import { colors } from './foundations/colors';
import { zIndices } from './foundations/zIndices';
import { fonts } from './foundations/fonts';
import { buildOnboardTheme as onboardThemeV1 } from './onboardTheme';
import { formsTheme } from './formsTheme';
import { buildOnboardTheme } from './onboard';

const theme = extendTheme({
    styles: {
        global: (props: any) => {
            return {
                'html, body': {
                    color: props.colorMode === 'dark' ? 'white' : 'gray.800',
                },
                ...onboardThemeV1(props),
                ...buildOnboardTheme(props),
                ...formsTheme(),
            };
        },
    },
    config: {
        initialColorMode: 'light',
    },
    components: {
        Heading,
        Text,
        Button,
        Link,
        Modal,
        Table,
        Input,
    },
    fonts,
    colors,
    zIndices,
});

export default theme;
