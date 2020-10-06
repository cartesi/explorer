// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Steps, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useBlockNumber } from '../services/eth';
import { confirmations } from '../utils/networks';
import { ContractTransaction } from 'ethers';

const { Step } = Steps;

enum ShowStoppers {
    SHOW,
    FADING_OUT,
    HIDE,
}

interface WaitingConfirmationsProps {
    transaction?: Promise<ContractTransaction>;
    confirmationDone?: (error: string) => void;
    error?: string;
}

const WaitingConfirmations = (props: WaitingConfirmationsProps) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [currentTransaction, setCurrentTransaction] = useState<
        ContractTransaction
    >(null);

    const blockNumber = useBlockNumber();
    const [countBlockNumber, setCountBlockNumber] = useState<boolean>(false);

    const [confirmation, setConfirmation] = useState<number>(1);
    const [currentConfirmation, setCurrentConfirmation] = useState<number>(0);
    const [step, setStep] = useState<number>(0);
    const [showMe, setShowMe] = useState<ShowStoppers>(ShowStoppers.HIDE);

    const [error, setError] = useState<string>();

    const hideMe = () => {
        setShowMe(ShowStoppers.FADING_OUT);

        setTimeout(
            () => {
                setShowMe(ShowStoppers.HIDE);

                props.confirmationDone(null);
            },
            error ? 5000 : 2000
        );
    };

    useEffect(() => {
        if (props.transaction) {
            setShowMe(ShowStoppers.SHOW);
            setStep(0);
            setCurrentConfirmation(0);

            props.transaction
                .then((tx) => {
                    setCurrentTransaction(tx);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    }, [props.transaction]);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    useEffect(() => {
        if (error) hideMe();
    }, [error]);

    // number of expected confirmations depend on chainId
    useEffect(() => {
        if (library && chainId) {
            setConfirmation(
                confirmations[chainId] ? confirmations[chainId] : 1
            );
        }
    }, [library, chainId]);

    useEffect(() => {
        if (library && currentTransaction && countBlockNumber) {
            library
                .getTransactionReceipt(currentTransaction.hash)
                .then((receipt) => {
                    setCurrentConfirmation(receipt.confirmations);
                    if (receipt.confirmations >= confirmation) {
                        setStep(step + 1);
                    }
                });
        }
    }, [library, chainId, blockNumber, currentTransaction]);

    useEffect(() => {
        try {
            if (library && currentTransaction) {
                if (!step) setStep(1);

                setCountBlockNumber(true);
                setCurrentConfirmation(0);

                // wait for confirmation
                currentTransaction.wait(confirmation).then((receipt) => {
                    setCountBlockNumber(false);

                    hideMe();
                });
            } else if (!currentTransaction) {
                setStep(0);
            }
        } catch (e) {
            // TODO: show error in component
            setError(e.message);
        }
    }, [currentTransaction]);

    return (
        <>
            <Steps
                current={step}
                status={error ? 'error' : 'process'}
                style={
                    showMe === ShowStoppers.SHOW
                        ? { margin: '40px 0 20px', opacity: 1 }
                        : showMe === ShowStoppers.FADING_OUT
                        ? {
                              margin: '40px 0 20px',
                              opacity: 0,
                              transition: `opacity ${error ? 10 : 3}s ease-in`,
                          }
                        : { display: 'none' }
                }
            >
                <Step
                    title="Sending transaction"
                    icon={step === 0 && !error ? <LoadingOutlined /> : null}
                    description={error ? error : null}
                />
                <Step
                    title="Confirming transaction"
                    subTitle={`Confirmed ${currentConfirmation}/${confirmation}`}
                    description="Waiting for confirmations"
                    icon={step === 1 && !error ? <LoadingOutlined /> : null}
                />
            </Steps>
        </>
    );
};

export default WaitingConfirmations;
