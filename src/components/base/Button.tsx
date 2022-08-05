import { FC } from 'react';
import { Button as BaseButton, ButtonProps } from '@chakra-ui/react';
import Countdown from 'react-countdown';

export const Button: FC<ButtonProps> = (props) => {
    const { size = 'md', ...restProps } = props;
    const fontSize = size === 'lg' ? 16 : size === 'md' ? 14 : 12;

    return <BaseButton fontSize={fontSize} {...restProps} />;
};

export interface TimerButtonProps extends ButtonProps {
    date: number;
}

export const TimerButton: FC<TimerButtonProps> = (props) => {
    const { children, date, ...restProps } = props;

    return (
        <Button {...restProps}>
            {children}
            <Countdown
                date={date}
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
