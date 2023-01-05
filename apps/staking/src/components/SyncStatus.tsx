// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useBlockNumber } from '../services/eth';
import useMeta from '../graphql/hooks/useMeta';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
} from '@chakra-ui/alert';
import { Box } from '@chakra-ui/layout';
import { useWallet } from '@explorer/wallet';
import { Network } from '../utils/networks';
import { includes } from 'lodash/fp';

const threshold = 25;
const excludedNetworks = [Network.ARBITRUM_GOERLI];

const SyncStatus = () => {
    // read block number from metamask
    const blockNumber = useBlockNumber();
    const { chainId, active } = useWallet();

    // read block number from thegraph
    const meta = useMeta();

    // we have issues if thegraph says we have issues, or the block offset is more than `threshold (25)`
    const issues =
        meta &&
        blockNumber > 0 &&
        (meta.hasIndexingErrors ||
            Math.abs(meta.block.number - blockNumber) > threshold);
    const title = meta?.hasIndexingErrors
        ? 'Indexing errors'
        : 'Syncronization delay';
    const delay = blockNumber - meta?.block?.number;
    const ignoreIssues = includes(chainId, excludedNetworks);

    return issues && !ignoreIssues ? (
        <Box px="6vw" bg="gray.900">
            <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{title}</AlertTitle>
                <AlertDescription>
                    Synchronization issue between backend data and blockchain
                    data. Backend data delayed by {delay} blocks.
                </AlertDescription>
            </Alert>
        </Box>
    ) : (
        <div />
    );
};

export default SyncStatus;
