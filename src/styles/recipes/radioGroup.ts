import { defineSlotRecipe } from '@chakra-ui/react';
import { radioGroupAnatomy } from '@chakra-ui/react/anatomy';

export const radioGroupRecipe = defineSlotRecipe({
    slots: radioGroupAnatomy.keys(),
    base: {
        label: {
            fontSize: '2rem',
        },
        itemText: {
            fontSize: 'md',
        },
    },
});
