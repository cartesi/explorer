// Copyright (C) 2022 Cartesi Pte. Ltd.
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { CombinedError } from '@urql/core';
import { Provider, createClient } from 'urql';
import {
    DApp,
    EpochItem,
    InputContent,
    Inputs,
    hexToJSON,
    transformPayload,
} from '../../../src/containers/rollups/DApp';
import { useDappQuery } from '../../../src/generated/graphql/rollups/0.9';
import { withChakraTheme } from '../../test-utilities';
const path = '../../../src/generated/graphql/rollups/0.9';
jest.mock(path, () => {
    const originalModule = jest.requireActual(path);
    return {
        __esModule: true,
        ...originalModule,
        useDappQuery: jest.fn(),
    };
});

const mockUseDappQuery = useDappQuery as jest.MockedFunction<
    typeof useDappQuery
>;

// Create a mock client
const mockClient = createClient({ url: '/graphql' });

const PAYLOAD_STRING = '0x496d616765206e6f74206c6f61646564';
const PAYLOAD_JSON =
    '0x7b227473223a2022323032322d31302d31392031323a34353a3037222c20227470223a20312c2022647363223a20224f7574206f6620726f757465222c202264697374616e6365223a20302e32322c2022637572725f636f6f726473223a205b35392e34313337373535393338353435352c2032342e38353330353531323233393538385d2c20226275735f6c696e65223a20223135222c202274726970223a202231353b3133222c202276616c7565223a2031302e38337d';

const InputContentComponent = withChakraTheme(InputContent);
const inputContentItems = [
    {
        cursor: '1',
        node: {
            id: '1',
            index: 0,
            payload: PAYLOAD_JSON,
        },
    },
    {
        cursor: '2',
        node: {
            id: '2',
            index: 1,
            payload: PAYLOAD_JSON,
        },
    },
];
const inputContentProps = {
    items: inputContentItems,
    label: 'Input content label',
};

const InputsComponent = withChakraTheme(Inputs);
const edge = {
    cursor: '2',
    node: {
        id: '1',
        index: 0,
        msgSender: '0x912d9dfa80c617e5e9ef4f43eca01a05cc2123e1',
        timestamp: new Date().getTime() / 1000,
        blockNumber: 7704915,
        notices: {
            edges: [],
            totalCount: 17,
            pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
            },
        },
        reports: {
            edges: [],
            totalCount: 17,
            pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
            },
        },
        vouchers: {
            edges: [],
            totalCount: 17,
            pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
            },
        },
        inputs: {
            totalCount: 0,
            edges: [
                {
                    cursor: '2',
                    node: {
                        id: '1',
                        index: 0,
                        notices: {
                            edges: [],
                        },
                        reports: {
                            edges: [],
                        },
                        vouchers: {
                            edges: [],
                        },
                    },
                },
            ],
            pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
            },
        },
    },
};
const inputItems = [edge, edge];
const inputsProps = {
    inputs: inputItems,
    count: inputItems.length,
};

const EpochItemComponent = withChakraTheme(EpochItem);
const epochItemProps = {
    item: {
        id: '1',
        index: 0,
        inputs: {
            totalCount: 0,
            pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
            },
            edges: [edge],
        },
    },
};

