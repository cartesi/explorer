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
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useBlockNumber } from '../services/eth';
import { confirmations } from '../utils/networks';
import { ContractTransaction } from 'ethers';

const { Step } = Steps;

interface WaitingConfirmationsProps {
    transaction?: Promise<ContractTransaction>;
}

const WaitingConfirmations = (props: WaitingConfirmationsProps) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [currentTransaction, setCurrentTransaction] = useState<ContractTransaction>(null);

    const blockNumber = useBlockNumber();
    const [countBlockNumber, setCountBlockNumber] = useState<boolean>(false);

    const [confirmation, setConfirmation] = useState<number>(1);
    const [currentConfirmation, setCurrentConfirmation] = useState<number>(0);
    const [step, setStep] = useState<number>(0);

    props.transaction.then(tx => {
        setCurrentTransaction(tx);
    })

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
                });
            } else if (!currentTransaction) {
                setStep(0);
            }
        } catch (e) {
            // TODO: show error in component
        }
    }, [currentTransaction]);

    return (
        <>
            <Steps current={step}>
                <Step
                    title="Sending transaction"
                    icon={step === 0 ? <LoadingOutlined /> : null}
                />
                <Step
                    title="Confirming transaction"
                    subTitle={`Confirmed ${currentConfirmation}/${confirmation}`}
                    description="Waiting for confirmations"
                    icon={step === 1 ? <LoadingOutlined /> : null}
                />
            </Steps>
        </>
    );
};

export default WaitingConfirmations;
