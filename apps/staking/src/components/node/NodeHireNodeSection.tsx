// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Button,
    Flex,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { isEmpty, omit } from 'lodash/fp';
import { FC, useState } from 'react';
import { useWallet } from '../../components/wallet';
import { useNode } from '../../services/node';
import { toBigNumber } from '../../utils/numberParser';
import { MappedErrors, ValidationResult } from '../BaseInput';
import { DepositField, InitialFundsInput } from './inputs/InitialFundsInput';
import { NodeField, NodeInput, evaluateNode } from './inputs/NodeInput';

type Validation = ValidationResult<NodeField | DepositField>;
type Errors = Partial<MappedErrors<Validation>>;

export interface NodeHireNodeSectionProps {
    isHiring?: boolean;
    onHire: (nodeAddress: string, funds: BigNumber) => void;
}

export const NodeHireNodeSection: FC<NodeHireNodeSectionProps> = (props) => {
    const { isHiring = false, onHire } = props;
    const { account } = useWallet();
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );
    const colorScheme = useColorModeValue('teal', 'cyan');
    const [initialFunds, setInitialFunds] = useState('');
    const [nodeAddress, setNodeAddress] = useState<string | null>();
    const [errors, setErrors] = useState<Errors>({});
    const node = useNode(nodeAddress);
    const { status } = evaluateNode(account, node);
    const isEnabled =
        status === 'available' && isEmpty(errors) && !isEmpty(initialFunds);

    const handleValidation = (validation: Validation) => {
        const { name, isValid } = validation;
        setErrors((state) => {
            return isValid
                ? omit([name], state)
                : { ...state, [name]: validation };
        });
    };

    return (
        <Box
            bg={bg}
            px={{ base: 2, lg: 4, xl: 8 }}
            py={{ base: 2, sm: 4, lg: 8 }}
            mb={6}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="1rem"
        >
            <Stack
                spacing={4}
                px={{ base: 4, md: 'auto' }}
                justifyContent="center"
                alignItems="center"
            >
                <Flex width={{ base: '100%', md: '550px' }}>
                    <NodeInput
                        onValidationChange={handleValidation}
                        onChange={setNodeAddress}
                        helperText={
                            errors.nodeAddress?.error
                                ? null
                                : 'Please, enter new node address'
                        }
                        account={account}
                        node={node}
                        styleProps={{
                            pr: 0,
                        }}
                    />
                </Flex>

                <Flex width={{ base: '100%', md: '550px' }}>
                    <InitialFundsInput
                        onValidationChange={handleValidation}
                        onChange={setInitialFunds}
                        max={3}
                        min={0.001}
                        styleProps={{
                            pr: 0,
                        }}
                    />
                </Flex>

                <Flex
                    width={{ base: '100%', md: '34.375rem' }}
                    direction="column"
                    alignItems="flex-end"
                >
                    <Button
                        colorScheme={colorScheme}
                        w={{ base: '100%', md: 'auto' }}
                        minW="10.813rem"
                        textTransform="uppercase"
                        disabled={!isEnabled}
                        isLoading={isHiring}
                        onClick={() =>
                            onHire(nodeAddress, toBigNumber(initialFunds))
                        }
                    >
                        Hire node
                    </Button>
                    <Text fontSize="sm" mt="0 !important">
                        Approve by wallet transaction
                    </Text>
                </Flex>
            </Stack>
        </Box>
    );
};
