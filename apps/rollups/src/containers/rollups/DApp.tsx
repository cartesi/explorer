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
    Input as ChakraInput,
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
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { useDappQuery } from '../../generated/graphql';
import { DappStats } from './DappStats';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

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
    return ethers.utils.toUtf8String(hex);
};

export const hexToJSON = (hex: string) => {
    const str = hexToString(hex);
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
};

type PayloadAs = 'hex' | 'text' | 'json';

export const transformPayload = (as: PayloadAs, payload: string) => {
    switch (as) {
        case 'text':
            return hexToString(payload);
        case 'json':
            return hexToJSON(payload);
        default:
            return payload;
    }
};
export interface InputContentProps<D> {
    items: Edge<D>[];
    label: string;
}

export const InputContent = ({
    items,
    label,
}: InputContentProps<Report | Notice | Voucher>) => {
    const [pos, updatePos] = useState<number>(0);
    const [payloadAs, setPayloadAs] = useState<PayloadAs>('hex');
    const jsonTheme = useColorModeValue('rjv-default', 'ocean');
    const item = items[pos];
    const hasNext = pos + 1 < items.length;
    const hasPrev = pos > 0;

    if (!item) {
        return null;
    }

    const payload = transformPayload(payloadAs, item.node.payload);

    return (
        <Box width="full" py={2} px={3}>
            <HStack width="full" py={2}>
                <Text>{label}</Text>
                <Tag size="md" data-testid="input-content-position">
                    {pos + 1}
                </Tag>

                <ButtonGroup variant="ghost" spacing={3}>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                        data-testid="input-content-prev-button"
                        isDisabled={!hasPrev}
                        onClick={() => updatePos((state) => state - 1)}
                    >
                        prev
                    </Button>

                    <Button
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                        data-testid="input-content-next-button"
                        isDisabled={!hasNext}
                        onClick={() => updatePos((state) => state + 1)}
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
                    value={payloadAs}
                    width="xs"
                    variant="unstyled"
                    onChange={(e) => {
                        const value = e.target.value;
                        setPayloadAs(value as PayloadAs);
                    }}
                >
                    <option value="hex">Hex</option>
                    <option value="text">Text</option>
                    <option value="json">JSON</option>
                </Select>
            </HStack>

            {payloadAs === 'json' ? (
                <ReactJson src={payload} name={null} theme={jsonTheme} />
            ) : (
                <Textarea
                    data-testid="input-content-textarea"
                    width="full"
                    value={payload}
                    readOnly
                />
            )}
        </Box>
    );
};

export interface InputsProps {
    count: number;
    inputs: Edge<Input>[];
}

export const Inputs: FC<InputsProps> = ({ count, inputs }) => {
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
                <Tag
                    size="md"
                    variant="solid"
                    bg="blue.200"
                    data-testid="inputs-position"
                >
                    {pos + 1}
                </Tag>
                <ButtonGroup variant="ghost" spacing={3}>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                        data-testid="inputs-prev-button"
                        isDisabled={!hasPrev}
                        onClick={() => updatePos((state) => state - 1)}
                    >
                        prev
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="blue"
                        textTransform="uppercase"
                        data-testid="inputs-next-button"
                        isDisabled={!hasNext}
                        onClick={() => updatePos((state) => state + 1)}
                    >
                        next
                    </Button>
                </ButtonGroup>
                <Text width="full" textAlign="right">
                    Total {count}
                </Text>
            </HStack>

            <SimpleGrid columns={{ base: 1 }}>
                <InputContent items={input.node.notices.edges} label="Notice" />

                <InputContent items={input.node.reports.edges} label="Report" />

                <InputContent
                    items={input.node.vouchers.edges}
                    label="Voucher"
                />
            </SimpleGrid>
        </Box>
    );
};

export const EpochItem: FC<ItemProps<Epoch>> = ({ item }) => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <VStack bg={bg} alignItems="flex-start" data-testid="epoch-item">
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

export const DApp = () => {
    const [, setSearch] = useState<string>('');
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
                    {fetching && (
                        <Spinner data-testid="dapp-spinner" size="md" />
                    )}
                    <InputGroup width={300}>
                        <InputLeftElement>
                            <SearchIcon />
                        </InputLeftElement>
                        <ChakraInput
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
