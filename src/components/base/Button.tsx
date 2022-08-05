import { FC } from 'react';
import { Button as BaseButton, ButtonProps } from '@chakra-ui/react';
import Countdown from 'react-countdown';

export const Button: FC<ButtonProps> = (props) => {
    const { size = 'md', ...restProps } = props;
    const fontSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;
    const padding =
        size === 'lg' ? '16px 50px' : size === 'md' ? '16px 30px' : '10px';

    return (
        <BaseButton
            fontSize={fontSize}
            p={padding}
            height="auto"
            minHeight="auto"
            {...restProps}
        />
    );
};

export interface TimerButtonProps extends ButtonProps {
    remainingTime: number;
}

export const TimerButton: FC<TimerButtonProps> = (props) => {
    const { children, remainingTime, ...restProps } = props;

    return (
        <Button {...restProps}>
            {children}
            <Countdown
                date={remainingTime}
                intervalDelay={0}
                precision={3}
                renderer={({
                    formatted: { hours, minutes, seconds },
                    completed,
                }) => {
                    if (completed) {
                        return '';
                    } else {
                        return (
                            <>
                                {' ('}
                                <span>
                                    {hours}:{minutes}:{seconds}
                                </span>
                                {')'}
                            </>
                        );
                    }
                }}
            />
        </Button>
    );
};
