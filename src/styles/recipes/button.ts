import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
    variants: {
        size: {
            xl: {
                fontSize: 'lg',
                px: 6,
                py: 3,
            },
        },
    },
});
