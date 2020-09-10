// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, {useEffect, useCallback, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Breadcrumb, Typography, Input, Row, Col, Button } from 'antd';
import Layout from '../../components/Layout';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import { getLocalNode } from '../../services/node';
import { userInfo } from 'os';

export interface NodesProps {
    localNode: Node;
    nodes: Node[];
}

const Staking = (props: NodesProps) => {
    const [balance, setBalance] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState<number>(1);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(1);
    const [allowanceBalance, setAllowanceBalance] = useState<number>(0);

    const [finalizeDepositTimestamp, setFinalizeDepositTimestamp] = useState<Date>(null);
    const [finalizeWithdrawTimestamp, setFinalizeWithdrawTimestamp] = useState<Date>(null);
    const [unfinalizedDepositAmount, setUnfinalizedDepositAmount] = useState<number>(0);
    const [unfinalizedWithdrawAmount, setUnfinalizedWithdrawAmount] = useState<number>(0);

    const getLocalNodeFunc = useCallback(async () => {
        const {address} = await getLocalNode();
        setBalance(await getStakedBalance(address));

        setFinalizeDepositTimestamp(await getFinalizeDepositTimestamp(address));
        setFinalizeWithdrawTimestamp(await getFinalizeWithdrawTimestamp(address));
        setUnfinalizedDepositAmount(await getUnfinalizedDepositAmount(address));
        setUnfinalizedWithdrawAmount(await getUnfinalizedWithdrawAmount(address));
        setAllowanceBalance(await allowance(address, address));
    }, [getLocalNode]);

    useEffect(() => {
        getLocalNodeFunc();
    }, [getLocalNodeFunc]);

    const {
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
        allowance,
        approve
    } = useCartesiToken();

    const validate = value => {
        if(!value) value = 1;
        return value;
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

            <Typography.Title level={4}>Staked Balance: {balance} CTSI</Typography.Title>
            <Typography.Title level={4}>Allowance Balance: {allowanceBalance} CTSI</Typography.Title>

            <Typography.Title level={4}>Stake: </Typography.Title>
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
                    <Button onClick={() => depositStake(depositAmount)}>Deposit Stake</Button>
                </Col>
            </Row>

            {/* <Row>
                <Col>
                    <Typography.Text>{finalizeDepositTimestamp}</Typography.Text>
                </Col>
                <Col>
                    <Button onClick={() => depositStake(depositAmount)}>Deposit Stake</Button>
                </Col>
            </Row> */}

            <br/>

            <Typography.Title level={4}>Withdraw: </Typography.Title>
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
                    <Button onClick={() => startWithdraw(withdrawAmount)}>Start Withdraw</Button>
                </Col>
            </Row>
        </Layout>
    );
};

export default Staking;
