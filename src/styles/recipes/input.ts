import { defineRecipe } from '@chakra-ui/react';

const borderRadius = '6px';

export const inputRecipe = defineRecipe({
    base: {
        borderRadius,
        _disabled: {
            bg: {
                base: 'dark.gray.senary',
                _dark: 'dark.border.secondary',
            },
        },
        _focus: {
            boxShadow: 'none',
        },
    },
    variants: {
        variant: {
            outline: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
            filled: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
            flushed: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
            unstyled: {
                borderRadius,
                _disabled: {
                    opacity: 1,
                },
            },
        },
    },
});
