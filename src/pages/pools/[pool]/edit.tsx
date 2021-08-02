// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import {
    useFlatRateCommission,
    useGasTaxCommission,
    useStakingPool,
} from '../../../services/pool';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';

import Layout from '../../../components/Layout';
import PoolNode from '../../../components/pools/PoolNode';
import { formatCTSI } from '../../../utils/token';
import {
    Center,
    HStack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import AddressText from '../../../components/AddressText';
import TransactionFeedback from '../../../components/TransactionFeedback';
import { FaUsers } from 'react-icons/fa';

const ManagePool = () => {
    const router = useRouter();
    const { pool } = router.query;

    const { account, chainId } = useWeb3React<Web3Provider>();

    const [poolName, setPoolName] = useState('');

    const {
        setName,
        pause,
        unpause,
        rebalance,
        paused,
        amounts,
        transaction: poolTransaction,
    } = useStakingPool(pool as string, account);

    const stakingPool = useStakingPoolQuery(pool as string);
    const [commission, setCommission] = useState(0);

    const { setRate, transaction: flatRateTransaction } = useFlatRateCommission(
        pool as string
    );

    const { setGas, transaction: gasTaxTransaction } = useGasTaxCommission(
        pool as string
    );

    const initialCommission =
        stakingPool?.fee?.commission / 100 || stakingPool?.fee?.gas;

    useEffect(() => {
        if (stakingPool?.fee) {
            setCommission(initialCommission);
        }
    }, [stakingPool?.fee]);

    const updateCommission = (newCommission: number) => {
        if (!stakingPool?.fee) return;
        if (initialCommission == newCommission) return;

        if (stakingPool?.fee?.commission) {
            setRate(Math.ceil(newCommission * 100));
        } else {
            setGas(Math.ceil(newCommission));
        }
    };

    // dark mode compatible background color
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Layout>
            <Head>
                <title>Cartesi - Edit Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                px="6vw"
                py={5}
                justify="space-between"
                align="flex-end"
                bg="black"
                opacity={0.87}
                color="white"
            >
                <AddressText
                    address={stakingPool?.id}
                    chainId={chainId}
                    icon={FaUsers}
                >
                    <Text>Staking Pool</Text>
                </AddressText>
            </HStack>

            <Center
                px="6vw"
                bgGradient={`linear(to-b, rgba(0,0,0,.87) 0%, rgba(0,0,0,.87) 50%, ${bgColor} 50%, ${bgColor} 100%)`}
            >
                <PoolNode poolAddress={pool as string} />
            </Center>
            <VStack px="6vw" py={10} spacing={5}>
                <TransactionFeedback transaction={poolTransaction} />
            </VStack>

            <div className="manage-pool">
                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Current Fee Model:
                    </span>
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        {!stakingPool?.fee
                            ? ''
                            : stakingPool.fee.commission
                            ? `${
                                  stakingPool?.fee?.commission / 100
                              }% Flat Rate Commission`
                            : `${stakingPool?.fee?.gas} Gas Tax Commission`}
                    </span>
                </div>

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Set Commission
                    </span>

                    <div className="input-group manage-pool-item-input">
                        <input
                            className="addon-inline form-control"
                            id="commission"
                            value={commission}
                            type="number"
                            onChange={(e) =>
                                setCommission(parseFloat(e.target.value))
                            }
                        />

                        <span
                            className={`input-group-addon addon-inline input-source-observer small-text`}
                        >
                            {stakingPool?.fee?.commission ? '%' : 'gas'}
                        </span>

                        {commission > initialCommission && (
                            <span className="manage-pool-item-input-error">
                                New commission must be smaller than the current
                                one
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => updateCommission(commission)}
                        disabled={
                            !stakingPool?.fee || commission > initialCommission
                        }
                    >
                        Set Commission
                    </button>
                </div>

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Pool Name
                    </span>

                    <input
                        className="addon-inline form-control manage-pool-item-input"
                        id="poolName"
                        value={poolName}
                        onChange={(e) => setPoolName(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => setName(poolName)}
                    >
                        Set Name
                    </button>
                </div>

                <div className="manage-pool-item form-group">
                    <span className="body-text-2 text-secondary manage-pool-item-label">
                        Pool is currently {paused ? 'paused' : 'unpaused'}
                    </span>

                    <button
                        type="button"
                        className="btn btn-dark py-0 mx-3 button-text"
                        onClick={() => (paused ? unpause() : pause())}
                    >
                        {paused ? 'Unpause' : 'Pause'}
                    </button>
                </div>
            </div>
            <div className="manage-pool-item form-group">
                <span className="body-text-2 text-secondary manage-pool-item-label">
                    Pool has {formatCTSI(amounts?.stake || 0)} CTSI to stake,{' '}
                    {formatCTSI(amounts?.unstake || 0)} CTSI to unstake and{' '}
                    {formatCTSI(amounts?.withdraw || 0)} CTSI to withdraw
                </span>

                <button
                    type="button"
                    className="btn btn-dark py-0 mx-3 button-text"
                    onClick={rebalance}
                >
                    Rebalance
                </button>
            </div>
        </Layout>
    );
};

export default ManagePool;
