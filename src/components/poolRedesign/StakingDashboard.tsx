// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Stack, useDisclosure, VStack, StackProps } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { StakingPoolAllowanceModal } from './modals/StakingPoolAllowanceModal';
import { WalletBalanceSection } from './components/WalletBalanceSection';
import { AllowanceSection } from './components/AllowanceSection';

export interface StakingDashboardProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userBalance: BigNumber; // user pool balance
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
        isOpen: isOpenStakingPoolAllowanceModal,
        onOpen: onOpenStakingPoolAllowanceModal,
        onClose: onCloseStakingPoolAllowanceModal,
    } = useDisclosure();

    const disclosure = useDisclosure();

    const [allowanceTransaction, setAllowanceTransaction] = useState(false);

    return (
        <>
            <VStack spacing={8}>
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    spacing={8}
                    w="full"
                    justifyContent="space-between"
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
                balance={balance}
                onClose={onCloseStakingPoolAllowanceModal}
                onSave={(amount) => {
                    setAllowanceTransaction(true);
                    onApprove(amount);
                }}
            />
        </>
    );
};
