// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, Td, Tr, useColorModeValue, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { PoolBalance } from '../../../graphql/models';
import { formatCTSI } from '../../../utils/token';
import { userShare } from '../../../graphql/hooks/usePoolBalances';
import { useStakingPool } from '../../../services/pool';
import { StakeIcon } from '../../Icons';
import Address from '../../Address';

export interface UserStakingPoolsTableRowProps {
    chainId: number;
    balance: PoolBalance;
    account?: string;
    keepActionColVisible?: boolean;
}

const UserStakingPoolsTableRow: FC<UserStakingPoolsTableRowProps> = ({
    chainId,
    account,
    balance,
    keepActionColVisible,
}) => {
    const borderColor = useColorModeValue('gray.100', 'header');
    const stakeInfoBg = useColorModeValue('white', 'gray.700');
    const percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
    });
    const address = balance.pool.id;
    const {
        balance: unstakedBalance,
        stakedShares,
        sharesToAmount,
    } = useStakingPool(address, account);
    const stakedBalance = sharesToAmount(stakedShares);

    return (
        <Tr key={balance.pool.id} data-testid="user-staking-pools-table-row">
            <Td borderColor={borderColor} data-testid="address-col">
                <Address
                    ens
                    address={balance.pool.id}
                    chainId={chainId}
                    truncated
                    size="md"
                    bg="blue.50"
                    px="0.5rem"
                    py="0.25rem"
                    color="gray.900"
                    minWidth="120px"
                    shouldDisplayFallbackAvatar
                />
            </Td>
            <Td isNumeric borderColor={borderColor} data-testid="unstaked-col">
                {formatCTSI(unstakedBalance, 2)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor} data-testid="staked-col">
                {formatCTSI(stakedBalance, 2)} CTSI
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="percentage-col"
            >
                {percentFormatter.format(userShare(balance))}
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                position={keepActionColVisible ? 'sticky' : 'initial'}
                top={0}
                right={0}
                backgroundColor={stakeInfoBg}
                padding={0}
                data-testid="stake-info-col"
            >
                <Box
                    transition="all 0.2s ease-in"
                    shadow={keepActionColVisible ? 'md' : 'none'}
                    padding={[0, 0, 8, 8]}
                    minHeight={['78px', '80px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display={keepActionColVisible ? 'flex' : 'block'}
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <NextLink href={`/stake/${balance.pool.id}`} passHref>
                        <Link mr={[0, 0, 3]} data-testid="stake-info-link">
                            <StakeIcon w={8} h={8} />
                        </Link>
                    </NextLink>
                </Box>
            </Td>
        </Tr>
    );
};

export default UserStakingPoolsTableRow;
