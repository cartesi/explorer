// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export const Button = {
    baseStyle: {
        borderRadius: 0,
        fontWeight: 'normal',
        // textTransform: 'uppercase',
    },
    variants: {
        outline: (props) => {
            if (props.colorScheme === 'darkGray') {
                return {
                    borderColor:
                        props.colorMode === 'dark' ? 'gray.600' : 'gray.900',
                    _hover: {
                        bg:
                            props.colorMode === 'dark'
                                ? 'rgba(0, 0, 0, 0.1)'
                                : 'gray.50',
                    },
                };
            }

            return;
        },
        solid: (props) => {
            if (props.colorScheme === 'darkGray') {
                return {
                    bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.900',

                    color: props.colorMode === 'dark' ? 'white' : 'white',
                    _hover: {
                        bg:
                            props.colorMode === 'dark'
                                ? 'gray.500'
                                : 'gray.700',
                        color: props.colorMode === 'dark' ? 'white' : 'white',
                    },
                    _active: {
                        bg:
                            props.colorMode === 'dark'
                                ? 'gray.600'
                                : 'gray.800',
                        color: props.colorMode === 'dark' ? 'white' : 'white',
                    },
                    _disabled: {
                        bg:
                            props.colorMode === 'dark'
                                ? 'gray.600'
                                : 'gray.200',
                        color:
                            props.colorMode === 'dark'
                                ? 'gray.200'
                                : 'gray.500',
                    },
                };
            }

            if (props.colorScheme === 'blue') {
                return {
                    bg: 'blue.500',
                    color: 'white',
                    _hover: {
                        bg: 'blue.600',
                        color: 'white',
                    },
                };
            }

            return;
        },
    },
    defaultProps: {
        size: 'lg',
    },
};
