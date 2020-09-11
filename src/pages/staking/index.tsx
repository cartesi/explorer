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
import { Node, getLocalNode } from '../../services/node';

export interface NodesProps {
    localNode: Node;
    nodes: Node[];
}

const localNodeUrl = 'http://localhost:8545';

const Staking = (props: NodesProps) => {
    const [stakedBalance, setStakedBalance] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [approveAmount, setApproveAmount] = useState<number>(0);
    const [allowanceBalance, setAllowanceBalance] = useState<number>(0);

    const [error, setError] = useState<string>(null);

    const [finalizeDepositTimestamp, setFinalizeDepositTimestamp] = useState<Date>(null);
    const [finalizeWithdrawTimestamp, setFinalizeWithdrawTimestamp] = useState<Date>(null);
    const [unfinalizedDepositAmount, setUnfinalizedDepositAmount] = useState<number>(0);
    const [unfinalizedWithdrawAmount, setUnfinalizedWithdrawAmount] = useState<number>(0);

    const {
        staking,
        address: stakingAddress,
        submitting: stakingSubmitting,
        error: stakingError,
        getStakedBalance,
        depositStake,
        finalizeStakes,
        startWithdraw,
        finalizeWithdraws,
        getFinalizeDepositTimestamp,
        getFinalizeWithdrawTimestamp,
        getUnfinalizedDepositAmount,
        getUnfinalizedWithdrawAmount
    } = useStaking();

    const {
        cartesiToken,
        address: tokenAddress,
        submitting: tokenSubmitting,
        error: tokenError,
        allowance,
        approve
    } = useCartesiToken();

    const getInformation = () => {
        const address = props.localNode.address;
        getStakedBalance(address).then(val => setStakedBalance(val));

        getFinalizeDepositTimestamp(address).then(val => setFinalizeDepositTimestamp(val));
        getFinalizeWithdrawTimestamp(address).then(val => setFinalizeWithdrawTimestamp(val));
        getUnfinalizedDepositAmount(address).then(val => setUnfinalizedDepositAmount(val));
        getUnfinalizedWithdrawAmount(address).then(val => setUnfinalizedWithdrawAmount(val));
        allowance(address, stakingAddress).then(val => setAllowanceBalance(val));
    };

    useEffect(() => {
        if(staking && cartesiToken) {
            getInformation();
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
                <Space direction='vertical'>
                    <Typography.Title level={4}>Staked Balance: {stakedBalance} CTSI</Typography.Title>
                    <Typography.Title level={4}>Allowance Balance: {allowanceBalance} CTSI</Typography.Title>
                </Space>

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
                                <Typography.Text>Amount to finalize deposit: {unfinalizedDepositAmount} &nbsp;</Typography.Text>
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
                                <Typography.Text>Amount to finalize withdraw: {unfinalizedWithdrawAmount} &nbsp;</Typography.Text>
                            </Col>
                            <Col>
                                {unfinalizedWithdrawAmount > 0 && finalizeWithdrawTimestamp <= new Date() &&
                                    <Button onClick={doFinalizeStakes}>Finalize Stakes</Button>
                                }
                            </Col>
                        </Row>
                        {unfinalizedWithdrawAmount > 0 && <Typography.Text>Next finalize time: {finalizeWithdrawTimestamp?.toLocaleString()}</Typography.Text>}
                    </Space>
                </div>

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

export const getServerSideProps = async () => {
    // const localNode = { address: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0', chainId: 30137 };
    const localNode = await getLocalNode(localNodeUrl);

    return { props: { localNode } };
};
