import NewPool from '../../../components/pools/NewPool';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create a Cartesi staking pool',
    description: 'Create a Cartesi staking pool',
};

export default function NewPoolPage() {
    return <NewPool />;
}
