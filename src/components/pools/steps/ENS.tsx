// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    Heading,
    Box,
    VStack,
    useColorModeValue,
    Text,
    BoxProps,
    RadioGroup,
    Radio,
    Stack,
    Button,
    FormControlProps,
    Link,
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { ChangeEvent, ReactNode, useState } from 'react';
import { BaseInput } from '../../BaseInput';
import { useMessages } from '../../../utils/messages';
import { OrderedContent } from '../../OrderedContent';

interface SimpleInput {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    formControlProps?: FormControlProps;
}

const SimpleInput = ({
    onChange,
    label,
    isDisabled,
    isInvalid,
    id,
    inputRightElement,
    formControlProps,
}: SimpleInput) => {
    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            isInvalid={isInvalid}
            isDisabled={isDisabled}
            {...formControlProps}
        >
            <FormLabel htmlFor={id} fontWeight="medium">
                {label}
            </FormLabel>
            <InputGroup>
                <Input id={id} size="lg" onChange={onChange} />
                {inputRightElement && (
                    <InputRightElement
                        children={inputRightElement}
                        m={1}
                        mr={2}
                        color="gray"
                        fontSize={12}
                    />
                )}
            </InputGroup>
            <FormErrorMessage>{}</FormErrorMessage>
        </FormControl>
    );
};

const useStyle = () => {
    const tipsBgColor = useColorModeValue('gray.80', 'gray.800');
    return {
        tipsBgColor,
    };
};

type MessageProps = { content: string | ReactNode; boxProps?: BoxProps };
const Message = ({ content, boxProps }: MessageProps) => {
    const { tipsBgColor } = useStyle();

    return (
        <Box px={6} py={4} bgColor={tipsBgColor} {...boxProps}>
            {content}
        </Box>
    );
};

const ENSManagerLink = () => {
    const thirdPartyColor = useColorModeValue('blue.500', 'blue.200');
    return (
        <Link
            href="https://app.ens.domains/"
            target="_blank"
            color={thirdPartyColor}
            fontWeight="medium"
            textDecorationLine="underline"
            fontSize="md"
        >
            ENS Manager
        </Link>
    );
};

const Content = () => {
    const title = `Pool owners can name the pool addresses to provide additional trust or just make it
    easier to identify the pool.
    The system relies on authority information provided by ENS domains:`;

    const steps = [
        <>
            Open Ethereum-enabled browser and navigate to the <ENSManagerLink />
        </>,
        'Search for your desired .ETH name',
        'Finish registration of ENS domain',
    ];

    return (
        <OrderedContent
            title={title}
            orderedItems={steps}
            stackProps={{ py: 0, px: 0 }}
        />
    );
};

const { COMPLETED } = StepStatus;

const EthereumNameServer = ({
    stepNumber,
    inFocus,
    onComplete,
    onStepActive,
}: IStep) => {
    const [stepState, setStepState] = useStepState({ inFocus });
    const [ens, setENS] = useState<string | null>();

    return (
        <Step
            title="Pool ENS"
            subtitle="Registering a ENS domain and setting it up."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
        >
            <StepBody>
                <SimpleInput
                    onChange={(evt) => setENS(evt.currentTarget?.value)}
                    label="Pool ENS name"
                    id="poolENS"
                    formControlProps={{ my: 4 }}
                />
                <Message content={<Content />} />
            </StepBody>
            <StepActions>
                <Stack
                    direction={{ base: 'row' }}
                    justifyContent={{ base: 'flex-end', md: 'flex-start' }}
                >
                    <Button
                        colorScheme="blue"
                        minWidth={{ base: '10rem' }}
                        onClick={(evt) => {
                            onComplete();
                            setStepState(COMPLETED);
                        }}
                    >
                        COMPLETE
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default EthereumNameServer;
