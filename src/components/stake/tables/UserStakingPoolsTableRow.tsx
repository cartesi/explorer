// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Icon, Link, Table, TableCellProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import { userShare } from '../../../graphql/hooks/usePoolBalances';
import { PoolBalance } from '../../../graphql/models';
import { useStakingPool } from '../../../services/pool';
import { formatCTSI } from '../../../utils/token';
import Address from '../../Address';
import { StakeIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';

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
    const [isHovered, setHovered] = useState(false);
    const backgroundColor = useColorModeValue('white', 'dark.gray.primary');
    const backgroundHoverColor = useColorModeValue(
        'WhiteSmoke',
        'dark.gray.tertiary'
    );
    const borderColor = useColorModeValue('gray.100', 'dark.gray.quinary');
    const linkHoverColor = useColorModeValue('blue.400', 'dark.primary');
    const linkColor = useColorModeValue('gray.900', 'dark.primary');
    const addressColor = useColorModeValue('gray.900', 'white');
    const stakeInfoBg = useColorModeValue('white', 'dark.gray.primary');
    const tdProps: TableCellProps = {
        borderColor,
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <Table.Row
            key={balance.pool.id}
            data-testid="user-staking-pools-table-row"
            bg={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Table.Cell
                borderColor={borderColor}
                data-testid="address-col"
                {...tdProps}
            >
                <Address
                    ens
                    address={balance.pool.id}
                    chainId={chainId}
                    truncated
                    px="0.5rem"
                    py="0.25rem"
                    minWidth="120px"
                    textDecoration="underline"
                    color={addressColor}
                    shouldDisplayFallbackAvatar
                />
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                data-testid="unstaked-col"
                {...tdProps}
            >
                {formatCTSI(unstakedBalance, 2)} CTSI
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                data-testid="staked-col"
                {...tdProps}
            >
                {formatCTSI(stakedBalance, 2)} CTSI
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                data-testid="percentage-col"
                {...tdProps}
            >
                {percentFormatter.format(userShare(balance))}
            </Table.Cell>
            <Table.Cell
                position={keepActionColVisible ? 'sticky' : 'initial'}
                top={0}
                right={0}
                maxWidth="132px"
                backgroundColor={isHovered ? backgroundHoverColor : stakeInfoBg}
                padding={0}
                data-testid="stake-info-col"
                {...tdProps}
            >
                <Box
                    transition="all 0.2s ease-in"
                    shadow={keepActionColVisible ? 'md' : 'none'}
                    padding={[0, 0, 6, 6]}
                    minHeight={['78px', '80px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display="flex"
                    alignItems="center"
                    justifyContent={{ base: 'center', lg: 'flex-end' }}
                    mr={{ base: 0, lg: 6 }}
                    ml="auto"
                >
                    <Link
                        asChild
                        data-testid="stake-info-link"
                        color={linkColor}
                        _hover={{
                            color: linkHoverColor,
                        }}
                    >
                        <NextLink href={`/stake/${balance.pool.id}`}>
                            <Icon as={StakeIcon} w={8} h={8} />
                        </NextLink>
                    </Link>
                </Box>
            </Table.Cell>
        </Table.Row>
    );
};

export default UserStakingPoolsTableRow;
