import {
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../utils/staticGeneration';
import { FC } from 'react';
import StakePool from '../../../components/stake/StakePool';
import { notFound } from 'next/navigation';

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
        title: `Cartesi pool info - ${data.formattedAddress}`,
        description: `Cartesi pool info - ${data.formattedAddress}`,
    };
}

const StakePoolPage: FC<StakePoolPageProps> = async (props) => {
    const params = await props.params;
    const data = await getENSStaticProps({ params });

    if (data.notFound) {
        notFound();
    }

    return <StakePool />;
};

export default StakePoolPage;
