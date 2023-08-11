// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export const Table = {
    variants: {
        simple: (props: { colorMode: string }) => {
            return {
                th: {
                    backgroundColor: 'dark.gray.secondary',
                    color: 'white',
                    borderColor:
                        props.colorMode === 'dark'
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'light.gray.primary',
                },
                td: {
                    borderColor:
                        props.colorMode === 'dark'
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'light.gray.primary',
                },
            };
        },
        clear: {},
    },
};
