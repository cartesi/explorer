// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TypedEvent } from '@cartesi/rollups/dist/src/types/common';
import { ApplicationCreatedEvent } from '@cartesi/rollups/dist/src/types/contracts/dapp/CartesiDAppFactory';
import { InputAddedEvent as BoxInputAddedEvent } from '@cartesi/rollups/dist/src/types/contracts/inputs/InputBox';
import { utils } from 'ethers';
import { mock } from 'jest-mock-extended';
import { useInputBoxMeta } from '../../src/services/contracts/inputBox';
import { useRollupsFactory } from '../../src/services/useRollupsFactory';
import { ReturnOf } from '../test-utilities';

const typedEvent = mock<TypedEvent>();
type UseRollupFactoryReturn = ReturnOf<typeof useRollupsFactory>;
type UseInputBoxMetaReturn = ReturnOf<typeof useInputBoxMeta>;
type Block = Awaited<ReturnOf<typeof typedEvent.getBlock>>;

// Helpers
const DEFAULT_TIMESTAMP = 1643576268000;
function createBlock(timestamp: number) {
    const block = mock<Block>();
    block.timestamp = timestamp;
    return block;
}

export function buildBoxInputAddedEvent() {
    const evt = mock<BoxInputAddedEvent>();
    const block = createBlock(DEFAULT_TIMESTAMP);
    evt.address = utils.hexlify(300);
    evt.getBlock.mockResolvedValue(block);
    return evt;
}

export function buildApplicationCreatedEvent() {
    const evt = mock<ApplicationCreatedEvent>();
    const block = createBlock(DEFAULT_TIMESTAMP);
    evt.address = utils.hexlify(100);
    evt.args = {
        ...evt.args,
        application: evt.address,
    };
    evt.getBlock.mockResolvedValue(block);
    return evt;
}

function buildMockInputBoxMeta() {
    return mock<UseInputBoxMetaReturn>();
}

function buildRollupsFactory() {
    return mock<UseRollupFactoryReturn>();
}

/**
 * Builder Functions
 * with the expected content from above helpers to have types defined correctly.
 * Also, this functions when created should fill the bare minimum for things to work in an
 * optimistic perspective trying to avoid undefined / null values where applicable.
 */

function buildUseInputBoxMetaReturn(): UseInputBoxMetaReturn {
    const mock = buildMockInputBoxMeta();
    mock.getInputs.mockResolvedValue([
        buildBoxInputAddedEvent(),
        buildBoxInputAddedEvent(),
    ]);

    return mock;
}

function buildUseRollupFactoryReturn(): UseRollupFactoryReturn {
    const mock = buildRollupsFactory();
    mock.queryFilter.mockResolvedValue(Promise.resolve([]));
    mock.filters = {
        ...mock.filters,
        ApplicationCreated: jest.fn(),
    };
    return mock;
}

export { buildUseRollupFactoryReturn, buildUseInputBoxMetaReturn };
