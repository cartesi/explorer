// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

const borderRadius = '6px';

export const Input = {
    baseStyle: (props: { colorMode: string }) => ({
        field: {
            borderRadius,
            _disabled: {
                backgroundColor:
                    props.colorMode === 'light'
                        ? 'dark.gray.senary'
                        : 'dark.border.secondary',
            },
            _focus: {
                boxShadow: 'none',
            },
        },
        control: {
            _focus: {
                boxShadow: 'none',
            },
        },
    }),
    variants: {
        outline: {
            field: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
        },
        filled: {
            field: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
        },
        flushed: {
            field: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
        },
        unstyled: {
            field: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
        },
    },
};
