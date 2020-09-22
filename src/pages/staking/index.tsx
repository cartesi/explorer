// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Breadcrumb, Typography, Input, Row, Col, Button, Space, Alert, Spin } from 'antd';
import Layout from '../../components/Layout';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import { BigNumber } from 'ethers';

const Staking = () => {
    const { account } = useWeb3React<Web3Provider>();

    const [approveAmount, setApproveAmount] = useState<BigNumber>(BigNumber.from(0));
    const [stakeAmount, setStakeAmount] = useState<BigNumber>(BigNumber.from(0));
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(BigNumber.from(0));
    const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(BigNumber.from(0));

    const [waiting, setWaiting] = useState<boolean>(false);

    // block number tracking
    const blockNumber = useBlockNumber();

    const [error, setError] = useState<string>(null);

    const {
        staking,
        submitting: stakingSubmitting,
        error: stakingError,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        stake,
        unstake,
        withdraw
    } = useStaking();

    const {
        submitting: tokenSubmitting,
        error: tokenError,
        balance,
        allowance,
        approve,
        formatCTSI,
        parseCTSI
    } = useCartesiToken(account, staking?.address, blockNumber);

    useEffect(() => {
        if (!stakingSubmitting) {
            setError(stakingError);
        }
        else if (!tokenSubmitting) {
            setError(tokenError);
        }
        else {
            setError(null);
        }
    }, [stakingSubmitting, tokenSubmitting]);

    const validate = (value: BigNumber): BigNumber => {
        if (!value || value.lt(0)) value = BigNumber.from(0);
        return value;
    }

    const doApprove = () => {
        setWaiting(true);
        approve(staking.address, parseCTSI(approveAmount))
            .then(() => {
                setApproveAmount(BigNumber.from(0));
                setWaiting(false);
            });
    }

    const doStake = () => {
        setWaiting(true);
        stake(parseCTSI(stakeAmount))
            .then(() => {
                setStakeAmount(BigNumber.from(0));
                setWaiting(false);
            })
    }

    const doWithdraw = () => {
        setWaiting(true);
        withdraw(parseCTSI(withdrawAmount))
            .then(() => {
                setWithdrawAmount(BigNumber.from(0));
                setWaiting(false);
            })
    }

    const doUnstake = () => {
        setWaiting(true);
        unstake(unstakeAmount)
            .then(() => {
                setWaiting(false);
            })
    }

    return (
        <Layout>
            <Head>
                <title>Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Staking</Breadcrumb.Item>
            </Breadcrumb>

            <Spin spinning={waiting}>
                <Space direction='vertical' size='large'>
                    <Typography.Title level={4}>Balance: {formatCTSI(balance)} CTSI</Typography.Title>
                    
                    <Typography.Title level={4}>Allowance Balance: {formatCTSI(allowance)} CTSI</Typography.Title>

                    <Typography.Title level={4}>Maturing Balance: {formatCTSI(maturingBalance)} CTSI</Typography.Title>

                    <Typography.Title level={4}>Releasing Balance: {formatCTSI(releasingBalance)} CTSI</Typography.Title>

                    <Space direction='vertical'>
                        <Row>
                            <Col>
                                <Input
                                    value={approveAmount.toString()}
                                    onChange={e => setApproveAmount(validate(BigNumber.from(e.target.value)))}
                                    suffix="CTSI"
                                    type="number"
                                />
                            </Col>
                            <Col>
                                <Button onClick={doApprove}>Approve</Button>
                            </Col>
                        </Row>
            
                        <Row>
                            <Col>
                                <Input
                                    value={stakeAmount.toString()}
                                    onChange={e => setStakeAmount(validate(BigNumber.from(e.target.value)))}
                                    suffix="CTSI"
                                    type="number"
                                />
                            </Col>
                            <Col>
                                <Button onClick={doStake} 
                                    disabled={!stakeAmount || stakeAmount.gt(allowance)}
                                >
                                    Stake
                                </Button>
                            </Col>
                        </Row>

                        {maturingBalance.gt(0) && <Typography.Text>Next finalize time: {maturingTimestamp?.toLocaleString()}</Typography.Text>}
            
                        <Row>
                            <Col>
                                <Input
                                    value={unstakeAmount.toString()}
                                    onChange={e => setUnstakeAmount(validate(BigNumber.from(e.target.value)))}
                                    suffix="CTSI"
                                    type="number"
                                />
                            </Col>
                            <Col>
                                <Button onClick={doUnstake} 
                                    disabled={!unstakeAmount}
                                >
                                    Unstake
                                </Button>
                            </Col>
                        </Row>

                        {maturingBalance.gt(0) && <Typography.Text>Next finalize time: {maturingTimestamp?.toLocaleString()}</Typography.Text>}
                        
                        <Row>
                            <Col>
                                <Input
                                    value={withdrawAmount.toString()}
                                    onChange={e => setWithdrawAmount(validate(BigNumber.from(e.target.value)))}
                                    suffix="CTSI"
                                    type="number"
                                />
                            </Col>
                            <Col>
                                <Button onClick={doWithdraw}
                                    disabled={!withdrawAmount || withdrawAmount.gt(stakedBalance)}
                                >
                                    Withdraw
                                </Button>
                            </Col>
                        </Row>

                        {releasingBalance.gt(0) && <Typography.Text>Next finalize time: {releasingTimestamp?.toLocaleString()}</Typography.Text>}
                    </Space>

                    {error &&
                        <Alert
                            message="Error occured!"
                            description={error}
                            type="error"
                            closable
                        />
                    }
                </Space>
            </Spin>
        </Layout>
    );
};

export default Staking;
