// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    allPass,
    anyPass,
    complement,
    cond,
    isEmpty,
    isEqual,
    pipe,
    prop,
    propEq,
    T,
} from 'lodash/fp';
import { useEffect, useMemo, useState } from 'react';
import {
    BaseError,
    ContractFunctionRevertedError,
    Hash,
    PublicClient,
    publicActions,
    TransactionReceipt,
} from 'viem';
import { useWallet } from '../components/wallet';
import { confirmations } from '../utils/networks';

/** The transaction as submitted by the wallet. */
export interface SubmittedTransaction {
    hash: Hash;
    chainId: number;
}

export class Transaction<R> {
    submitting: boolean;
    acknowledged: boolean;
    transaction?: SubmittedTransaction;
    error?: string;
    receipt?: TransactionReceipt;
    /** Confirmations waited for before `receipt` was set (0 until then). */
    confirmations: number;
    set: (transaction: Promise<Hash>) => void;
    ack: () => void;
    result?: R;
    /**
     * Transaction is considered ongoing when is submitting, or
     * the transaction was submitted to the blockchain and it is waiting for the receipt (based on confirmations)
     * to be set.
     */
    isOngoing?: boolean;
    state?: TransactionState;
}

const isNotEmpty = complement(isEmpty);

const isOngoing = anyPass<TransactionState>([
    isEqual('submitting'),
    isEqual('waiting_confirmation'),
]);

type TransactionState =
    | 'submitting'
    | 'waiting_confirmation'
    | 'confirmed'
    | 'errored'
    | 'acknowledged'
    | 'unexpected';

const deriveStateFrom = cond<Transaction<any>, TransactionState>([
    [propEq('acknowledged', true), () => 'acknowledged'],
    [pipe([prop('error'), isNotEmpty]), () => 'errored'],
    [propEq('submitting', true), () => 'submitting'],
    [
        allPass([
            pipe(prop('transaction'), isNotEmpty),
            pipe(prop('receipt'), isEmpty),
        ]),
        () => 'waiting_confirmation',
    ],
    [
        allPass([
            pipe(prop('transaction'), isNotEmpty),
            pipe(prop('receipt'), isNotEmpty),
        ]),
        () => 'confirmed',
    ],
    [T, () => 'unexpected'],
]);

/**
 * Revert reason when the contract gave one, else viem's short message
 * (e.g. "User rejected the request."), else the error's message.
 */
export function extractErrorMessage(error: unknown): string {
    if (error instanceof BaseError) {
        const reverted = error.walk(
            (e) => e instanceof ContractFunctionRevertedError,
        ) as ContractFunctionRevertedError | null;
        return reverted?.reason ?? reverted?.shortMessage ?? error.shortMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

type ReceiptClient = Pick<PublicClient, 'waitForTransactionReceipt'>;

export function useTransaction<R>(
    resultResolver?: (receipt: TransactionReceipt) => R,
): Transaction<R> {
    const { chainId, publicClient, walletClient, isGnosisSafe } = useWallet();
    // Inside a Safe App the wallet returns the Safe transaction hash, which only
    // the Safe provider (the wallet client's transport) can map to the receipt
    // once the multisig executes it. Poll through it in that case.
    const receiptClient = useMemo<ReceiptClient | undefined>(
        () =>
            isGnosisSafe && walletClient
                ? (walletClient.extend(
                      publicActions,
                  ) as unknown as ReceiptClient)
                : publicClient,
        [isGnosisSafe, walletClient, publicClient],
    );
    const [acknowledged, setAcknowledged] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>();
    const [transaction, setTransaction] = useState<SubmittedTransaction>();
    const [receipt, setReceipt] = useState<TransactionReceipt>();
    const [confirmed, setConfirmed] = useState(0);
    const [result, setResult] = useState<R>();

    const set = (pending: Promise<Hash>) => {
        setAcknowledged(false);
        setSubmitting(true);
        setReceipt(undefined);
        setConfirmed(0);
        setResult(undefined);
        setError(undefined);
        pending
            .then((hash) => setTransaction({ hash, chainId }))
            .catch((e) => {
                setError(extractErrorMessage(e));
            })
            .finally(() => setSubmitting(false));
    };
    const ack = () => setAcknowledged(true);

    useEffect(() => {
        const update = async () => {
            setError(null);
            try {
                // wait for confirmations, with no deadline (a Safe can take
                // hours to execute). The Safe provider answers
                // eth_getTransactionByHash with a placeholder, so viem's
                // replaced-transaction check is pointless there.
                const required = confirmations[transaction.chainId] ?? 1;
                const receipt = await receiptClient.waitForTransactionReceipt({
                    hash: transaction.hash,
                    confirmations: required,
                    timeout: 0,
                    checkReplacement: !isGnosisSafe,
                });
                if (receipt.status === 'reverted') {
                    throw new Error('Transaction reverted');
                }
                setReceipt(receipt);
                setConfirmed(required);

                // resolve result from receipt (events?)
                if (resultResolver) {
                    setResult(resultResolver(receipt));
                }
            } catch (e) {
                setError(extractErrorMessage(e));
            }
        };
        if (transaction && receiptClient) {
            update();
        }
    }, [transaction]);

    const t = {
        submitting,
        acknowledged,
        transaction,
        error,
        receipt,
        confirmations: confirmed,
        set,
        ack,
        result,
    };

    const state = deriveStateFrom(t);

    return {
        ...t,
        state,
        isOngoing: isOngoing(state),
    };
}
