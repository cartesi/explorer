import React, {
    useState,
    Fragment,
    MouseEventHandler,
    FunctionComponent,
} from 'react';
import {
    VStack,
    Divider,
    Box,
    BoxProps,
    Heading,
    Text,
    Flex,
    useBreakpointValue,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import { range } from 'lodash/fp';
import { CheckIcon } from '@chakra-ui/icons';
import theme from '../styles/theme';

type SeparatorProps = {
    active: boolean;
    boxProps?: BoxProps;
};

type HeaderType = {
    currentStep: number;
    totalSteps: number;
    title: string;
    subtitle: string;
} & BoxProps;

interface StepGroupProps {
    mobileHeaderProps?: BoxProps;
    steps: FunctionComponent<IStep>[];
}

export interface IStepMeta {
    title: string;
    subtitle: string;
}

/**
 * API expected by the StepGroup for each Step component so the StepGroup knows
 * how to move around and present it's own header when rendering on small screens using expected data
 * from onStepActive callback. That is based in duck typing.
 */
export interface IStep {
    stepNumber: number;
    inFocus?: boolean;
    onComplete?: MouseEventHandler<HTMLButtonElement>;
    onPrevious?: MouseEventHandler<HTMLButtonElement>;
    onStepActive?: (stepInfo: IStepMeta) => void;
}

const HSeparator = (props: SeparatorProps) => {
    const dividerProps = props.active ? { borderColor: 'black' } : {};
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
            <Divider w="full" {...dividerProps} />
        </Box>
    );
};

const VSeparator = (props: SeparatorProps) => {
    const dividerProps = props.active
        ? { borderColor: 'black', h: 8 }
        : { marginTop: '-2rem' };

    return (
        <Box
            px={{ base: 7, md: 16 }}
            m="0px !important"
            h={props.active ? 6 : '0.5rem'}
            {...props.boxProps}
        >
            <Divider orientation="vertical" h="3.5rem" {...dividerProps} />
        </Box>
    );
};

const Header = ({
    currentStep,
    totalSteps,
    title,
    subtitle,
    ...boxProps
}: HeaderType) => {
    const bgColor = useColorModeValue('white', 'gray.700');
    const linkColor = useColorModeValue('gray', 'gray.100');
    return (
        <Box
            boxShadow="base"
            rounded="sm"
            bgColor={bgColor}
            position="sticky"
            zIndex={theme.zIndices.lg}
            top={0}
            px={{ base: 3, md: 12 }}
            py={4}
            pb={3}
            {...boxProps}
        >
            <Flex pl={1} direction="column">
                <Link
                    // TODO: Replace with new upcoming tutorial
                    href="https://medium.com/cartesi/running-a-node-and-staking-42523863970e"
                    target="_blank"
                    color={linkColor}
                    fontWeight="medium"
                    textDecorationLine="underline"
                    fontSize="sm"
                    alignSelf="flex-end"
                    pr={1}
                    pb={2}
                >
                    Learn from tutorial
                </Link>
                <Heading as="h3" size="md">
                    {title}
                </Heading>
                <Text fontSize="1rem">{subtitle}</Text>
            </Flex>

            <Flex justifyContent="space-between" mt={3}>
                {range(0, totalSteps).map((val) => {
                    const number = val + 1;
                    const isLast = number === totalSteps;
                    const isPast = number < currentStep;
                    const isAhead = number > currentStep;
                    const bgColor = isAhead ? 'gray' : 'blue.500';
                    const StepChecked = isPast ? <CheckIcon /> : null;

                    return (
                        <Fragment key={number}>
                            <Box
                                h={8}
                                minW={8}
                                rounded="full"
                                bgColor={bgColor}
                                display="grid"
                                placeContent="center"
                                color="white"
                                fontSize={14}
                            >
                                {StepChecked || number}
                            </Box>
                            {!isLast && (
                                <HSeparator active={currentStep >= number} />
                            )}
                        </Fragment>
                    );
                })}
            </Flex>
        </Box>
    );
};

export const StepGroup = ({ mobileHeaderProps, steps }: StepGroupProps) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [stepMeta, setStepMeta] = useState<IStepMeta>();
    const [currentStep, setCurrentStep] = useState(1);
    const onComplete = () => setCurrentStep(currentStep + 1);
    const onPrevious = () => setCurrentStep(currentStep - 1);
    const onStepActive = (data: IStepMeta) => setStepMeta(data);

    return (
        <VStack alignItems="stretch">
            {isSmallScreen && (
                <Header
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    title={stepMeta?.title}
                    subtitle={stepMeta?.subtitle}
                    display={{ md: 'none' }}
                    {...mobileHeaderProps}
                />
            )}
            {steps?.map((Step, i) => {
                const stepNumber = i + 1;
                const inFocus = currentStep === stepNumber;
                const isLast = steps.length === stepNumber;
                return (
                    <Fragment key={i}>
                        <Step
                            inFocus={inFocus}
                            stepNumber={stepNumber}
                            key={i}
                            onComplete={onComplete}
                            onPrevious={onPrevious}
                            onStepActive={onStepActive}
                        />
                        {!isSmallScreen && !isLast && (
                            <VSeparator active={currentStep >= stepNumber} />
                        )}
                    </Fragment>
                );
            })}
        </VStack>
    );
};
