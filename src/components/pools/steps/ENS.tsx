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
    FormErrorMessage,
    Box,
    useColorModeValue,
    BoxProps,
    Stack,
    Button,
    FormControlProps,
    Link,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    useBreakpointValue,
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useMessages } from '../../../utils/messages';
import { OrderedContent } from '../../OrderedContent';
import { useAtom } from 'jotai';
import { poolAddressAtom } from './CommissionModel';
import { useWallet } from '../../../contexts/wallet';
import { useStakingPool } from '../../../services/pool';
import TransactionBanner from '../../TransactionBanner';
import { isEmpty } from 'lodash';
import { trim } from 'lodash/fp';
import { useRouter } from 'next/router';
import { WalletDisconnectedNotification } from './WalletDisconnectedNotification';

interface SimpleInput {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    formControlProps?: FormControlProps;
    placeholder?: string;
}

const SimpleInput = ({
    onChange,
    label,
    isDisabled,
    isInvalid,
    id,
    inputRightElement,
    placeholder,
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
                <Input
                    id={id}
                    size="lg"
                    onChange={onChange}
                    placeholder={placeholder}
                />
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
    const title = useMessages('pool.ens.howItWorks');

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

const buildURL = (address: string) =>
    !isEmpty(address)
        ? `/pools/${address}/manage?from=node-runners`
        : '/node-runners';

const EthereumNameServer = ({
    stepNumber,
    inFocus,
    onComplete,
    onStepActive,
}: IStep) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const notificationRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [poolAddress] = useAtom(poolAddressAtom);
    const { account, active } = useWallet();
    const pool = useStakingPool(poolAddress, account);
    const [stepState, setStepState] = useStepState({ inFocus });
    const [proceed, setProceed] = useState<boolean>(false);
    const [ens, setENS] = useState<string | null>();
    const isCompleted = proceed || pool.transaction?.state === 'confirmed';
    const ensInputIsEmpty = isEmpty(trim(ens));

    useEffect(() => {
        if (isCompleted) {
            setStepState(COMPLETED);
            onComplete && onComplete();
            router.push(buildURL(poolAddress));
        }
    }, [isCompleted]);

    return (
        <Step
            title="Pool ENS"
            subtitle="Registering a ENS domain and setting it up."
            stepNumber={stepNumber}
            status={stepState.status}
            onActive={onStepActive}
            optionalText={useMessages('step.skippable')}
        >
            <StepBody>
                {!active && !ensInputIsEmpty && (
                    <WalletDisconnectedNotification ref={notificationRef} />
                )}
                <TransactionBanner
                    title={useMessages('pool.set.ens.update')}
                    failTitle={useMessages('pool.set.ens.fail')}
                    successDescription={useMessages('pool.set.ens.success')}
                    transaction={pool.transaction}
                />
                {isSmallScreen && (
                    <Text
                        color="light.support.alert"
                        fontWeight="medium"
                        fontSize={18}
                    >
                        {useMessages('step.skippable')}
                    </Text>
                )}
                <SimpleInput
                    onChange={(evt) => setENS(evt.currentTarget?.value)}
                    placeholder="name.eth"
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
                        isLoading={pool.transaction?.isOngoing}
                        disabled={pool.transaction?.isOngoing}
                        colorScheme="blue"
                        minWidth={{ base: '10rem' }}
                        onClick={() => {
                            if (ensInputIsEmpty) {
                                setProceed(true);
                            } else {
                                if (active) {
                                    pool.setName(ens);
                                } else {
                                    notificationRef.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                    });
                                }
                            }
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
