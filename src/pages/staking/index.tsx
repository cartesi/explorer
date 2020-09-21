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

type WaitingStatus = {
    approve?: boolean;
    deposit?: boolean;
    finalizeDeposit?: boolean;
    withdraw?: boolean;
    finalizeWithdraw?: boolean;
}

const Staking = () => {
    const { account } = useWeb3React<Web3Provider>();
    const [depositAmount, setDepositAmount] = useState<BigNumber>(BigNumber.from(0));
    const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(BigNumber.from(0));
    const [approveAmount, setApproveAmount] = useState<BigNumber>(BigNumber.from(0));

    const [waiting, setWaiting] = useState<WaitingStatus>({
        approve: false,
        deposit: false,
        finalizeDeposit: false,
        withdraw: false,
        finalizeWithdraw: false
    });

    // block number tracking
    const blockNumber = useBlockNumber();

    const [error, setError] = useState<string>(null);

    const {
        staking,
        submitting: stakingSubmitting,
        error: stakingError,
        stakedBalance,
        finalizeDepositTimestamp,
        finalizeWithdrawTimestamp,
        unfinalizedDepositAmount,
        unfinalizedWithdrawAmount,
        depositStake,
        finalizeStakes,
        startWithdraw,
        finalizeWithdraws
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
        setWaiting({
            ...waiting,
            approve: true
        });
        approve(staking.address, parseCTSI(approveAmount))
            .then(() => {
                setApproveAmount(BigNumber.from(0));
                setWaiting({
                    ...waiting,
                    approve: false
                });
            });
    }

    const doDeposit = () => {
        setWaiting({
            ...waiting,
            deposit: true
        });
        depositStake(parseCTSI(depositAmount))
            .then(() => {
                setDepositAmount(BigNumber.from(0));
                setWaiting({
                    ...waiting,
                    deposit: false
                });
            })
    }

    const doWithdraw = () => {
        setWaiting({
            ...waiting,
            withdraw: true
        });
        startWithdraw(parseCTSI(withdrawAmount))
            .then(() => {
                setWithdrawAmount(BigNumber.from(0));
                setWaiting({
                    ...waiting,
                    withdraw: false
                });
            })
    }

    const doFinalizeStakes = () => {
        setWaiting({
            ...waiting,
            finalizeDeposit: true
        });
        finalizeStakes()
            .then(() => {
                setWaiting({
                    ...waiting,
                    finalizeDeposit: false
                });
            })
    }

    const doFinalizeWithdraw = () => {
        setWaiting({
            ...waiting,
            finalizeWithdraw: true
        });
        finalizeWithdraws()
            .then(() => {
                setWaiting({
                    ...waiting,
                    finalizeWithdraw: false
                });
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

            <Space direction='vertical' size='large'>
                <Typography.Title level={4}>Balance: {formatCTSI(balance)} CTSI</Typography.Title>

                <Space direction='vertical'>
                    <Typography.Title level={4}>Allowance Balance: {formatCTSI(allowance)} CTSI</Typography.Title>

                    <div>
                        <Typography.Title level={4}>Set Allowance: </Typography.Title>
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
                                <Spin spinning={waiting.approve}>
                                    <Button onClick={doApprove}>Approve</Button>
                                </Spin>
                            </Col>
                        </Row>
                    </div>
                </Space>

                <Space direction='vertical'>
                    <Typography.Title level={4}>Staked Balance: {formatCTSI(stakedBalance)} CTSI</Typography.Title>
                    
                    <Space direction='vertical' size='large'>
                        <div>
                            <Typography.Title level={4}>Stake: </Typography.Title>
                            <Space direction='vertical'>
                                <Row>
                                    <Col>
                                        <Input
                                            value={depositAmount.toString()}
                                            onChange={e => setDepositAmount(validate(BigNumber.from(e.target.value)))}
                                            suffix="CTSI"
                                            type="number"
                                        />
                                    </Col>
                                    <Col>
                                        <Spin spinning={waiting.deposit}>
                                            <Button onClick={doDeposit} 
                                                disabled={!depositAmount || depositAmount.gt(allowance)}
                                            >
                                                Deposit Stake
                                            </Button>
                                        </Spin>
                                    </Col>
                                </Row>

                                <Row align='middle'>
                                    <Col>
                                        <Typography.Text>Amount to finalize deposit: {formatCTSI(unfinalizedDepositAmount)} CTSI &nbsp;</Typography.Text>
                                    </Col>
                                    <Col>
                                        {unfinalizedDepositAmount.gt(0) && finalizeDepositTimestamp <= new Date() &&
                                            <Spin spinning={waiting.finalizeDeposit}>
                                                <Button onClick={doFinalizeStakes}>Finalize Stakes</Button>
                                        </Spin>
                                        }
                                    </Col>
                                </Row>
                                {unfinalizedDepositAmount.gt(0) && <Typography.Text>Next finalize time: {finalizeDepositTimestamp?.toLocaleString()}</Typography.Text>}
                            </Space>
                        </div>

                        <div>
                            <Typography.Title level={4}>Withdraw: </Typography.Title>
                            <Space direction='vertical'>
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
                                        <Spin spinning={waiting.withdraw}>
                                            <Button onClick={doWithdraw}
                                                disabled={!withdrawAmount || withdrawAmount.gt(stakedBalance)}
                                            >
                                                Start Withdraw
                                            </Button>
                                        </Spin>
                                    </Col>
                                </Row>

                                <Row align='middle'>
                                    <Col>
                                        <Typography.Text>Amount to finalize withdraw: {formatCTSI(unfinalizedWithdrawAmount)} CTSI &nbsp;</Typography.Text>
                                    </Col>
                                    <Col>
                                        {unfinalizedWithdrawAmount.gt(0) && finalizeWithdrawTimestamp <= new Date() &&
                                            <Spin spinning={waiting.finalizeWithdraw}>
                                            <Button onClick={doFinalizeWithdraw}>Finalize Withdraw</Button>
                                        </Spin>
                                        }
                                    </Col>
                                </Row>
                                {unfinalizedWithdrawAmount.gt(0) && <Typography.Text>Next finalize time: {finalizeWithdrawTimestamp?.toLocaleString()}</Typography.Text>}
                            </Space>
                        </div>
                    </Space>
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
        </Layout>
    );
};

export default Staking;
