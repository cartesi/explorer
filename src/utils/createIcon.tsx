import {
    FC,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    SVGProps,
} from 'react';

export interface CreateIconProps extends Omit<SVGProps<SVGGElement>, 'path'> {
    viewBox: string;
    path: ReactNode;
    defaultProps?: {
        width: string;
        height: string;
    };
}

export const createIcon = (props: CreateIconProps): SVGGElement => {
    const { viewBox, path, defaultProps = {} } = props;

    return (
        <svg
            viewBox={viewBox}
            {...defaultProps}
            xmlns="http://www.w3.org/2000/svg"
        >
            {path}
        </svg>
    );
};
