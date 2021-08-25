// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    BoxProps,
    Button,
    ButtonGroup,
    Text,
    Flex,
    FormLabel,
    InputGroup,
    Input,
    FormErrorMessage,
    FormControl,
    InputRightAddon,
    useColorModeValue,
} from '@chakra-ui/react';
import { formatEther, parseEther } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import { truncateString } from '../../utils/stringUtils';
import { useUserNodes } from '../../graphql/hooks/useNodes';
import { useNode } from '../../services/node';
import theme from '../../styles/theme';

interface NodeProps extends BoxProps {
    setWaiting?: (waiting: boolean) => void;
    setError?: (error: string) => void;
}

const Node: FC<NodeProps> = (props) => {
    const { setWaiting, setError, ...restProps } = props;
    const { account, chainId } = useWeb3React<Web3Provider>();
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [deposit, setDeposit] = useState<BigNumber>(parseEther('0.1'));
    const [transfer, setTransfer] = useState<BigNumber>(constants.Zero);

    // get nodes hired by user from backend (if any)
    const userNodes = useUserNodes(account);
    const existingNode =
        userNodes.data?.nodes?.length > 0 && userNodes.data.nodes[0].id;

    // use a state variable for the typed node address
    const [address, setAddress] = useState<string>('');

    // priority is the typed address (at state variable)
    const activeAddress = address || existingNode || '';

    const node = useNode(activeAddress);

    const notMine =
        !node.loading &&
        node.address &&
        !node.available &&
        node.user != account;
    const mine = node.user == account;
    const ready = node.user == account && node.owned && node.authorized;
    const isValidAddress = address === '' || node.address;
    const debug = chainId == 313371;

    let status = '';

    if (node.available) {
        status = 'Available';
    } else if (node.owned && node.authorized && node.user == account) {
        status = 'Ready';
    } else if (node.owned && node.authorized) {
        status = `Owned by ${node.user}`;
    } else if (node.owned && !node.authorized) {
        status = `Owned by ${node.user}, pending authorization`;
    } else if (node.pending) {
        status = `Hired by ${node.user}, pending confirmation`;
    } else if (node.retired) {
        status = 'Retired';
    }

    const confirmRetirement = () => {
        node.retire();
    };

    useEffect(() => {
        if (userNodes?.data?.nodes?.length > 0) {
            setAddress(userNodes.data.nodes[0].id);
        }
    }, [account]);

    useEffect(() => {
        if (setWaiting) {
            setWaiting(node.transaction.submitting);
        }

        if (setError) {
            setError(node.transaction.error);
        }
    }, [node.transaction.error, node.transaction.submitting]);

    // dark mode support
    const bg = useColorModeValue('white', 'gray.700');

    return (
        <Box
            {...restProps}
            position="relative"
            justify="center"
            minHeight={90}
            marginLeft="6vw"
            marginRight="6vw"
            bg={bg}
            zIndex={theme.zIndices.sm}
        >
            <Flex
                position="relative"
                direction={['column', 'column', 'row', 'row']}
                align="center"
                p="25px 6vw 25px 6vw"
                boxShadow="md"
                zIndex={theme.zIndices.sm}
            >
                <Text mx={2}>Node</Text>

                <Button
                    color={
                        activeAddress !== ''
                            ? theme.colors.primary
                            : theme.colors.gray3
                    }
                    height="auto"
                    bg="transparent"
                    fontSize={32}
                    fontWeight={300}
                    whiteSpace="normal"
                    _hover={{
                        bg: 'transparent',
                    }}
                    _active={{
                        bg: 'transparent',
                    }}
                    onClick={() => setShowDetails(!!account && !showDetails)}
                >
                    {activeAddress
                        ? truncateString(activeAddress)
                        : account
                        ? 'Click to enter your node address'
                        : 'Connect to wallet first'}
                </Button>

                {notMine && (
                    <Text color="red.300">node owned by other account</Text>
                )}

                {node.balance && (
                    <Text mx={2}>
                        {formatEther(node.balance)}{' '}
                        <Text fontSize="sm" display="inline">
                            ETH
                        </Text>
                    </Text>
                )}
            </Flex>

            {showDetails && (
                <Flex
                    justify="center"
                    align="center"
                    bg="white"
                    padding={25}
                    boxShadow="md"
                >
                    <Box>
                        <FormControl isInvalid={!isValidAddress}>
                            <FormLabel>Node Address</FormLabel>

                            <InputGroup>
                                <Input
                                    id="address"
                                    min={0}
                                    width={520}
                                    maxWidth="100%"
                                    isInvalid={!isValidAddress}
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                    }}
                                />
                            </InputGroup>
                            <FormErrorMessage>
                                {!isValidAddress && (
                                    <Text>Invalid address</Text>
                                )}
                            </FormErrorMessage>
                        </FormControl>

                        {node.address && node.available && (
                            <FormControl mt={4}>
                                <FormLabel>Deposit</FormLabel>

                                <InputGroup>
                                    <Input
                                        type="number"
                                        min={0}
                                        isDisabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        value={formatEther(deposit)}
                                        onBlur={(e) => {
                                            setDeposit(
                                                parseEther(e.target.value)
                                            );
                                        }}
                                    />
                                    <InputRightAddon children="ETH" />
                                </InputGroup>
                            </FormControl>
                        )}

                        {node.address &&
                            debug &&
                            node.user != constants.AddressZero && (
                                <Box>
                                    <Text>
                                        Owner: {node.user ? node.user : 'N/A'}
                                    </Text>
                                </Box>
                            )}

                        {node.address && debug && (
                            <Box>
                                <Text>Status: {status ? status : 'N/A'}</Text>
                            </Box>
                        )}

                        {ready && (
                            <FormControl mt={4}>
                                <FormLabel>Add Funds</FormLabel>

                                <InputGroup>
                                    <Input
                                        type="number"
                                        min={0}
                                        isDisabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        value={formatEther(transfer)}
                                        onBlur={(e) => {
                                            setTransfer(
                                                parseEther(e.target.value)
                                            );
                                        }}
                                    />
                                    <InputRightAddon children="ETH" />
                                </InputGroup>
                            </FormControl>
                        )}

                        {node.address && node.available && (
                            <ButtonGroup width="100%">
                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={() => node.hire(deposit)}
                                >
                                    Hire Node
                                </Button>
                            </ButtonGroup>
                        )}

                        {mine && node.pending && (
                            <ButtonGroup>
                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={() => node.cancelHire()}
                                >
                                    Cancel Hire
                                </Button>
                            </ButtonGroup>
                        )}

                        {ready && (
                            <ButtonGroup width="100%">
                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={confirmRetirement}
                                >
                                    Retire
                                </Button>

                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={() => setShowDetails(!showDetails)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    size="sm"
                                    mt={2}
                                    px={3}
                                    borderRadius={2}
                                    color="white"
                                    bg={
                                        node.transaction.submitting ||
                                        node.loading
                                            ? theme.colors.gray9
                                            : theme.colors.secondary
                                    }
                                    _hover={{
                                        filter: 'opacity(90%)',
                                    }}
                                    isFullWidth
                                    isDisabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    onClick={() => node.transfer(transfer)}
                                >
                                    Add Funds
                                </Button>
                            </ButtonGroup>
                        )}

                        {node.owned && !node.authorized && mine && (
                            <Button
                                size="sm"
                                mt={2}
                                px={3}
                                borderRadius={2}
                                color="white"
                                bg={
                                    node.transaction.submitting || node.loading
                                        ? theme.colors.gray9
                                        : theme.colors.secondary
                                }
                                _hover={{
                                    filter: 'opacity(90%)',
                                }}
                                isFullWidth
                                isDisabled={
                                    node.transaction.submitting || node.loading
                                }
                                onClick={node.authorize}
                            >
                                Authorize
                            </Button>
                        )}
                    </Box>
                </Flex>
            )}
        </Box>
    );
};

export default Node;
