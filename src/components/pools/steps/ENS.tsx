// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    BoxProps,
    Button,
    Field,
    FieldRootProps,
    Input,
    InputGroup,
    Link,
    Stack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { isEmpty } from 'lodash';
import { isFunction, trim } from 'lodash/fp';
import { useRouter } from 'next/navigation';
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useStakingPool } from '../../../services/pool';
import { useMessages } from '../../../utils/messages';
import { OrderedContent } from '../../OrderedContent';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { IStep, useStepState } from '../../StepGroup';
import TransactionBanner from '../../TransactionBanner';
import { useWallet } from '../../wallet';
import { poolAddressAtom } from './CommissionModel';
import { WalletDisconnectedNotification } from './WalletDisconnectedNotification';
import { useColorModeValue } from '../../ui/color-mode';

interface SimpleInput {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    formControlProps?: FieldRootProps;
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
        <Field.Root
            pr={{ base: 0, md: '20vw' }}
            invalid={isInvalid}
            disabled={isDisabled}
            {...formControlProps}
        >
            <Field.Label htmlFor={id} fontWeight="medium">
                {label}
            </Field.Label>
            <InputGroup
                endElement={
                    <Box color="gray" fontSize={12}>
                        {inputRightElement}
                    </Box>
                }
            >
                <Input
                    id={id}
                    size="lg"
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </InputGroup>
        </Field.Root>
    );
};

const useStyle = () => {
    const tipsBgColor = useColorModeValue('white', 'dark.gray.tertiary');
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
    const thirdPartyColor = useColorModeValue('dark.secondary', 'dark.primary');
    return (
        <Link
            href="https://app.ens.domains/"
            target="_blank"
            color={thirdPartyColor}
            _hover={{
                color: thirdPartyColor,
                textDecoration: 'underline',
            }}
            fontWeight="medium"
            textDecorationLine="none"
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

const EthereumNameServer = ({
    stepNumber,
    currentStep,
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
    const buttonColorScheme = useColorModeValue('teal', 'cyan');
    const bg = useColorModeValue('white', 'dark.background.secondary');
    const isHighlighted =
        stepNumber - 1 === currentStep || stepNumber <= currentStep;
    const warningIconColor = useColorModeValue(
        'light.support.warning',
        'dark.support.warning'
    );

    useEffect(() => {
        if (isCompleted) {
            setStepState(COMPLETED);
            isFunction(onComplete) && onComplete();
            router.push(
                isEmpty(poolAddress)
                    ? '/node-runners'
                    : `/pools/${poolAddress}/manage?from=node-runners`
            );
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
            bg={isHighlighted ? bg : undefined}
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
                        color={warningIconColor}
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
                        loading={pool.transaction?.isOngoing}
                        disabled={pool.transaction?.isOngoing}
                        colorPalette={buttonColorScheme}
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
