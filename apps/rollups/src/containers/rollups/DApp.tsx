// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { SearchIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    ButtonGroup,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    SimpleGrid,
    Spinner,
    Tag,
    Text,
    Textarea,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { Notification } from '@explorer/ui';
import { ethers } from 'ethers';
import { FC, useState } from 'react';
import { useDappQuery } from '../../generated/graphql';
import { DappStats } from './DappStats';

type PageInfo = {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Edge<T> = {
    cursor: string;
    node: T;
};

type Connection<T> = {
    totalCount: number;
    pageInfo: PageInfo;
    nodes?: T[];
    edges?: Edge<T>[];
};

type Proof = {
    outputHashesRootHash: string;
    vouchersEpochRootHash: string;
    noticesEpochRootHash: string;
    machineStateHash: string;
    keccakInHashesSiblings: string[];
    outputHashesInEpochSiblings: string[];
};

type Notice = {
    id: string;
    index: number;
    proof?: Proof;
    keccak: string;
    payload: string;
};

type Report = {
    id: string;
    index: number;
    payload: string;
};

type Voucher = {
    id: string;
    index: number;
    proof?: Proof;
    destination: string;
    payload: string;
};

type Input = {
    id: string;
    index: number;
    msgSender: string;
    timestamp: number;
    blockNumber: number;
    notices: Connection<Notice>;
    reports: Connection<Report>;
    vouchers: Connection<Voucher>;
};

type Epoch = {
    id: string;
    index: number;
    inputs: Connection<Input>;
};

interface ItemProps<T> {
    item: T;
}

const hexToString = (hex: string) => {
    let str = '';
    const tHex = hex.replace('0x', '');
    if (!ethers.utils.isHexString(hex)) {
        return hex;
    } else {
        for (let i = 0; i < tHex.length; i += 2) {
            str += String.fromCharCode(parseInt(tHex.substring(i, i + 2), 16));
        }
    }
    return str;
};

type PayloadAs = 'hex' | 'text' | 'json';

const transformPayload = (as: PayloadAs, payload: string) => {
    switch (as) {
        case 'text':
            return hexToString(payload);
        default:
            return payload;
    }
};
interface InputContentProps<D> {
    count: number;
    items: Edge<D>[];
    label: string;
}

const InputContent = ({
    count,
    items,
    label,
}: InputContentProps<Report | Notice | Voucher>) => {
    const [pos, updatePos] = useState<number>(0);
    const [payloadAs, setPayloadAs] = useState<PayloadAs>('hex');
    const item = items[pos];
    const hasNext = pos + 1 < items.length;
    const hasPrev = pos > 0;

    if (!item) return null;
    const payload = transformPayload(payloadAs, item.node.payload);

    return (
        <Box width="full" py={2} px={3}>
            <HStack width="full" py={2}>
                <Text>{label}</Text>
                <Tag size="md">{pos + 1}</Tag>
                <ButtonGroup variant="ghost" spacing={3}>
                    <Button
                        isDisabled={!hasPrev}
                        onClick={() => updatePos((state) => state - 1)}
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                    >
                        prev
                    </Button>
                    <Button
                        isDisabled={!hasNext}
                        onClick={() => updatePos((state) => state + 1)}
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                    >
                        next
                    </Button>
                </ButtonGroup>
                <Text width="full" textAlign="right">
                    Total {items.length}
                </Text>
            </HStack>

            <HStack>
                <Text>As:</Text>
                <Select
                    width="xs"
                    variant="unstyled"
                    onChange={(e) => {
                        const value = e.target.value;
                        setPayloadAs(value as PayloadAs);
                    }}
                    value={payloadAs}
                >
                    <option value="hex">Hex</option>
                    <option value="text">Text</option>
                </Select>
            </HStack>
            <Textarea width="full" value={payload} readOnly />
        </Box>
    );
};
interface InputsProps {
    count: number;
    inputs: Edge<Input>[];
}

const Inputs: FC<InputsProps> = ({ count, inputs }) => {
    const [pos, updatePos] = useState<number>(0);
    const input = inputs[pos];
    const hasNext = pos + 1 < count;
    const hasPrev = pos > 0;

    return (
        <Box px={3} py={2} width="full">
            <HStack>
                <Text fontWeight="bold" fontSize="lg">
                    Input
                </Text>
                <Tag size="md" variant="solid" bg="blue.200">
                    {pos + 1}
                </Tag>
                <ButtonGroup variant="ghost" spacing={3}>
                    <Button
                        isDisabled={!hasPrev}
                        onClick={() => updatePos((state) => state - 1)}
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                    >
                        prev
                    </Button>
                    <Button
                        isDisabled={!hasNext}
                        onClick={() => updatePos((state) => state + 1)}
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                    >
                        next
                    </Button>
                </ButtonGroup>
                <Text width="full" textAlign="right">
                    Total {count}
                </Text>
            </HStack>

            <SimpleGrid columns={{ base: 1 }}>
                <InputContent
                    count={input.node.notices.totalCount}
                    items={input.node.notices.edges}
                    label="Notice"
                />

                <InputContent
                    count={input.node.reports.totalCount}
                    items={input.node.reports.edges}
                    label="Report"
                />

                <InputContent
                    count={input.node.vouchers.totalCount}
                    items={input.node.vouchers.edges}
                    label="Voucher"
                />
            </SimpleGrid>
        </Box>
    );
};

const EpochItem: FC<ItemProps<Epoch>> = ({ item }) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <VStack bg={bg} alignItems="flex-start">
            <Box
                width="100%"
                textAlign="center"
                bg="blue.100"
                py={2}
                color="black"
            >
                <Heading fontSize="2xl">Epoch {item.index + 1}</Heading>
            </Box>
            <Inputs count={item.inputs.totalCount} inputs={item.inputs.edges} />
        </VStack>
    );
};

export interface DAppProps {
    address: string;
    chainId: number;
}

export const DApp: FC<DAppProps> = (props) => {
    const { address, chainId } = props;
    const [search, setSearch] = useState<string>('');
    const bg = useColorModeValue('gray.80', 'header');

    const [result] = useDappQuery({
        variables: {},
    });
    const { data, fetching, error } = result;

    return (
        <>
            <Box
                px={{ base: '3vw', md: '8vw' }}
                py={{ base: 4, sm: 8, lg: 26 }}
            >
                {data && (
                    <DappStats
                        epochs={data.epochs.totalCount}
                        inputs={data.inputs.totalCount}
                        notices={data.notices.totalCount}
                        reports={data.reports.totalCount}
                        vouchers={data.vouchers.totalCount}
                    />
                )}
            </Box>
            <Box
                px={{ base: '3vw', md: '8vw' }}
                py={{ base: 4, sm: 8, lg: 26 }}
                bg={bg}
            >
                {error && (
                    <Notification
                        status="error"
                        title="Error fetching Dapps!"
                        subtitle={error?.message}
                    />
                )}
                <HStack justifyContent="flex-end">
                    {fetching && <Spinner size="md" />}
                    <InputGroup width={300}>
                        <InputLeftElement>
                            <SearchIcon />
                        </InputLeftElement>
                        <Input
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </HStack>
                <SimpleGrid columns={1} spacing="5" py={4}>
                    {data?.epochs.edges.map((epoch) => (
                        <EpochItem item={epoch.node} key={epoch.cursor} />
                    ))}
                </SimpleGrid>
            </Box>
        </>
    );
};
