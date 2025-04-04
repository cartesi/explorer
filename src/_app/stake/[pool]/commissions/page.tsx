import {
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../../utils/staticGeneration';
import { FC } from 'react';
import { notFound } from 'next/navigation';
import StakePoolCommissions from '../../../../components/stake/StakePoolCommissions';

export const revalidate = 86400;

export async function generateStaticParams() {
    return getPoolsStaticPaths();
}

interface StakePoolPageProps {
    params: Promise<{ pool: string }>;
}

export async function generateMetadata(props: StakePoolPageProps) {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    return {
        title: `Pool commissions - ${data.formattedAddress}`,
        description: `Pool commissions - ${data.formattedAddress}`,
    };
}

const StakePoolCommissionsPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    if (data.notFound) {
        notFound();
    }

    return <StakePoolCommissions />;
};

export default StakePoolCommissionsPage;
