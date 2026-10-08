import { FC } from 'react';
import StakePool from '../../../components/stake/StakePool';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';
import { getFormattedEnsName } from '../../../services/server/utils';

interface StakePoolPageProps {
    params: Promise<{ pool: string }>;
}

export async function generateMetadata(props: StakePoolPageProps) {
    const params = await props.params;
    const address = params.pool;

    if (!isAddress(address, { strict: false })) {
        notFound();
    }

    const formattedAddress = await getFormattedEnsName(address);

    return {
        title: `Cartesi pool info - ${formattedAddress}`,
        description: `Cartesi pool info - ${formattedAddress}`,
    };
}

const StakePoolPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!isAddress(params.pool, { strict: false })) {
        notFound();
    }

    return <StakePool />;
};

export default StakePoolPage;
