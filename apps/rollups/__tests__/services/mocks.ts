// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { CartesiDAppFactory as V08Factory } from '@cartesi/rollups-0.8';
import { TypedEvent } from '@cartesi/rollups-0.8/dist/src/types/common';
import { ApplicationCreatedEvent } from '@cartesi/rollups-0.8/dist/src/types/contracts/CartesiDAppFactory';
import { InputAddedEvent } from '@cartesi/rollups-0.8/dist/src/types/contracts/facets/InputFacet';
import { InputAddedEvent as BoxInputAddedEvent } from '@cartesi/rollups/dist/src/types/contracts/inputs/InputBox';
import { utils } from 'ethers';
import { mock } from 'jest-mock-extended';
import { useInputBoxMeta } from '../../src/services/contracts/inputBox';
import { buildInputFacetMeta } from '../../src/services/contracts/inputFacet';
import {
    useRollupLegacyFactories,
    useRollupsFactory,
} from '../../src/services/useRollupsFactory';
import { ReturnOf } from '../test-utilities';

const typedEvent = mock<TypedEvent>();
type UseRollupFactoryReturn = ReturnOf<typeof useRollupsFactory>;
type UseRollupLegacyFactoriesReturn = ReturnOf<typeof useRollupLegacyFactories>;
type BuildInputFacetMetaReturn = ReturnOf<typeof buildInputFacetMeta>;
type UseInputBoxMetaReturn = ReturnOf<typeof useInputBoxMeta>;
type Block = Awaited<ReturnOf<typeof typedEvent.getBlock>>;

// Helpers
const DEFAULT_TIMESTAMP = 1643576268000;
function createBlock(timestamp: number) {
    const block = mock<Block>();
    block.timestamp = timestamp;
    return block;
}
export function buildInputAddedEvent() {
    const evt = mock<InputAddedEvent>();
    const block = createBlock(DEFAULT_TIMESTAMP);
    evt.address = utils.hexlify(200);
    evt.getBlock.mockResolvedValue(block);
    return evt;
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

function buildMockInputFacetMeta() {
    return mock<BuildInputFacetMetaReturn>();
}

function buildMockV08Factory() {
    return mock<V08Factory>();
}

function buildMockLegacyFactories() {
    return mock<UseRollupLegacyFactoriesReturn>();
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

function buildInputFacetMetaReturn() {
    const mock = buildMockInputFacetMeta();
    const inputAddedEventStub = buildInputAddedEvent();
    mock.getInputs.mockResolvedValue([inputAddedEventStub]);
    return mock;
}

function buildUseInputBoxMetaReturn(): UseInputBoxMetaReturn {
    const mock = buildMockInputBoxMeta();
    mock.getInputs.mockResolvedValue([
        buildBoxInputAddedEvent(),
        buildBoxInputAddedEvent(),
    ]);

    return mock;
}

function buildUseRollupLegacyFactoriesReturn(): UseRollupLegacyFactoriesReturn {
    const mock = buildMockLegacyFactories();
    mock.v08Factory = buildMockV08Factory();
    mock.v08Factory.queryFilter = jest.fn(() => Promise.resolve([]));
    mock.v08Factory.filters = {
        ...mock.v08Factory.filters,
        ApplicationCreated: jest.fn(),
    };
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

export {
    buildUseRollupLegacyFactoriesReturn,
    buildUseRollupFactoryReturn,
    buildInputFacetMetaReturn,
    buildUseInputBoxMetaReturn,
};
