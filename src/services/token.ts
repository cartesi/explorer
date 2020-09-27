// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { CartesiToken } from '../contracts/CartesiToken';
import { CartesiTokenFactory } from '../contracts/CartesiTokenFactory';
import { networks, confirmations } from '../utils/networks';
import { BigNumber, BigNumberish, ContractTransaction } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';

export const useCartesiToken = (account: string, spender: string, blockNumber: number) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [confirmation, setConfirmation] = useState<number>(1);

    const [currentTransaction, setCurrentTransaction] = useState<ContractTransaction>(null);
    const [currentConfirmation, setCurrentConfirmation] = useState<number>(0);

    const [token, setToken] = useState<CartesiToken>();
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the CartesiToken, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            const tokenArtifact = require(`@cartesi/token/deployments/${network}/CartesiToken.json`);
            const address =
                tokenArtifact?.address ||
                tokenArtifact?.networks[chainId]?.address;
            setConfirmation(confirmations[chainId] ? confirmations[chainId] : 1);
            if (address) {
                console.log(
                    `Attaching CartesiToken to address '${address}' deployed at network '${chainId}'`
                );
                setToken(
                    CartesiTokenFactory.connect(address, library.getSigner())
                );
            } else {
                setError(`CartesiToken not deployed at network '${chainId}'`);
            }
        }
    }, [library, chainId]);

    // balances
    useEffect(() => {
        if (token && account) {
            token.balanceOf(account).then(setBalance);
            if (spender) {
                token.allowance(account, spender).then(setAllowance);
            }
        }
    }, [token, account, spender, blockNumber]);

    useEffect(() => {
        if (library && currentTransaction) {
            library.on('block', blockHandler)

            // wait for confirmation
            currentTransaction.wait(confirmation)
                .then(receipt => {
                    library.removeListener('block', blockHandler);

                    setSubmitting(false);
                    setCurrentTransaction(null);
                });
        }
    }, [currentTransaction]);

    const blockHandler = async (blknum) => {
        if (library && currentTransaction) {
            const receipt = await library.getTransactionReceipt(currentTransaction.hash);
            if (receipt) {
                setCurrentConfirmation(receipt.confirmations);
            }
        }
    };

    const approve = async (spender: string, amount: BigNumberish) => {
        if (token) {
            try {
                setError('');
                setSubmitting(true);
                setCurrentConfirmation(0);

                // send transaction
                const transaction = await token.approve(spender, amount);
                setCurrentTransaction(transaction);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
                setCurrentTransaction(null);
            }
        }
    };

    const parseCTSI = (amount: BigNumberish): BigNumber => {
        return parseUnits(amount.toString(), 18);
    }

    const formatCTSI = (amount: BigNumberish): string => {
        return formatUnits(amount, 18);
    }

    return {
        allowance,
        balance,
        error,
        submitting,
        confirmation,
        currentConfirmation,
        approve,
        parseCTSI,
        formatCTSI
    };
};
