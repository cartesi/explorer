// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Stack, useDisclosure, VStack, StackProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { StakingPoolAllowanceModal } from './modals/StakingPoolAllowanceModal';
import { WalletBalanceSection } from './components/WalletBalanceSection';
import { AllowanceSection } from './components/AllowanceSection';

export interface StakingDashboardProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userETHBalance: BigNumber; // user ETH balance
    onApprove: (amount: BigNumberish) => void;
}

export const StakingDashboard: FC<StakingDashboardProps> = ({
    userETHBalance,
    allowance,
    balance,
    onApprove,
}) => {
    const {
        open: isOpenStakingPoolAllowanceModal,
        onOpen: onOpenStakingPoolAllowanceModal,
        onClose: onCloseStakingPoolAllowanceModal,
    } = useDisclosure();

    const disclosure = useDisclosure();

    return (
        <>
            <VStack role="wallet-balance" gap={8}>
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    w="full"
                    justifyContent="space-between"
                    width="800px"
                    maxWidth="100%"
                >
                    <WalletBalanceSection
                        userCTSIBalance={balance}
                        userETHBalance={userETHBalance}
                    />
                    <AllowanceSection
                        allowance={allowance}
                        onAllowanceClick={onOpenStakingPoolAllowanceModal}
                    />
                </Stack>
            </VStack>

            <StakingPoolAllowanceModal
                isOpen={isOpenStakingPoolAllowanceModal}
                disclosure={disclosure}
                allowance={allowance}
                onClose={onCloseStakingPoolAllowanceModal}
                onSave={(amount) => {
                    onApprove(amount);
                }}
            />
        </>
    );
};
