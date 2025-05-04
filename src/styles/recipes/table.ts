import { defineSlotRecipe } from '@chakra-ui/react';
import { tableAnatomy } from '@chakra-ui/react/anatomy';

export const tableRecipe = defineSlotRecipe({
    slots: tableAnatomy.keys(),
    base: {
        cell: {
            fontSize: 'md',
        },
    },
    variants: {
        variant: {
            clear: {
                root: {},
            },
            unstyled: {
                root: {},
            },
        },
    },
});
