// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
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
    Statistic,
    Divider,
    Select,
} from 'antd';
import { BigNumber, ContractTransaction } from 'ethers';

import Layout from '../../components/Layout';
import WaitingConfirmations from '../../components/WaitingConfirmations';
import NodeDetails from '../../components/NodeDetails';

import { useLocalNode, useCartesiNodes } from '../../services/node';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import { useMarketInformation } from '../../services/market';

import { isEthAddress } from '../../utils/validator';

const { Option } = Select;
const localNodeUrl = 'http://localhost:8545';

type NodeAddress = { address: string; chain: string };

const Staking = () => {
    const { account, chainId } = useWeb3React<Web3Provider>();

    const [approveAmount, setApproveAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [stakeAmount, setStakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [unstakeAmount, setUnstakeAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(
        BigNumber.from(0)
    );

    const [nodeAddress, setNodeAddress] = useState<string>(null);
    const [confirmationError, setConfirmationError] = useState<string>(null);

    const [workerError, setWorkerError] = useState<string>();
    const [workerTransaction, setWorkerTransaction] = useState<
        Promise<ContractTransaction>
    >();

    // block number tracking
    const blockNumber = useBlockNumber();

    const [nodeList, setNodeList] = useState<Array<NodeAddress>>([]);
    const nodes = useCartesiNodes(chainId);
    const localNode = useLocalNode(localNodeUrl);

    const {
        staking,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        error: stakingError,
        transaction: stakingTransaction,
        clearStates: clearStakingStates,
        stake,
        unstake,
        withdraw,
    } = useStaking();

    const {
        balance,
        allowance,
        error: tokenError,
        transaction: tokenTransaction,
        clearStates: clearTokenStates,
        approve,
        formatCTSI,
        parseCTSI,
    } = useCartesiToken(account, staking?.address, blockNumber);

    const error =
        tokenError || stakingError || workerError || confirmationError;
    const ongoingTransaction =
        tokenTransaction || workerTransaction || stakingTransaction;
    const waiting = !!ongoingTransaction;

    const {
        marketInformation,
        error: marketInfomationError,
    } = useMarketInformation();

    useEffect(() => {
        let newNodeList: Array<NodeAddress> = localNode
            ? [
                  {
                      address: localNode.address,
                      chain: 'localhost:8545',
                  },
              ]
            : [];

        newNodeList = newNodeList.concat(
            nodes.map((node) => {
                return {
                    address: node.address,
                    chain: 'Cartesi',
                };
            })
        );

        setNodeList(newNodeList);
    }, [nodes, localNode]);

    const validate = (value: number): number => {
        if (!value || value < 0) value = 0;
        return value;
    };

    const splitStakeAmount = () => {
        let fromReleasing = BigNumber.from(0),
            fromAllowance = BigNumber.from(0);
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
            return formatCTSI(fromAllowance) + ' CTSI from Allowance Balance';
        }
        if (fromAllowance.eq(0)) {
            return formatCTSI(fromReleasing) + ' CTSI from Unstaked Balance';
        }

        return (
            formatCTSI(fromReleasing) +
            ' CTSI from Unstaked Balance and ' +
            formatCTSI(fromAllowance) +
            ' CTSI from Allowance Balance'
        );
    };

    const splitUnstakeAmount = () => {
        let fromMaturing = BigNumber.from(0),
            fromStaked = BigNumber.from(0);
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
            return formatCTSI(fromStaked) + ' CTSI from Staked Balance';
        }
        if (fromStaked.eq(0)) {
            return formatCTSI(fromMaturing) + ' CTSI from Maturing Balance';
        }

        return (
            formatCTSI(fromMaturing) +
            ' CTSI from Maturing Balance and ' +
            formatCTSI(fromStaked) +
            ' CTSI from Staked Balance'
        );
    };

    const confirmationDone = (error: string) => {
        setConfirmationError(error);

        clearStakingStates();
        clearTokenStates();
    };

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

            <Row>
                <WaitingConfirmations
                    transaction={ongoingTransaction}
                    confirmationDone={confirmationDone}
                    error={error}
                />
            </Row>

            <Space direction="vertical" size="large">
                {chainId === 1 && !marketInfomationError && (
                    <>
                        <Row gutter={16}>
                            <Divider orientation="left" plain></Divider>

                            <Col span={12}>
                                <Statistic
                                    title="CTSI Price"
                                    value={marketInformation.price + ' USD'}
                                />
                            </Col>

                            <Col span={12}>
                                <Statistic
                                    title="Circ. Supply"
                                    value={
                                        marketInformation.circulatingSupply +
                                        ' CTSI'
                                    }
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title="CTSI Market Cap"
                                    value={marketInformation.marketCap + ' USD'}
                                />
                            </Col>

                            <Col span={12}>
                                <Statistic title="Annual Yield" value={0} />
                            </Col>
                        </Row>
                    </>
                )}

                <Row gutter={16}>
                    <Divider orientation="left" plain></Divider>

                    <Col span={12}>
                        <Statistic
                            title="Balance"
                            value={formatCTSI(balance)}
                        />
                    </Col>

                    <Col span={12}>
                        <Statistic
                            title="Allowance Balance"
                            value={formatCTSI(allowance)}
                        />

                        <Row gutter={5}>
                            <Col>
                                <Input
                                    value={approveAmount.toString()}
                                    onChange={(e) =>
                                        setApproveAmount(
                                            BigNumber.from(
                                                validate(e.target.valueAsNumber)
                                            )
                                        )
                                    }
                                    suffix="CTSI"
                                    type="number"
                                    disabled={waiting}
                                />
                            </Col>
                            <Col>
                                <Button
                                    onClick={() =>
                                        approve(
                                            staking.address,
                                            parseCTSI(approveAmount)
                                        )
                                    }
                                    disabled={waiting}
                                >
                                    Approve
                                </Button>
                            </Col>
                        </Row>
                    </Col>

                    <Divider orientation="left" plain></Divider>

                    {maturingBalance.gt(0) && (
                        <>
                            <Col span={24}>
                                <Statistic
                                    title="Maturing Balance"
                                    value={formatCTSI(maturingBalance)}
                                />
                                {maturingBalance.gt(0) && (
                                    <Typography.Text>
                                        Your balance will be matured and ready
                                        for staking at:{' '}
                                        {maturingTimestamp?.toLocaleString()}
                                    </Typography.Text>
                                )}
                            </Col>

                            <Divider orientation="left" plain></Divider>
                        </>
                    )}

                    <Col span={12}>
                        <Statistic
                            title="Staked Balance"
                            value={formatCTSI(stakedBalance)}
                        />
                    </Col>

                    <Col span={12}>
                        <Statistic
                            title="Unstaked Balance"
                            value={formatCTSI(releasingBalance)}
                        />

                        <Row gutter={5}>
                            <Col>
                                <Input
                                    value={withdrawAmount.toString()}
                                    onChange={(e) =>
                                        setWithdrawAmount(
                                            BigNumber.from(
                                                validate(e.target.valueAsNumber)
                                            )
                                        )
                                    }
                                    suffix="CTSI"
                                    type="number"
                                    disabled={waiting}
                                />
                            </Col>
                            <Col>
                                <Button
                                    onClick={() =>
                                        withdraw(parseCTSI(withdrawAmount))
                                    }
                                    disabled={
                                        waiting ||
                                        !withdrawAmount ||
                                        releasingTimestamp > new Date() ||
                                        parseCTSI(withdrawAmount).gt(
                                            releasingBalance
                                        )
                                    }
                                >
                                    Withdraw
                                </Button>
                            </Col>
                        </Row>
                        {releasingBalance.gt(0) &&
                            releasingTimestamp > new Date() && (
                                <Typography.Text>
                                    Next releasing time:{' '}
                                    {releasingTimestamp?.toLocaleString()}
                                </Typography.Text>
                            )}
                    </Col>

                    <Divider orientation="left" plain></Divider>

                    <Col span={24}>
                        <Space direction="vertical">
                            <Row gutter={5} align="middle">
                                <Col>
                                    <Input
                                        value={stakeAmount.toString()}
                                        onChange={(e) =>
                                            setStakeAmount(
                                                BigNumber.from(
                                                    validate(
                                                        e.target.valueAsNumber
                                                    )
                                                )
                                            )
                                        }
                                        suffix="CTSI"
                                        type="number"
                                        disabled={waiting}
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        onClick={() =>
                                            stake(parseCTSI(stakeAmount))
                                        }
                                        disabled={
                                            waiting ||
                                            !stakeAmount ||
                                            parseCTSI(stakeAmount).gt(
                                                allowance.add(releasingBalance)
                                            )
                                        }
                                    >
                                        Stake
                                    </Button>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        (Maximum Limit:{' '}
                                        {formatCTSI(
                                            allowance.add(releasingBalance)
                                        )}{' '}
                                        CTSI)
                                    </Typography.Text>
                                </Col>
                            </Row>

                            {stakeAmount.gt(0) && (
                                <Row>
                                    <Typography.Text>
                                        Stake {splitStakeAmount()} (Once you
                                        stake, the next settlement time will be
                                        reset!)
                                    </Typography.Text>
                                </Row>
                            )}

                            <Row gutter={5} align="middle">
                                <Col>
                                    <Input
                                        value={unstakeAmount.toString()}
                                        onChange={(e) =>
                                            setUnstakeAmount(
                                                BigNumber.from(
                                                    validate(
                                                        e.target.valueAsNumber
                                                    )
                                                )
                                            )
                                        }
                                        suffix="CTSI"
                                        type="number"
                                        disabled={waiting}
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        onClick={() =>
                                            unstake(parseCTSI(unstakeAmount))
                                        }
                                        disabled={
                                            waiting ||
                                            !unstakeAmount ||
                                            parseCTSI(unstakeAmount).gt(
                                                stakedBalance.add(
                                                    maturingBalance
                                                )
                                            )
                                        }
                                    >
                                        Unstake
                                    </Button>
                                </Col>
                                <Col>
                                    <Typography.Text>
                                        (Maximum Limit:{' '}
                                        {formatCTSI(
                                            stakedBalance.add(maturingBalance)
                                        )}{' '}
                                        CTSI)
                                    </Typography.Text>
                                </Col>
                            </Row>

                            {unstakeAmount.gt(0) && (
                                <Row>
                                    <Typography.Text>
                                        Unstake {splitUnstakeAmount()} (Once you
                                        unstake, the next releasing time will be
                                        reset!)
                                    </Typography.Text>
                                </Row>
                            )}
                        </Space>
                    </Col>
                </Row>

                <Divider orientation="left" plain></Divider>

                <Row gutter={16} align="middle">
                    <Col>
                        <Typography.Text>Select Node:</Typography.Text>
                    </Col>
                    <Col>
                        <Select
                            style={{ minWidth: 560 }}
                            showSearch
                            value={nodeAddress}
                            onChange={(value) =>
                                setNodeAddress(value.toString())
                            }
                            disabled={waiting}
                            filterOption={(input, option) => {
                                setNodeAddress(input);
                                return true;
                            }}
                        >
                            {nodeList.map((item) => (
                                <Option key={item.address} value={item.address}>
                                    {item.address} &lt;{item.chain}&gt;
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                {isEthAddress(nodeAddress) && (
                    <NodeDetails
                        address={nodeAddress}
                        setWorkerError={setWorkerError}
                        setWorkerTransaction={setWorkerTransaction}
                        waiting={waiting}
                    />
                )}

                {/* {error &&
                    <Alert
                        message="Error occured!"
                        description={error}
                        type="error"
                        closable
                    />
                } */}
            </Space>
        </Layout>
    );
};

export default Staking;
