import { defineRecipe } from '@chakra-ui/react';

export const headingRecipe = defineRecipe({
    base: {
        fontWeight: 'normal',
    },
    variants: {
        size: {
            xl: {
                fontSize: '4xl',
                lineHeight: 1.2,
            },
            lg: {
                fontSize: '3xl',
                lineHeight: 1.2,
            },
            md: {
                fontSize: 'xl',
                lineHeight: 1.2,
            },
        },
    },
});
