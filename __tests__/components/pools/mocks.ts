import { mock } from 'jest-mock-extended';
import { useStakingPoolFactory } from '../../../src/services/poolFactory';
import { ReturnOf } from '../../test-utilities';
import { buildTransaction } from '../node/mocks';

type UseStakingPoolFactoryReturn = ReturnOf<typeof useStakingPoolFactory>;

const buildMockStakingPoolFact = () => mock<UseStakingPoolFactoryReturn>();

function buildUseStakingPoolFactoryReturn() {
    const mock = buildMockStakingPoolFact();
    mock.loading = false;
    mock.paused = false;
    mock.ready = true;
    mock.transaction = buildTransaction();
    return mock;
}

export { buildUseStakingPoolFactoryReturn };
