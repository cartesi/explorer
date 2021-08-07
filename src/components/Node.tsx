// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import { Box, BoxProps, Button, Text, Flex } from '@chakra-ui/react';
import { formatEther, parseEther } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants } from 'ethers';
import { truncateString } from '../utils/stringUtils';
import { useUserNodes } from '../graphql/hooks/useNodes';
import { useNode } from '../services/node';
import theme from '../styles/theme';

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

    return (
        <Box
            {...restProps}
            position="relative"
            justify="center"
            minHeight={90}
            marginLeft="6vw"
            marginRight="6vw"
            bg="white"
            zIndex={theme.zIndices.sm}
        >
            <Flex
                position="relative"
                direction={['column', 'column', 'row', 'row']}
                align="center"
                p="25px 6vw 25px 6vw"
                boxShadow={theme.boxShadows.md}
                zIndex={theme.zIndices.sm}
            >
                <Text mx={2}>Node</Text>

                <Button
                    color={
                        activeAddress !== ''
                            ? theme.colors.primary
                            : theme.colors.gray2
                    }
                    bg="transparent"
                    fontSize={32}
                    fontWeight={300}
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
                        abcd{' '}
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
                    boxShadow={theme.boxShadows.md}
                >
                    <div className="staking-hire-node-content">
                        <div className="form-group">
                            <label className="body-text-2 text-secondary">
                                Node Address
                            </label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control :invalid"
                                    id="address"
                                    disabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    value={activeAddress}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                />
                            </div>
                            <div className="invalid-feedback">
                                Invalid address.
                            </div>
                        </div>

                        {node.address && node.available && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Deposit
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="deposit"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        defaultValue={formatEther(deposit)}
                                        onBlur={(e) => {
                                            const value = parseEther(
                                                e.target.value
                                            );
                                            setDeposit(value);
                                            e.target.value = formatEther(value);
                                        }}
                                    />
                                    <span className="input-group-addon addon-inline input-source-observer small-text">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        )}

                        {node.address &&
                            debug &&
                            node.user != constants.AddressZero && (
                                <div className="form-group">
                                    <label className="body-text-2 text-secondary">
                                        Owner
                                    </label>
                                    <div className="sub-title-1">
                                        {node.user}
                                    </div>
                                </div>
                            )}

                        {node.address && debug && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Status
                                </label>
                                <div className="sub-title-1">{status}</div>
                            </div>
                        )}

                        {ready && (
                            <div className="form-group">
                                <label className="body-text-2 text-secondary">
                                    Add Funds
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="addon-inline form-control"
                                        id="transfer"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        defaultValue={formatEther(transfer)}
                                        onBlur={(e) => {
                                            const value = parseEther(
                                                e.target.value
                                            );
                                            setTransfer(value);
                                            e.target.value = formatEther(value);
                                        }}
                                    />
                                    <span className="input-group-addon addon-inline input-source-observer small-text">
                                        ETH
                                    </span>
                                </div>
                            </div>
                        )}

                        {node.address && node.available && (
                            <div>
                                <div className="staking-hire-node-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                        onClick={() => node.hire(deposit)}
                                    >
                                        Hire Node
                                    </button>
                                </div>
                            </div>
                        )}

                        {mine && node.pending && (
                            <div className="staking-hire-node-buttons">
                                <button
                                    type="button"
                                    disabled={
                                        node.transaction.submitting ||
                                        node.loading
                                    }
                                    className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                    onClick={() => node.cancelHire()}
                                >
                                    Cancel Hire
                                </button>
                            </div>
                        )}

                        {ready && (
                            <>
                                <div className="staking-hire-node-buttons">
                                    <button
                                        type="button"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        className="btn btn-link px-0 py-0 m-2 button-text flex-fill text-left"
                                        onClick={confirmRetirement}
                                    >
                                        Retire
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        className="btn btn-outline-dark py-0 px-3 button-text flex-fill m-2"
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            node.transaction.submitting ||
                                            node.loading
                                        }
                                        className="btn btn-primary py-0 px-3 button-text flex-fill m-2"
                                        onClick={() => node.transfer(transfer)}
                                    >
                                        Add Funds
                                    </button>
                                </div>
                            </>
                        )}

                        {node.owned && !node.authorized && mine && (
                            <button
                                type="button"
                                disabled={
                                    node.transaction.submitting || node.loading
                                }
                                className="btn btn-primary py-0 px-3 button-text flex-fill my-2"
                                onClick={node.authorize}
                            >
                                Authorize
                            </button>
                        )}
                    </div>
                </Flex>
            )}
        </Box>
    );
};

export default Node;
