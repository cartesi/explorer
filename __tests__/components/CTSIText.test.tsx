import { Text } from '@chakra-ui/react';
import { render, screen, cleanup } from '@testing-library/react';
import { FaIcons } from 'react-icons/fa';
import CTSIText from '../../src/components/CTSIText';

describe('CTSI Text component', () => {
    afterEach(() => cleanup());

    it('Should render the formatted amount of CTSI', () => {
        render(<CTSIText value="5000100000000000000000000" />);

        expect(screen.getByText('5,000,100')).toBeInTheDocument();
    });

    it('Should render the text and the formatted CTSI amount', () => {
        render(
            <CTSIText
                value="5000100000000000000000000"
                options={{ maximumFractionDigits: 2 }}
            >
                <Text>Wallet Balance</Text>
            </CTSIText>
        );

        expect(screen.getByText('Wallet Balance')).toBeInTheDocument();
        expect(screen.getByText('5,000,100')).toBeInTheDocument();
        expect(screen.getByText('CTSI')).toBeInTheDocument();
    });

    it('Should render an icon with the formatted CTSI amount', () => {
        const { container } = render(
            <CTSIText
                value="5000100000000000000000000"
                options={{ maximumFractionDigits: 2 }}
                icon={FaIcons}
            >
                <Text>Staked Balance</Text>
            </CTSIText>
        );
        expect(container.querySelector('svg > path')).toBeInTheDocument();
        expect(screen.getByText('Staked Balance')).toBeInTheDocument();
        expect(screen.getByText('5,000,100')).toBeInTheDocument();
        expect(screen.getByText('CTSI')).toBeInTheDocument();
    });
});
