import { defineRecipe } from '@chakra-ui/react';

export const linkRecipe = defineRecipe({
    variants: {
        variant: {
            plain: {
                _hover: {
                    textDecoration: 'none',
                },
                _focus: {
                    outline: 'none',
                },
                _active: {
                    outline: 'none',
                },
            },
        },
    },
});
