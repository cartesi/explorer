import React from 'react';
import { Flex, FlexProps } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import labels from '../../utils/labels';
import { User } from '../../graphql/models';
import TotalBalancesCard from './TotalBalancesCard';

interface TotalBalancesProps extends FlexProps {
    user: User;
    totalBalance: BigNumberish;
}

export const TotalBalances: React.FunctionComponent<TotalBalancesProps> = (
    props
) => {
    const { user, totalBalance, ...restProps } = props;

    return (
        <Flex
            direction={['column', 'column', 'column', 'row']}
            p="25px 6vw 0 6vw"
            {...restProps}
        >
            <TotalBalancesCard
                title="Total Rewards"
                tooltip={labels.totalRewards}
                balance={BigNumber.from(user ? user.totalReward : 0)}
            />

            <TotalBalancesCard
                title="In-contract Balance"
                tooltip={labels.inContractBalance}
                balance={totalBalance}
            />
        </Flex>
    );
};

export default TotalBalances;
