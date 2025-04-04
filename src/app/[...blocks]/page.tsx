import Blocks from '../../components/block/Blocks';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cartesi Proof of Stake Blocks',
};

export default function BlocksPage() {
    return <Blocks />;
}
