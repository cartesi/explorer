import { defineSlotRecipe } from '@chakra-ui/react';
import { dialogAnatomy } from '@chakra-ui/react/anatomy';

export const dialogRecipe = defineSlotRecipe({
    slots: dialogAnatomy.keys(),
    base: {
        content: {
            marginLeft: 3,
            marginRight: 3,
            minHeight: '610px',
            borderRadius: '1rem',
            bg: {
                base: 'white',
                _dark: 'dark.gray.quaternary',
            },
        },
        header: {
            paddingInlineStart: [6, 8],
            paddingInlineEnd: 8,
            paddingTop: [6, 8],
        },
        body: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 0,
            paddingInlineStart: [6, 8],
            paddingInlineEnd: [6, 8],
            fontSize: 'md',
        },
        footer: {
            paddingBottom: [6, 10],
        },
    },
});
