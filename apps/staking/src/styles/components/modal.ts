// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export const Modal = {
    baseStyle: (props: any) => ({
        dialog: {
            marginLeft: 3,
            marginRight: 3,
            minHeight: '610px',
            borderRadius: '1rem',
            background:
                props.colorMode === 'dark' ? 'dark.gray.quaternary' : 'white',
        },
        body: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 0,
            paddingInlineStart: [6, 8],
            paddingInlineEnd: [6, 8],
        },
        header: {
            paddingInlineStart: [6, 8],
            paddingInlineEnd: 8,
            paddingTop: [6, 8],
        },
        footer: {
            paddingBottom: [6, 10],
        },
    }),
};
