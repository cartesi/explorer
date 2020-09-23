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
import {
    Breadcrumb,
    Typography,
    Input,
    Row,
    Col,
    Button,
    Space,
    Alert,
    Spin,
    Statistic,
    Divider
} from 'antd';
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

    const validate = (value: number): number => {
        if (!value || value < 0) value = 0;
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
        unstake(parseCTSI(unstakeAmount))
            .then(() => {
                setWaiting(false);
            })
    }

    const splitStakeAmount = () => {
        let fromReleasing = BigNumber.from(0), fromAllowance = BigNumber.from(0);
        let stakeAmountCTSI = parseCTSI(stakeAmount);

        if (releasingBalance.add(allowance).lt(stakeAmountCTSI)) {
            return 'You exceeded the maximum staking limit!';
        }

        if (releasingBalance.eq(0)) {
            fromAllowance = stakeAmountCTSI;
        } else {
            if (releasingBalance.gt(stakeAmountCTSI)) {
                fromReleasing = stakeAmountCTSI;
            } else {
                fromReleasing = releasingBalance;
                fromAllowance = stakeAmountCTSI.sub(releasingBalance);
            }
        }

        if (fromReleasing.eq(0)) {
            return formatCTSI(fromAllowance) + " CTSI from Allowance Balance";
        }
        if (fromAllowance.eq(0)) {
            return formatCTSI(fromReleasing) + " CTSI from Unstaked Balance";
        }

        return formatCTSI(fromReleasing) + " CTSI from Unstaked Balance and " + formatCTSI(fromAllowance) + " CTSI from Allowance Balance";
    }

    const splitUnstakeAmount = () => {
        let fromMaturing = BigNumber.from(0), fromStaked = BigNumber.from(0);
        let unstakeAmountCTSI = parseCTSI(unstakeAmount);

        if (maturingBalance.add(stakedBalance).lt(unstakeAmountCTSI)) {
            return 'You exceeded the maximum unstaking limit!';
        }

        if (maturingBalance.eq(0)) {
            fromStaked = unstakeAmountCTSI;
        } else {
            if (maturingBalance.gt(unstakeAmountCTSI)) {
                fromMaturing = unstakeAmountCTSI;
            } else {
                fromMaturing = maturingBalance;
                fromStaked = unstakeAmountCTSI.sub(maturingBalance);
            }
        }

        if (fromMaturing.eq(0)) {
            return formatCTSI(fromStaked) + " CTSI from Staked Balance";
        }
        if (fromStaked.eq(0)) {
            return formatCTSI(fromMaturing) + " CTSI from Maturing Balance";
        }

        return formatCTSI(fromMaturing) + " CTSI from Maturing Balance and " + formatCTSI(fromStaked) + " CTSI from Staked Balance";
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
                    <Row gutter={16}>

                        <Divider orientation="left" plain></Divider>

                        <Col span={12}>
                            <Statistic title="Balance" value={formatCTSI(balance)} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Allowance Balance" value={formatCTSI(allowance)} />

                            <Row gutter={5}>
                                <Col>
                                    <Input
                                        value={approveAmount.toString()}
                                        onChange={e => setApproveAmount(BigNumber.from(validate(e.target.valueAsNumber)))}
                                        suffix="CTSI"
                                        type="number"
                                    />
                                </Col>
                                <Col>
                                    <Button onClick={doApprove}>Approve</Button>
                                </Col>
                            </Row>
                        </Col>

                        <Divider orientation="left" plain></Divider>

                        {maturingBalance.gt(0) &&
                            <>
                                <Col span={24}>
                                    <Statistic title="Maturing Balance" value={formatCTSI(maturingBalance)} />
                                    {maturingBalance.gt(0) && <Typography.Text>Next settlement time: {maturingTimestamp?.toLocaleString()}</Typography.Text>}
                                </Col>

                                <Divider orientation="left" plain></Divider>
                            </>
                        }

                        <Col span={12}>
                            <Statistic title="Staked Balance" value={formatCTSI(stakedBalance)} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Unstaked Balance" value={formatCTSI(releasingBalance)} />

                            <Row gutter={5}>
                                <Col>
                                    <Input
                                        value={withdrawAmount.toString()}
                                        onChange={e => setWithdrawAmount(BigNumber.from(validate(e.target.valueAsNumber)))}
                                        suffix="CTSI"
                                        type="number"
                                    />
                                </Col>
                                <Col>
                                    <Button onClick={doWithdraw}
                                        disabled={!withdrawAmount || releasingTimestamp > new Date() || parseCTSI(withdrawAmount).gt(releasingBalance)}
                                    >
                                        Withdraw
                                    </Button>
                                </Col>
                            </Row>
                            {releasingBalance.gt(0) && <Typography.Text>Next releasing time: {releasingTimestamp?.toLocaleString()}</Typography.Text>}
                        </Col>

                        <Divider orientation="left" plain></Divider>

                        <Col span={24}>
                            <Space direction='vertical'>
                                <Row gutter={5} align='middle'>
                                    <Col>
                                        <Input
                                            value={stakeAmount.toString()}
                                            onChange={e => setStakeAmount(BigNumber.from(validate(e.target.valueAsNumber)))}
                                            suffix="CTSI"
                                            type="number"
                                        />
                                    </Col>
                                    <Col>
                                        <Button onClick={doStake}
                                            disabled={!stakeAmount || parseCTSI(stakeAmount).gt(allowance.add(releasingBalance))}
                                        >
                                            Stake
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Typography.Text>
                                            (Maximum Limit: {formatCTSI(allowance.add(releasingBalance))} CTSI)
                                        </Typography.Text>
                                    </Col>
                                </Row>

                                {stakeAmount.gt(0) &&
                                    <Row>
                                        <Typography.Text>
                                        Stake {splitStakeAmount()} (Once you stake, the next settlement time will be reset!)
                                        </Typography.Text>
                                    </Row>
                                }

                                <Row gutter={5} align='middle'>
                                    <Col>
                                        <Input
                                            value={unstakeAmount.toString()}
                                            onChange={e => setUnstakeAmount(BigNumber.from(validate(e.target.valueAsNumber)))}
                                            suffix="CTSI"
                                            type="number"
                                        />
                                    </Col>
                                    <Col>
                                        <Button onClick={doUnstake}
                                            disabled={!unstakeAmount || parseCTSI(unstakeAmount).gt(stakedBalance.add(maturingBalance))}
                                        >
                                            Unstake
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Typography.Text>
                                            (Maximum Limit: {formatCTSI(stakedBalance.add(maturingBalance))} CTSI)
                                        </Typography.Text>
                                    </Col>
                                </Row>
                                
                                {unstakeAmount.gt(0) &&
                                    <Row>
                                        <Typography.Text>
                                        Unstake {splitUnstakeAmount()} (Once you unstake, the next releasing time will be reset!)
                                        </Typography.Text>
                                    </Row>
                                }
                            </Space>
                        </Col>
                    </Row>

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
