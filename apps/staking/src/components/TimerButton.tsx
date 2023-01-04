import React, { FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { isString } from 'lodash';
import { useTimeLeft } from '../utils/react';

export interface TimerButtonProps extends ButtonProps {
    remainingTime: number;
}

const TimerButton: FC<TimerButtonProps> = (props) => {
    const { children, remainingTime, ...restProps } = props;
    const time = useTimeLeft(remainingTime, 2, true, 'hh:mm:ss');

    return (
        <Button {...restProps} data-testid="timer-button">
            {children} {isString(time) && `(${time})`}
        </Button>
    );
};

export default TimerButton;
