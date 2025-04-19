import { BoxProps, Box, Separator } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

interface SeparatorProps {
    active: boolean;
    boxProps?: BoxProps;
}

interface VerticalSeparatorProps extends SeparatorProps {
    currentStep: number;
    stepNumber: number;
}

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

export const VSeparator = (props: VerticalSeparatorProps) => {
    const { active, currentStep, stepNumber, boxProps } = props;
    const { borderColor } = useStyle();

    return (
        <Box
            px={{ base: 7, md: 16 }}
            m="0px !important"
            h={active ? 8 : '0.5rem'}
            {...boxProps}
        >
            <Separator
                orientation="vertical"
                height={active ? 8 : 16}
                borderColor={active ? borderColor : undefined}
                marginTop={stepNumber - 1 > currentStep ? '-2rem' : 0}
            />
        </Box>
    );
};
