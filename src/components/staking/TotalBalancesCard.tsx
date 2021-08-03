import React, { memo } from 'react';
import { Flex, FlexProps, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { BigNumberish } from 'ethers';
import theme from '../../styles/theme';
import CTSIText from '../CTSIText';

interface TotalBalancesCardProps extends FlexProps {
    title: string;
    tooltip: string;
    balance: BigNumberish;
}

const areEqual = (
    prevProps: TotalBalancesCardProps,
    nextProps: TotalBalancesCardProps
) =>
    prevProps.title === nextProps.title &&
    prevProps.tooltip === nextProps.tooltip &&
    prevProps.balance === nextProps.balance;

export const TotalBalancesCard: React.FunctionComponent<TotalBalancesCardProps> =
    memo((props) => {
        const { title, tooltip, balance, ...restProps } = props;

        return (
            <Flex
                px={['0 60px', '0 60px', '0 60px', '60px']}
                align="center"
                {...restProps}
            >
                <label className="body-text-1">{title}</label>

                <Tooltip
                    label={tooltip}
                    ariaLabel={tooltip}
                    color="white"
                    bg={theme.colors.primary}
                    alignSelf="flex-start"
                >
                    <QuestionOutlineIcon
                        fontSize={10}
                        mr="12px"
                        mb="12px"
                        ml="6px"
                    />
                </Tooltip>

                <CTSIText value={balance} />
            </Flex>
        );
    }, areEqual);

export default TotalBalancesCard;
