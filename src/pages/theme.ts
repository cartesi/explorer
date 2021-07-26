// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                borderRadius: 0,
                fontWeight: 'normal',
            },
            variants: {
                solid: {
                    bg: 'gray.800',
                    color: 'white',
                    _hover: {
                        bg: 'gray.700',
                    },
                },
            },
            defaultProps: {
                size: 'lg',
            },
        },
        Link: {
            baseStyle: {
                _hover: { color: '#007bff', textDecoration: 'none' },
            },
        },
        Input: {
            sizes: {
                xs: {
                    field: {
                        borderRadius: 0,
                    },
                },
                sm: {
                    field: {
                        borderRadius: 0,
                    },
                },
                md: {
                    field: {
                        borderRadius: 0,
                    },
                },
                lg: {
                    field: {
                        borderRadius: 0,
                    },
                },
            },
        },
        Table: {
            variants: {
                simple: {
                    th: {
                        backgroundColor: 'black',
                        color: 'white',
                    },
                },
                clear: {},
            },
        },
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    fonts: {
        body: 'Rubik',
        heading: 'Rubik',
    },
});

export default theme;
