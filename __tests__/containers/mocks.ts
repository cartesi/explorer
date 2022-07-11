import { mock } from 'jest-mock-extended';
import { useUserNodes } from '../../src/graphql/hooks/useNodes';
import useStakingPools from '../../src/graphql/hooks/useStakingPools';
import { ReturnOf } from '../test-utilities';

type UseUserNodesReturn = ReturnOf<typeof useUserNodes>;
type UseStakingPoolsReturn = ReturnOf<typeof useStakingPools>;

const buildMockUseUserNodeRet = () => mock<UseUserNodesReturn>();
const buildMockUseStakingPoolsRet = () => mock<UseStakingPoolsReturn>();

function buildUseStakingPoolsReturn() {
    const mock = buildMockUseStakingPoolsRet();
    mock.loading = false;
    mock.data = null;
    return mock;
}

function buildUseUserNodesReturn() {
    const mock = buildMockUseUserNodeRet();
    mock.loading = false;
    mock.data = null;
    return mock;
}

export { buildUseUserNodesReturn, buildUseStakingPoolsReturn };
