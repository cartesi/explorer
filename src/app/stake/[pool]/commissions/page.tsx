import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolCommissions from '../../../../components/stake/StakePoolCommissions';
import { isAddress } from 'viem';
import { getFormattedEnsName } from '../../../../services/server/utils';

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
        title: `Pool commissions - ${formattedAddress}`,
        description: `Pool commissions - ${formattedAddress}`,
    };
}

const StakePoolCommissionsPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;

    if (!isAddress(params.pool, { strict: false })) {
        notFound();
    }

    return <StakePoolCommissions />;
};

export default StakePoolCommissionsPage;
