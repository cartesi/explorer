// Copyright (C) 2021 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { AlertRootProps } from '@chakra-ui/react';
import { FunctionComponent, useEffect, useState } from 'react';
import {
    ITransactionInfoBannerProps,
    TransactionInfoBanner,
} from './stake/TransactionInfoBanner';

type AlertStatus = AlertRootProps['status'];

/**
 * HOC to modify the default behaviour of TransactionInfoBanner
 * when a transaction has an error.
 */
const withErrorStatusAs = (
    alertStatus: AlertStatus,
    Component: FunctionComponent<ITransactionInfoBannerProps>
) => {
    return (props: ITransactionInfoBannerProps) => {
        const { transaction } = props;
        const [bannerProps, setBannerProps] = useState<{
            status?: AlertStatus;
        }>({});

        useEffect(() => {
            const newProps: { status?: AlertStatus } = transaction?.error
                ? transaction.acknowledged
                    ? {}
                    : { status: alertStatus }
                : {};

            setBannerProps(newProps);
        }, [transaction]);

        return <Component {...props} {...bannerProps} />;
    };
};

const TransactionBanner = withErrorStatusAs('warning', TransactionInfoBanner);

export default TransactionBanner;
