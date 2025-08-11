import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
    base: {
        borderRadius: '1.875rem',
        fontWeight: '500',
        fontFamily: "'Plus Jakarta Sans'",
    },
    defaultVariants: {
        size: 'lg',
    },
    variants: {
        variant: {
            solid: {
                height: 12,
                textTransform: 'uppercase',
            },
            outline: {
                height: 12,
            },
            ghost: {
                height: 12,
                textTransform: 'uppercase',
            },
            link: {
                textTransform: 'uppercase',
                height: 'auto',
                color: {
                    base: 'dark.gray.tertiary',
                    _dark: 'dark.primary',
                },
                _hover: {
                    textDecoration: 'underline',
                },
            },
            text: {},
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
            variant: 'outline',
            colorPalette: 'gray',
            css: {
                borderColor: {
                    base: 'black',
                    _dark: 'white',
                },
                _hover: {
                    bg: {
                        base: 'gray.50',
                        _dark: 'rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
        {
            variant: 'solid',
            colorPalette: 'gray',
            css: {
                color: 'white',
                bg: {
                    base: 'gray.900',
                    _dark: 'gray.600',
                },
                borderWidth: '1px',
                borderColor: {
                    base: 'gray.80',
                    _dark: 'white',
                },
                _hover: {
                    bg: {
                        base: 'red.100',
                        _dark: 'gray.500',
                    },
                    color: 'white',
                },
                _active: {
                    bg: {
                        base: 'gray.800',
                        _dark: 'gray.600',
                    },
                    color: 'white',
                },
                _disabled: {
                    color: {
                        base: 'gray.500',
                        _dark: 'gray.200',
                    },
                    bg: {
                        base: 'gray.200',
                        _dark: 'gray.600',
                    },
                },
            },
        },
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
                        base: 'dark.gray.secondary',
                        _dark: 'dark.border.quaternary',
                    },
                },
            },
        },
        {
            variant: 'solid',
            colorPalette: 'blue',
            css: {
                textTransform: 'uppercase',
                color: 'gray.900',
                bg: {
                    base: 'blue.200',
                    _dark: 'dark.primary',
                },
                borderWidth: '1px',
                borderColor: {
                    base: 'gray.80',
                    _dark: 'white',
                },
                _hover: {
                    bg: {
                        base: 'blue.100',
                        _dark: 'dark.primary',
                    },
                    color: {
                        base: 'gray.900',
                        _dark: 'dark.gray.tertiary',
                    },
                },
                _active: {
                    bg: {
                        base: 'blue.100',
                        _dark: 'dark.primary',
                    },
                    color: {
                        base: 'gray.900',
                        _dark: 'dark.gray.tertiary',
                    },
                },
                _disabled: {
                    color: {
                        base: 'gray.900',
                        _dark: 'dark.gray.senary',
                    },
                    bg: {
                        base: 'blue.200',
                        _dark: 'dark.gray.quaternary',
                    },
                    borderColor: {
                        base: 'gray.80',
                        _dark: 'dark.border.quaternary',
                    },
                },
            },
        },
        {
            variant: 'ghost',
            colorPalette: 'gray',
            css: {
                textTransform: 'uppercase',
                color: {
                    base: 'dark.gray.primary',
                    _dark: 'dark.gray.senary',
                },
                bg: 'transparent',
                borderWidth: '1px',
                borderColor: {
                    base: 'dark.gray.tertiary',
                    _dark: 'white',
                },
                _hover: {
                    bg: {
                        base: 'dark.gray.senary',
                        _dark: 'dark.border.quaternary',
                    },
                },
                _active: {
                    bg: {
                        base: 'dark.gray.senary',
                        _dark: 'dark.border.quaternary',
                    },
                },
                _disabled: {
                    color: {
                        base: 'dark.gray.secondary',
                        _dark: 'dark.gray.senary',
                    },
                    bg: {
                        base: 'light.gray.quaternary',
                        _dark: 'dark.border.quaternary',
                    },
                    borderColor: {
                        base: 'dark.gray.secondary',
                        _dark: 'dark.support.disabled',
                    },
                },
            },
        },
    ],
});
