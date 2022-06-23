import { mock } from 'jest-mock-extended';
import { useStakingPool } from '../../../src/services/pool';
import { useStakingPoolFactory } from '../../../src/services/poolFactory';
import { ReturnOf } from '../../test-utilities';
import { buildTransaction, buildContractReceipt } from '../node/mocks';

type UseStakingPoolFactoryReturn = ReturnOf<typeof useStakingPoolFactory>;
type UseStakingPoolReturn = ReturnOf<typeof useStakingPool>;

const buildMockStakingPoolFact = () => mock<UseStakingPoolFactoryReturn>();
const buildMockStakingPool = () => mock<UseStakingPoolReturn>();

function buildUseStakingPoolFactoryReturn() {
    const mock = buildMockStakingPoolFact();
    mock.loading = false;
    mock.paused = false;
    mock.ready = true;
    mock.transaction = buildTransaction();
    return mock;
}

function buildUseStakingPoolReturn() {
    const mock = buildMockStakingPool();
    mock.paused = false;
    mock.transaction = buildTransaction();
    return mock;
}

export {
    buildUseStakingPoolFactoryReturn,
    buildUseStakingPoolReturn,
    buildContractReceipt,
};