describe('DApp container', () => {
    describe('DApp component', () => {
        beforeEach(() => {
            mockUseDappQuery.mockClear();
            mockUseDappQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                },
                () => undefined,
            ]);
        });

        afterEach(() => {
            cleanup();
            jest.resetAllMocks();
        });

        it('should display error message', async () => {
            const errorMessage =
                'Warning: There was an error while fetching Dapps.';
            mockUseDappQuery.mockReturnValue([
                {
                    fetching: false,
                    stale: false,
                    error: {
                        message: errorMessage,
                    } as CombinedError,
                },
                () => undefined,
            ]);
            await act(() => {
                render(
                    <Provider value={mockClient}>
                        <DApp address={''} chainId={0} />
                    </Provider>
                );
            });
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        it('should display spinner while fetching', async () => {
            mockUseDappQuery.mockReturnValue([
                {
                    fetching: true,
                    stale: false,
                },
                () => undefined,
            ]);
            await act(() => {
                render(
                    <Provider value={mockClient}>
                        <DApp address={''} chainId={0} />
                    </Provider>
                );
            });

            expect(screen.getByTestId('dapp-spinner')).toBeInTheDocument();
        });
    });

    describe('InputContent component', () => {
        it('should display label', () => {
            act(() => {
                render(<InputContentComponent {...inputContentProps} />);
            });

            expect(
                screen.getByText(inputContentProps.label)
            ).toBeInTheDocument();
        });

        it('should display items count', () => {
            render(<InputContentComponent {...inputContentProps} />);

            expect(
                screen.getByText(`Total ${inputContentItems.length}`)
            ).toBeInTheDocument();
        });

        it('should display initial position as one (1)', () => {
            render(<InputContentComponent {...inputContentProps} />);

            expect(screen.getByTestId('input-content-position').innerHTML).toBe(
                '1'
            );
        });

        it('should display textarea when payload is of type "hex"', () => {
            render(<InputContentComponent {...inputContentProps} />);

            expect(
                screen.getByTestId('input-content-textarea')
            ).toBeInTheDocument();
        });

        it('should increase position when next position exists', async () => {
            render(<InputContentComponent {...inputContentProps} />);

            const nextButton = screen.getByTestId('input-content-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(
                    screen.getByTestId('input-content-position').innerHTML
                ).toBe('2')
            );
        });

        it('should not increase position when next position does not exist', async () => {
            render(
                <InputContentComponent
                    {...inputContentProps}
                    items={[inputContentItems[0]]}
                />
            );

            const nextButton = screen.getByTestId('input-content-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(
                    screen.getByTestId('input-content-position').innerHTML
                ).toBe('1')
            );
        });

        it('should decrease position when previous position exists', async () => {
            render(<InputContentComponent {...inputContentProps} />);

            const nextButton = screen.getByTestId('input-content-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(
                    screen.getByTestId('input-content-position').innerHTML
                ).toBe('2')
            );
            const prevButton = screen.getByTestId('input-content-prev-button');

            await act(() => {
                fireEvent.click(prevButton);
            });

            await waitFor(() =>
                expect(
                    screen.getByTestId('input-content-position').innerHTML
                ).toBe('1')
            );
        });

        it('should not decrease position when previous position does not exist', async () => {
            render(<InputContentComponent {...inputContentProps} />);

            const prevButton = screen.getByTestId('input-content-prev-button');

            await act(() => {
                fireEvent.click(prevButton);
            });

            await waitFor(() =>
                expect(
                    screen.getByTestId('input-content-position').innerHTML
                ).toBe('1')
            );
        });
    });

    describe('EpochItem component', () => {
        it('should display epoch position', () => {
            render(<EpochItemComponent {...epochItemProps} />);

            expect(
                screen.getByText(`Epoch ${epochItemProps.item.index + 1}`)
            ).toBeInTheDocument();
        });
    });
    describe('Inputs component', () => {
        it('should display items count', () => {
            render(<InputsComponent {...inputsProps} />);

            expect(
                screen.getByText(`Total ${inputsProps.count}`)
            ).toBeInTheDocument();
        });

        it('should increase position when next position exists', async () => {
            render(<InputsComponent {...inputsProps} />);

            const nextButton = screen.getByTestId('inputs-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(screen.getByTestId('inputs-position').innerHTML).toBe(
                    '2'
                )
            );
        });

        it('should not increase position when next position does not exist', async () => {
            render(<InputsComponent {...inputsProps} count={1} />);

            const nextButton = screen.getByTestId('inputs-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(screen.getByTestId('inputs-position').innerHTML).toBe(
                    '1'
                )
            );
        });

        it('should decrease position when previous position exists', async () => {
            render(<InputsComponent {...inputsProps} />);

            const nextButton = screen.getByTestId('inputs-next-button');

            await act(() => {
                fireEvent.click(nextButton);
            });

            await waitFor(() =>
                expect(screen.getByTestId('inputs-position').innerHTML).toBe(
                    '2'
                )
            );
            const prevButton = screen.getByTestId('inputs-prev-button');

            await act(() => {
                fireEvent.click(prevButton);
            });

            await waitFor(() =>
                expect(screen.getByTestId('inputs-position').innerHTML).toBe(
                    '1'
                )
            );
        });

        it('should not decrease position when previous position does not exist', async () => {
            render(<InputsComponent {...inputsProps} />);

            const prevButton = screen.getByTestId('inputs-prev-button');

            await act(() => {
                fireEvent.click(prevButton);
            });

            await waitFor(() =>
                expect(screen.getByTestId('inputs-position').innerHTML).toBe(
                    '1'
                )
            );
        });
    });

    describe('utils', () => {
        it('should return the converted payload as true', () => {
            expect(hexToJSON(PAYLOAD_JSON)).toBeTruthy();
        });

        it('should return the converted payload as false', () => {
            expect(hexToJSON(PAYLOAD_STRING)).toBeFalsy();
        });

        it('should transform payload', () => {
            expect(JSON.stringify(transformPayload('json', PAYLOAD_JSON))).toBe(
                JSON.stringify(hexToJSON(PAYLOAD_JSON))
            );
        });
    });
});
