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
        borderRadius: '1.875rem',
        fontWeight: '500',
        fontFamily: "'Plus Jakarta Sans'",
    },
    sizes: {
        lg: {
            fontSize: 'md',
        },
        md: {
            fontSize: 'sm',
        },
        sm: {
            fontSize: 'xs',
        },
    },
    variants: {
        outline: (props: { colorScheme: string; colorMode: string }) => {
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
        solid: (props: { colorScheme: string; colorMode: string }) => {
            if (props.colorScheme === 'darkGray') {
                return {
                    bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.900',
                    color: props.colorMode === 'dark' ? 'white' : 'white',
                    _hover: {
                        bg: props.colorMode === 'dark' ? 'gray.500' : 'red.100',
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
                    bg:
                        props.colorMode === 'light'
                            ? 'blue.200'
                            : 'dark.primary',
                    color: 'gray.900',
                    textTransform: 'uppercase',
                    _hover: {
                        bg:
                            props.colorMode === 'light'
                                ? 'blue.100'
                                : 'dark.primary',
                        color:
                            props.colorMode === 'light' ? 'gray.900' : 'black',
                    },
                    borderWidth: '1px',
                    borderColor:
                        props.colorMode === 'light' ? 'gray.80' : 'white',
                    _disabled: {
                        color: `${
                            props.colorMode === 'light'
                                ? 'gray.900'
                                : 'dark.gray.senary'
                        } !important`,
                        bg: `${
                            props.colorMode === 'light'
                                ? 'blue.200'
                                : 'dark.gray.quaternary'
                        } !important`,
                        borderColor: `${
                            props.colorMode === 'light'
                                ? 'gray.80'
                                : 'dark.border.quaternary'
                        } !important`,
                    },
                    _active: {
                        bg:
                            props.colorMode === 'light'
                                ? 'blue.100'
                                : 'dark.primary',
                        color:
                            props.colorMode === 'light' ? 'gray.900' : 'black',
                    },
                };
            }
            if (props.colorScheme === 'cyan') {
                return {
                    bg:
                        props.colorMode === 'light'
                            ? 'cyan.primary'
                            : 'dark.primary',
                    color:
                        props.colorMode === 'light'
                            ? 'dark.gray.primary'
                            : 'black',
                    textTransform: 'uppercase',
                    borderWidth: '1px',
                    borderColor: 'white',
                    _hover: {
                        bg:
                            props.colorMode === 'light'
                                ? 'cyan.secondary'
                                : 'dark.primary',
                    },
                    _active: {
                        bg:
                            props.colorMode === 'light'
                                ? 'cyan.secondary'
                                : 'dark.primary',
                    },
                };
            }

            return;
        },
        ghost: (props: { colorScheme: string; colorMode: string }) => {
            if (props.colorScheme === 'darkGray') {
                return {
                    borderWidth: props.colorMode === 'light' ? 0 : '1px',
                    borderColor:
                        props.colorMode === 'light'
                            ? 'transparent'
                            : 'light.gray.senary',
                    textTransform: 'uppercase',
                    bg:
                        props.colorMode === 'light'
                            ? 'transparent'
                            : 'dark.gray.primary',
                };
            }

            return {
                textTransform: 'uppercase',
            };
        },
        link: (props: { colorScheme: string; colorMode: string }) => {
            return {
                color:
                    props.colorMode === 'light' ? 'blue.200' : 'dark.primary',
                textTransform: 'uppercase',
            };
        },
    },
    defaultProps: {
        size: 'lg',
    },
};
