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
import { Breadcrumb, Typography, Input, Row, Col, Button, Space, Alert } from 'antd';
import Layout from '../../components/Layout';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';

const Staking = () => {
    const [address, setAddress] = useState<string>(null);
    const [balance, setBalance] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [approveAmount, setApproveAmount] = useState<number>(0);
    const [allowanceBalance, setAllowanceBalance] = useState<number>(0);

    const [error, setError] = useState<string>(null);

    const {
        staking,
        address: stakingAddress,
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
        cartesiToken,
        submitting: tokenSubmitting,
        error: tokenError,
        balanceOf,
        allowance,
        approve
    } = useCartesiToken();

    const getInformation = (account = null) => {
        if(account) setAddress(account);
        else account = address;
        
        allowance(account, stakingAddress).then(val => setAllowanceBalance(val));
        balanceOf(account).then(val => setBalance(val));
    };

    useEffect(() => {
        if(staking && cartesiToken) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(accounts => getInformation(accounts[0]));
        }
    }, [staking, cartesiToken]);

    useEffect(() => {
        if(!stakingSubmitting) {
            setError(stakingError);
        }
        else if(!tokenSubmitting) {
            setError(tokenError);
        }
        else {
            setError(null);
        }
    }, [stakingSubmitting, tokenSubmitting]);

    const validate = value => {
        if(!value || value < 0) value = 0;
        return value;
    }

    const doApprove = () => {
        approve(stakingAddress, approveAmount)
            .then(() => {
                getInformation();
                setApproveAmount(0);
            });
    }

    const doDeposit = () => {
        depositStake(depositAmount)
            .then(() => {
                getInformation();
                setDepositAmount(0);
            })
    }

    const doWithdraw = () => {
        startWithdraw(withdrawAmount)
            .then(() => {
                getInformation();
                setWithdrawAmount(0);
            })
    }

    const doFinalizeStakes = () => {
        finalizeStakes()
            .then(() => {
                getInformation();
            })
    }

    const doFinalizeWithdraw = () => {
        finalizeWithdraws()
            .then(() => {
                getInformation();
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
                <Typography.Title level={4}>Balance: {balance} CTSI</Typography.Title>

                <Space direction='vertical'>
                    <Typography.Title level={4}>Allowance Balance: {allowanceBalance} CTSI</Typography.Title>

                    <div>
                        <Typography.Title level={4}>Set Allowance: </Typography.Title>
                        <Row>
                            <Col>
                                <Input
                                    value={approveAmount}
                                    onChange={e => setApproveAmount(validate(e.target.valueAsNumber))}
                                    suffix="CTSI"
                                    type="number"
                                />
                            </Col>
                            <Col>
                                <Button onClick={doApprove}>Approve</Button>
                            </Col>
                        </Row>
                    </div>
                </Space>

                <Space direction='vertical'>
                    <Typography.Title level={4}>Staked Balance: {stakedBalance} CTSI</Typography.Title>
                    
                    <Space direction='vertical' size='large'>
                        <div>
                            <Typography.Title level={4}>Stake: </Typography.Title>
                            <Space direction='vertical'>
                                <Row>
                                    <Col>
                                        <Input
                                            value={depositAmount}
                                            onChange={e => setDepositAmount(validate(e.target.valueAsNumber))}
                                            suffix="CTSI"
                                            type="number"
                                        />
                                    </Col>
                                    <Col>
                                        <Button onClick={doDeposit} 
                                            disabled={!depositAmount || depositAmount > allowanceBalance}
                                        >
                                            Deposit Stake
                                        </Button>
                                    </Col>
                                </Row>

                                <Row align='middle'>
                                    <Col>
                                        <Typography.Text>Amount to finalize deposit: {unfinalizedDepositAmount} CTSI &nbsp;</Typography.Text>
                                    </Col>
                                    <Col>
                                        {unfinalizedDepositAmount > 0 && finalizeDepositTimestamp <= new Date() &&
                                            <Button onClick={doFinalizeStakes}>Finalize Stakes</Button>
                                        }
                                    </Col>
                                </Row>
                                {unfinalizedDepositAmount > 0 && <Typography.Text>Next finalize time: {finalizeDepositTimestamp?.toLocaleString()}</Typography.Text>}
                            </Space>
                        </div>

                        <div>
                            <Typography.Title level={4}>Withdraw: </Typography.Title>
                            <Space direction='vertical'>
                                <Row>
                                    <Col>
                                        <Input
                                            value={withdrawAmount}
                                            onChange={e => setWithdrawAmount(validate(e.target.valueAsNumber))}
                                            suffix="CTSI"
                                            type="number"
                                        />
                                    </Col>
                                    <Col>
                                        <Button onClick={doWithdraw}
                                            disabled={!withdrawAmount || withdrawAmount > stakedBalance}
                                        >
                                            Start Withdraw
                                        </Button>
                                    </Col>
                                </Row>

                                <Row align='middle'>
                                    <Col>
                                        <Typography.Text>Amount to finalize withdraw: {unfinalizedWithdrawAmount} CTSI &nbsp;</Typography.Text>
                                    </Col>
                                    <Col>
                                        {unfinalizedWithdrawAmount > 0 && finalizeWithdrawTimestamp <= new Date() &&
                                            <Button onClick={doFinalizeWithdraw}>Finalize Withdraw</Button>
                                        }
                                    </Col>
                                </Row>
                                {unfinalizedWithdrawAmount > 0 && <Typography.Text>Next finalize time: {finalizeWithdrawTimestamp?.toLocaleString()}</Typography.Text>}
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