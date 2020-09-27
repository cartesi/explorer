import React, { useEffect, useState } from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const WaitingConfirmations = ({ current, limit }) => {
    return (
        <>
            <Steps current={1} percent={current * 100 / limit}>
                <Step title="Sending Transaction" />
                <Step title="Confirming Transaction" subTitle={`Confirmed ${current}/${limit}`} description="Waiting for Confirmations" />
                <Step title="Done" />
            </Steps>
        </>
    )
}

export default WaitingConfirmations;
