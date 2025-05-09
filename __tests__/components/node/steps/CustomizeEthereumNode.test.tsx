import { fireEvent, render, screen } from '@testing-library/react';
import { useBreakpointValue } from '@chakra-ui/react';
import CustomizeEthereumNode from '../../../../src/components/node/steps/CustomizeEthereumNode';
import { IStep } from '../../../../src/components/StepGroup';
import { withChakraTheme } from '../../../test-utilities';

jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: jest.fn(),
    };
});

const mockUseBreakpointValue = useBreakpointValue as jest.MockedFunction<
    typeof useBreakpointValue
>;

const Component = withChakraTheme<IStep>(CustomizeEthereumNode);

describe('Customize Ethereum Node Step component', () => {
    beforeEach(() => {
        mockUseBreakpointValue.mockReturnValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when not in focus', () => {
        it('Should only display the number, the title and the subtitle when not in focus', () => {
            render(<Component stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(
                screen.getByText('Set up Ethereum Node')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Cartesi node connects to the Ethereum network through a standard gateway'
                )
            ).toBeInTheDocument();

            expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
        });
    });

    describe('when in focus', () => {
        it('should render the body content and action button', () => {
            render(<Component inFocus stepNumber={1} />);

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(
                screen.getByText('Set up Ethereum Node')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Cartesi node connects to the Ethereum network through a standard gateway'
                )
            ).toBeInTheDocument();

            expect(screen.getByText('Ethereum node')).toBeInTheDocument();
            expect(
                screen.getByText(
                    `The node works with any standard JSON-RPC Ethereum provider. It's important to use a stable and reliable provider.`
                )
            ).toBeInTheDocument();

            expect(screen.getByText('Ethereum Gateway')).toBeInTheDocument();

            expect(screen.getByText('1. Infura')).toBeInTheDocument();
            expect(screen.getByText('2. Alchemy')).toBeInTheDocument();
            expect(
                screen.getByText('(Recommended third party)')
            ).toBeInTheDocument();
            expect(screen.getByText('Relatively stable.')).toBeInTheDocument();
            expect(
                screen.getByText('Have to register and setup in advance')
            ).toBeInTheDocument();
            expect(screen.getByText('NEXT')).toBeInTheDocument();
        });
    });

    describe('Actions', () => {
        it('should call the onComplete callback when clicking the NEXT button', () => {
            const onComplete = jest.fn();
            render(
                <Component inFocus stepNumber={1} onComplete={onComplete} />
            );

            fireEvent.click(screen.getByText('NEXT'));

            expect(onComplete).toHaveBeenCalled();
        });
    });
});
