// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { buildConfig, checkNetwork } from '../src/useOnboard';
import { networks } from '@explorer/utils';
import { UnsupportedNetworkError } from '../src';

describe('useOnBoard', () => {
    it('should build config with correct chains', () => {
        const chainIds = Object.keys(networks)
            .slice(0, 2)
            .map((key) => `0x${Number(key).toString(16)}`);
        const config = buildConfig(false, chainIds);

        expect(config.chains.length).toBe(chainIds.length);
        config.chains.forEach((chain) => {
            expect(chainIds.includes(chain.id.toString(16))).toBe(true);
        });
    });

    it('should build config with correct appMetadata', () => {
        const chainIds = Object.keys(networks).map(
            (key) => `0x${Number(key).toString(16)}`
        );
        const appMetadata: Record<string, string> = {
            name: 'Cartesi Explorer App',
            description: 'A place where you can stake CTSI and much more...',
        };
        const config = buildConfig(false, chainIds, appMetadata);

        expect(config.appMetadata?.name).toBe(appMetadata.name);
        Object.keys(appMetadata).forEach((appMetadataKey) => {
            expect(
                (config.appMetadata as unknown as Record<string, string>)?.[
                    appMetadataKey
                ]
            ).toBe(appMetadata[appMetadataKey]);
        });
    });

    it('should generate error when unsupported network is selected', () => {
        const [firstNetwork] = Object.keys(networks).map(Number);
        const chainIds = Object.keys(networks).slice(1, 3).map(Number);
        const error = checkNetwork(firstNetwork, chainIds);

        expect(error instanceof UnsupportedNetworkError).toBe(true);
    });

    it('should not generate error when supported network is selected', () => {
        const [firstNetwork] = Object.keys(networks).map(Number);
        const chainIds = Object.keys(networks).slice(0, 2).map(Number);
        const error = checkNetwork(firstNetwork, chainIds);

        expect(error).toBe(null);
    });
});
