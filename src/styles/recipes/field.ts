import { defineSlotRecipe } from '@chakra-ui/react';
import { fieldAnatomy } from '@chakra-ui/react/anatomy';

export const fieldRecipe = defineSlotRecipe({
    slots: fieldAnatomy.keys(),
    base: {
        root: {
            _focus: {
                boxShadow: 'none',
            },
        },
    },
});
