import { BoxProps, Box, Separator } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

type SeparatorProps = {
    active: boolean;
    boxProps?: BoxProps;
};

const useStyle = () => {
    const borderColor = useColorModeValue('black', 'white');

    return {
        borderColor,
    };
};

export const HSeparator = (props: SeparatorProps) => {
    const { borderColor } = useStyle();
    const dividerProps = props.active ? { borderColor } : {};
    return (
        <Box
            m="0px !important"
            h={8}
            w={12}
            display="flex"
            alignItems="center"
            px={1}
            {...props.boxProps}
        >
            <Separator w="full" {...dividerProps} />
        </Box>
    );
};

export const VSeparator = (props: SeparatorProps) => {
    const { borderColor } = useStyle();
    const dividerProps = props.active ? { borderColor, h: 8 } : {};

    return (
        <Box
            px={{ base: 7, md: 16 }}
            m="0px !important"
            h={props.active ? 8 : '0.5rem'}
            {...props.boxProps}
        >
            <Separator orientation="vertical" h="3.5rem" {...dividerProps} />
        </Box>
    );
};
