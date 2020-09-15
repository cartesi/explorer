// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useContext, useState, useEffect } from 'react';
import Web3Context from '../components/Web3Context';
import { CartesiToken } from '../contracts/CartesiToken';
import { CartesiTokenFactory } from '../contracts/CartesiTokenFactory';
import { formatCTSI, parseCTSI } from '../utils/token';

type AbiMap = Record<number, any>;
const tokenArtifact: AbiMap = {
    // 1: require('@cartesi/token/build/contracts/CartesiToken.json'),
    31337: require('@cartesi/token/build/contracts/CartesiToken.json'),
    // 31337: require('@cartesi/pos/deployments/localhost/CartesiToken.json'),
};

export const useCartesiToken = () => {
    const { provider, chain } = useContext(Web3Context);
    const [cartesiToken, setCartesiToken] = useState<CartesiToken>();
    const [address, setAddress] = useState<string>(null);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the CartesiToken, asynchronously
    useEffect(() => {
        if (provider && chain) {
            const address =
                tokenArtifact[chain.chainId]?.address ||
                tokenArtifact[chain.chainId]?.networks[chain.chainId]?.address;
            if (!address) {
                setError(
                    `CartesiToken not deployed at network '${chain.name}'`
                );
                return;
            }
            console.log(
                `Attaching CartesiToken to address '${address}' deployed at network '${chain.name}'`
            );
            setCartesiToken(
                CartesiTokenFactory.connect(address, provider.getSigner())
            );

            setAddress(address);
        }
    }, [provider, chain]);

    const balanceOf = async (address: string) => {
        if (cartesiToken) {
            try {
                setError('');

                const result = await cartesiToken.balanceOf(address);
                return formatCTSI(result);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const allowance = async (owner: string, spender: string) => {
        if (cartesiToken) {
            try {
                setError('');

                const result = await cartesiToken.allowance(owner, spender);
                return formatCTSI(result);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const approve = async (spender: string, amount: number) => {
        if (cartesiToken) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await cartesiToken.approve(spender, parseCTSI(amount));

                // wait for confirmation
                const receipt = await transaction.wait(1);

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    return {
        cartesiToken,
        submitting,
        error,
        address,
        balanceOf,
        allowance,
        approve,
    };
};
