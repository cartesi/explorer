import {
    Box,
    HStack,
    Icon,
    SimpleGrid,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { MdTimer } from 'react-icons/md';
import BigNumberText from '../../components/BigNumberText';
import StakeCard from '../../components/stake/StakeCard';
import { FC } from 'react';
import {
    InputIcon,
    NoticeIcon,
    ReportIcon,
    VoucherIcon,
} from '../../components/Icons';

export interface DappStatsProps {
    epochs: number;
    inputs: number;
    notices: number;
    reports: number;
    vouchers: number;
}

export const DappStats: FC<DappStatsProps> = ({
    epochs,
    inputs,
    notices,
    reports,
    vouchers,
}) => {
    const { onToggle, isOpen } = useDisclosure();
    const inputsTooltip = useDisclosure();
    const noticesTooltip = useDisclosure();
    const reportsTooltip = useDisclosure();
    const vouchersTooltip = useDisclosure();

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
            <StakeCard
                Icon={<Box as={MdTimer} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text># Epochs</Text>
                        <Tooltip
                            label="Total number of epochs"
                            placement="top"
                            isOpen={isOpen}
                        >
                            <Icon onClick={onToggle} />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={epochs} />
            </StakeCard>
            <StakeCard
                Icon={<Box as={InputIcon} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text># Inputs</Text>
                        <Tooltip
                            label="Total number of inputs processed"
                            placement="top"
                            isOpen={inputsTooltip.isOpen}
                        >
                            <Icon onClick={inputsTooltip.onToggle} />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={inputs} />
            </StakeCard>
            <StakeCard
                Icon={<Box as={NoticeIcon} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text># Notices</Text>
                        <Tooltip
                            label="Total number of notices emmited"
                            placement="top"
                            isOpen={noticesTooltip.isOpen}
                        >
                            <Icon onClick={noticesTooltip.onToggle} />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={notices} />
            </StakeCard>
            <StakeCard
                Icon={<Box as={ReportIcon} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text># Reports</Text>
                        <Tooltip
                            label="Total number of reports emmited"
                            placement="top"
                            isOpen={reportsTooltip.isOpen}
                        >
                            <Icon onClick={reportsTooltip.onToggle} />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={reports} />
            </StakeCard>
            <StakeCard
                Icon={<Box as={VoucherIcon} w={8} h={8} />}
                Title={
                    <HStack>
                        <Text># Vouchers</Text>
                        <Tooltip
                            label="Total number of vouchers emmited"
                            placement="top"
                            isOpen={vouchersTooltip.isOpen}
                        >
                            <Icon onClick={vouchersTooltip.onToggle} />
                        </Tooltip>
                    </HStack>
                }
            >
                <BigNumberText value={vouchers} />
            </StakeCard>
        </SimpleGrid>
    );
};
