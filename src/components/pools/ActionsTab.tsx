// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    HStack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    TabsProps,
    Text,
} from '@chakra-ui/react';
import StakeForm from './StakeForm';
import UnstakeForm from './UnstakeForm';
import { BigNumber } from 'ethers';
import WithdrawForm from './WithdrawForm';
import { LockIcon } from '@chakra-ui/icons';

export interface ActionsTabProps extends TabsProps {
    allowance: BigNumber;
    paused: boolean;
    stakedAmount: BigNumber;
    stakedShares: BigNumber;
    releasedBalance: BigNumber;
    withdrawBalance: BigNumber;
    onApprove: (amount: BigNumber) => void;
    onStake: (amount: BigNumber) => void;
    onUnstake: (amount?: BigNumber) => void;
    onWithdraw: () => void;
}

const ActionsTab: FC<ActionsTabProps> = (props) => {
    const {
        allowance,
        paused,
        stakedAmount,
        stakedShares,
        releasedBalance,
        withdrawBalance,
        onApprove,
        onStake,
        onUnstake,
        onWithdraw,
        ...tabsProps
    } = props;
    return (
        <Tabs {...tabsProps}>
            <TabList>
                <Tab>
                    <HStack>
                        <Text>Stake</Text>
                        {paused && <LockIcon />}
                    </HStack>
                </Tab>
                <Tab>Unstake</Tab>
                <Tab>Withdraw</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <StakeForm
                        allowance={allowance}
                        paused={paused}
                        onApprove={onApprove}
                        onStake={onStake}
                    />
                </TabPanel>
                <TabPanel>
                    <UnstakeForm
                        onUnstake={onUnstake}
                        amount={stakedAmount}
                        shares={stakedShares}
                    />
                </TabPanel>
                <TabPanel>
                    <WithdrawForm
                        releasedBalance={releasedBalance}
                        withdrawBalance={withdrawBalance}
                        onWithdraw={onWithdraw}
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default ActionsTab;
