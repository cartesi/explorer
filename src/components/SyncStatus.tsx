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

const threshold = 25;

const SyncStatus = () => {
    const blockNumber = useBlockNumber();
    const meta = useMeta();

    const issues =
        meta &&
        blockNumber > 0 &&
        (meta.hasIndexingErrors ||
            Math.abs(meta.block.number - blockNumber) > threshold);

    return issues ? (
        <div className="layout-content-issue">
            <i className="fas fa-exclamation-triangle"></i> Synchronization
            issue between backend data and blockchain data. Blocks may be
            appearing slowly.
        </div>
    ) : (
        <div />
    );
};

export default SyncStatus;
