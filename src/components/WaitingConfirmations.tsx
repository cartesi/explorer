import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Steps } from 'antd';
import { confirmations } from '../utils/networks';

import { TransactionContext } from '../components/TransactionContext';

const { Step } = Steps;

const WaitingConfirmations = () => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const {
        setContext,
        currentTransaction
    } = useContext(TransactionContext);

    const [confirmation, setConfirmation] = useState<number>(1);
    const [currentConfirmation, setCurrentConfirmation] = useState<number>(0);

    // create the Staking, asynchronously
    useEffect(() => {
        if (library && chainId) {
            setConfirmation(confirmations[chainId] ? confirmations[chainId] : 1);
        }
    }, [library, chainId]);

    useEffect(() => {
        try {
            if (library && currentTransaction) {
                library.on('block', blockHandler)
                setCurrentConfirmation(0);

                // wait for confirmation
                currentTransaction.wait(confirmation)
                    .then(receipt => {
                        library.removeListener('block', blockHandler);

                        setContext({
                            currentTransaction: null,
                            submitting: false,
                            error: null
                        });
                    });
            }
        } catch (e) {
            setContext({
                currentTransaction: null,
                error: e.message,
                submitting: false
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

    return (
        <>
            <Steps current={1} percent={currentConfirmation * 100 / confirmation}>
                <Step title="Sending Transaction" />
                <Step title="Confirming Transaction" subTitle={`Confirmed ${currentConfirmation}/${confirmation}`} description="Waiting for Confirmations" />
                <Step title="Done" />
            </Steps>
        </>
    )
}

export default WaitingConfirmations;
