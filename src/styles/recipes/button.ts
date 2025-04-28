import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
    base: {
        borderRadius: '1.875rem',
        fontWeight: '500',
        fontFamily: "'Plus Jakarta Sans'",
    },
    variants: {
        variant: {
            solid: {},
            outline: {},
            ghost: {},
            link: {},
        },
        size: {
            xl: {
                fontSize: 'lg',
            },
            lg: {
                fontSize: 'md',
            },
            md: {
                fontSize: 'sm',
            },
            sm: {
                fontSize: 'xs',
            },
        },
    },
    compoundVariants: [
        {
            variant: 'solid',
            colorPalette: 'cyan',
            css: {
                textTransform: 'uppercase',
                bg: {
                    base: 'cyan.primary',
                    _dark: 'dark.primary',
                },
                color: {
                    base: 'dark.gray.primary',
                    _dark: 'dark.gray.tertiary',
                },
                borderWidth: '1px',
                borderColor: 'white',
                _hover: {
                    bg: {
                        base: 'cyan.secondary',
                        _dark: 'dark.primary',
                    },
                },
                _active: {
                    bg: {
                        base: 'cyan.secondary',
                        _dark: 'dark.primary',
                    },
                },
                _disabled: {
                    color: {
                        base: 'dark.gray.primary',
                        _dark: 'dark.gray.senary',
                    },
                    bg: {
                        base: 'light.gray.quaternary',
                        _dark: 'dark.gray.quaternary',
                    },
                    borderColor: {
                        base: 'light.border.quaternary',
                        _dark: 'dark.border.quaternary',
                    },
                },
            },
        },

        {
            variant: 'solid',
            colorPalette: 'teal',
            css: {
                textTransform: 'uppercase',
                bg: {
                    base: 'dark.secondary',
                    _dark: 'dark.primary',
                },
                borderWidth: '1px',
                borderColor: {
                    base: 'dark.gray.tertiary',
                    _dark: 'white',
                },
                _hover: {
                    bg: {
                        base: 'dark.secondary',
                        _dark: 'dark.primary',
                    },
                },
                _active: {
                    bg: {
                        base: 'dark.secondary',
                        _dark: 'dark.primary',
                    },
                },
                _disabled: {
                    color: {
                        base: 'dark.gray.primary',
                        _dark: 'dark.gray.senary',
                    },
                    bg: {
                        base: 'light.gray.quaternary',
                        _dark: 'dark.gray.quaternary',
                    },
                    borderColor: {
                        base: 'light.border.quaternary',
                        _dark: 'dark.border.quaternary',
                    },
                },
            },
        },
    ],
});
