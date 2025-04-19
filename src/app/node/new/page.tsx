import NewNode from '../../../components/node/NewNode';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create a Cartesi node',
    description: 'Create a Cartesi node',
};

export default function NewNodePage() {
    return <NewNode />;
}
