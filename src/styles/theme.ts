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
    styles: {
        global: {
            'html, body, body > div': {
                height: '100%',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 0,
                fontWeight: 'normal',
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
    colors: {
        primary: 'rgba(0, 0, 0, 0.9)',
        secondary: '#3d3d3d',
        info: '#007bff',
        gray1: '#e9e9e9',
        gray2: '#e0e0e0',
        gray3: '#b9b9b9',
        gray9: '#242424',
    },
    zIndices: {
        sm: 1010,
        md: 1020,
        lg: 1030,
        xl: 1040,
        xxl: 1050,
    },
});

export default theme;
