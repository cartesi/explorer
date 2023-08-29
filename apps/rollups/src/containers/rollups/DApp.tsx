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
    Input as ChakraInput,
    HStack,
    Heading,
    InputGroup,
    InputLeftElement,
    Select,
    SimpleGrid,
    Spinner,
    Tag,
    Text,
    Textarea,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { Notification } from '@explorer/ui';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { FC, ReactElement, useState } from 'react';
import {
    useDappQuery,
    useInputEdgeQuery,
} from '../../generated/graphql/rollups/0.9';
import { DappStats } from './DappStats';
const ReactJson = dynamic(import('react-json-view'), { ssr: false });

type PageInfo = {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Edge<T> = {
    cursor?: string;
    node: T;
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
    id?: string;
    index: number;
    proof?: Proof;
    keccak?: string;
    payload: string;
};

type Report = {
    id?: string;
    index: number;
    payload: string;
};

type Voucher = {
    id?: string;
    index: number;
    proof?: Proof;
    destination?: string;
    payload: string;
};

const hexToString = (hex: string) => {
    return ethers.utils.toUtf8String(hex);
};

export const hexToJSON = (hex: string) => {
    const str = ethers.utils.toUtf8String(hex);
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
    count?: number;
    label: string | ReactElement;
    showPagination?: boolean;
}

export const InputContent = ({
    items,
    label,
    showPagination = true,
}: InputContentProps<Report | Notice | Voucher | Node>) => {
    const [pos, updatePos] = useState<number>(0);
    const [payloadAs, setPayloadAs] = useState<PayloadAs>('hex');
    const jsonTheme = useColorModeValue('rjv-default', 'ocean');
    const totalItems = items.length;
    const item = items[pos];
    const hasNext = pos + 1 < totalItems;
    const hasPrev = pos > 0;

    if (!item) {
        return null;
    }

    const payload = transformPayload(payloadAs, item.node.payload);

    return (
        <Box width="full" py={2} px={3}>
            <HStack width="full" py={2}>
                <Text whiteSpace="nowrap">{label}</Text>
                {showPagination && (
                    <>
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
                    </>
                )}
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

interface NodeProps<T> {
    node: T;
}

type Node = {
    index: number;
    payload: string;
    msgSender: string;
    timestamp: BigInt;
    notices: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: Edge<Notice>[];
    };
    reports: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: Edge<Report>[];
    };
    vouchers: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: Edge<Voucher>[];
    };
};

const InputEdgeItem: FC<NodeProps<Node>> = ({ node }) => {
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
                <Heading fontSize="2xl">Input {node.index}</Heading>
            </Box>
            <Box px={3} py={2} width="full">
                <SimpleGrid columns={{ base: 1 }}>
                    <InputContent
                        showPagination={false}
                        items={[{ node }]}
                        label={
                            <Text as="span" fontWeight="bold" fontSize="large">
                                Payload
                            </Text>
                        }
                    />
                    <InputContent
                        count={node.notices.totalCount}
                        items={node.notices.edges}
                        label="Notice"
                    />

                    <InputContent
                        count={node.reports.totalCount}
                        items={node.reports.edges}
                        label="Report"
                    />

                    <InputContent
                        count={node.vouchers.totalCount}
                        items={node.vouchers.edges}
                        label="Voucher"
                    />
                </SimpleGrid>
            </Box>
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
    const [inputEdge] = useInputEdgeQuery({
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
                        title="Error fetching Dapp information!"
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
                    {inputEdge.data && (
                        <>
                            {inputEdge.data.inputs.edges.length > 0 ? (
                                <>
                                    {inputEdge.data.inputs.edges.map((edge) => (
                                        <InputEdgeItem
                                            node={edge.node}
                                            key={edge.cursor}
                                        />
                                    ))}
                                </>
                            ) : (
                                <Text textAlign="center">
                                    Looks like there are no inputs yet...
                                </Text>
                            )}
                        </>
                    )}
                </SimpleGrid>
            </Box>
        </>
    );
};
