import { defineSlotRecipe } from '@chakra-ui/react';
import { alertAnatomy } from '@chakra-ui/react/anatomy';

export const alertRecipe = defineSlotRecipe({
    slots: alertAnatomy.keys(),
    base: {
        title: {
            fontSize: 'md',
            fontWeight: 'bold',
            color: {
                base: 'gray.900',
                _dark: 'white',
            },
        },
        description: {
            color: {
                base: 'gray.900',
                _dark: 'white',
            },
        },
    },
});
