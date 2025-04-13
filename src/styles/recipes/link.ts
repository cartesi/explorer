import { defineRecipe } from '@chakra-ui/react';

export const linkRecipe = defineRecipe({
    variants: {
        variant: {
            plain: {
                _hover: {
                    textDecoration: 'none',
                },
            },
        },
    },
});
