// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { atom } from 'jotai';
import { isEmpty } from 'lodash/fp';
import { StakingPoolSort } from '../../graphql/models';
import { NodeInfo, PoolInfo } from './interfaces';

// Pool related atoms data and derivations
export const poolSortByAtom = atom<StakingPoolSort>('commissionPercentage');
export const poolDataFetchingAtom = atom<boolean>(false);
export const poolInfoListAtom = atom<PoolInfo[]>([]);
export const hasPoolsAtom = atom<boolean>(
    (get) => !isEmpty(get(poolInfoListAtom))
);

// Node related atoms data and derivations
export const nodeInfoListAtom = atom<NodeInfo[]>([]);
export const nodeInfoFetchingAtom = atom<boolean>(false);
export const hasPrivateNodeAtom = atom<boolean>(
    (get) => !isEmpty(get(nodeInfoListAtom))
);
// Read-only derived state for node-info
export const nodeInfoDataAtom = atom<{ list: NodeInfo[]; loading: boolean }>(
    (get) => ({
        list: get(nodeInfoListAtom),
        loading: get(nodeInfoFetchingAtom),
    })
);
