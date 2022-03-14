import {
    render,
    screen,
    cleanup,
    prettyDOM,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { StakingActivity } from '../../../src/components/poolRedesign/StakingActivity';
import usePoolActivities from '../../../src/graphql/hooks/usePoolActivities';

jest.mock('../../../src/graphql/hooks/usePoolActivities');
const mockUsePoolActivities = usePoolActivities as jest.MockedFunction<
    typeof usePoolActivities
>;

describe('Staking Activity', () => {
    const POOL_ADDRESS = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
    const USER_ACCOUNT = '0xa074683b5be015f053b5dceb064c41fc9d11b6e5';
    const defaultTimestamp = 1643576268000;
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
        hourCycle: 'h23',
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    // a default configured component
    const renderActivities = () =>
        render(
            <StakingActivity
                userAccount={USER_ACCOUNT}
                poolAddress={POOL_ADDRESS}
            />
        );

    beforeEach(() => {
        // default mock return
        mockUsePoolActivities.mockReturnValue({
            loading: false,
            activities: [
                {
                    amount: '150000000000000000000',
                    id: '0x5316176a7262ab6cd401a212c6cd892662ea43b67537c4af22bcbc4e8cd996de',
                    timestamp: defaultTimestamp,
                    type: 'Deposit',
                },
            ],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display loader and information when retrieving data', () => {
        mockUsePoolActivities.mockReturnValue({
            loading: true,
            activities: null,
        });

        renderActivities();

        expect(screen.getByText('My staking activities')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(
            screen.getByText('Loading staking activities with this pool')
        ).toBeInTheDocument();
    });

    it('Should render a message when use has no activities', () => {
        mockUsePoolActivities.mockReturnValue({
            loading: false,
            activities: [],
        });

        const { container } = renderActivities();

        expect(screen.getByText('My staking activities')).toBeInTheDocument();
        expect(
            container.querySelector('img[src="/images/empty-activity.svg"]')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'You haven’t had any transaction yet. Start delegation by depositing.'
            )
        ).toBeInTheDocument();
    });

    it('Should display the user activities', () => {
        renderActivities();

        const expectDatetime = dateTimeFormat.format(defaultTimestamp);

        expect(screen.getByText('My staking activities')).toBeInTheDocument();
        expect(screen.getByText('Deposit 150 CTSI')).toBeInTheDocument();
        expect(screen.getByText(expectDatetime)).toBeInTheDocument();
        expect(screen.getByText('Load more...')).toBeInTheDocument();
    });

    it('Should inform that all activities were loaded', async () => {
        renderActivities();

        const loadMoreEl = screen.getByText('Load more...');

        expect(screen.getByText('Deposit 150 CTSI')).toBeInTheDocument();
        expect(loadMoreEl).toBeInTheDocument();

        // The next load has no activity
        mockUsePoolActivities.mockReturnValue({
            loading: false,
            activities: [],
        });

        fireEvent.click(loadMoreEl);

        expect(
            await screen.findByText('All activities loaded')
        ).toBeInTheDocument();

        expect(screen.queryByText('Load more...')).not.toBeInTheDocument();
    });
});
