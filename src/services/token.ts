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
import { networks } from '../utils/networks';
import { BigNumber, BigNumberish } from 'ethers';
import { parseCTSI } from '../utils/token';

export const useCartesiToken = () => {
    const { provider, chain } = useContext(Web3Context);
    const [cartesiToken, setCartesiToken] = useState<CartesiToken>();
    const [address, setAddress] = useState<string>(null);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the CartesiToken, asynchronously
    useEffect(() => {
        if (provider && chain) {
            const network = networks[chain.chainId];
            const tokenArtifact = require(`@cartesi/token/deployments/${network}/CartesiToken.json`);
            const address = tokenArtifact?.address ||
                tokenArtifact?.networks[chain.chainId]?.address;
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

    const balanceOf = async (address: string): Promise<BigNumber> => {
        if (cartesiToken) {
            try {
                setError('');
                return cartesiToken.balanceOf(address);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
        if (cartesiToken) {
            try {
                setError('');
                return cartesiToken.allowance(owner, spender);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const approve = async (spender: string, amount: BigNumberish) => {
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
