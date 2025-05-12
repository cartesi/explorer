import { defineRecipe } from '@chakra-ui/react';

export const textRecipe = defineRecipe({
    base: {
        fontWeight: 'normal',
    },
    variants: {
        variant: {
            label: {
                fontSize: 'md',
                fontWeight: 'normal',
                lineHeight: '190%',
            },
        },
    },
});
