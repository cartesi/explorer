import { mock } from 'jest-mock-extended';
import { useOnboard } from '../../../src/components/wallet/useOnboard';
import { ReturnOf } from '../../test-utilities';

type UseOnboardV2Return = ReturnOf<typeof useOnboard>;

const buildUseOnboardV2Ret = () => mock<UseOnboardV2Return>();

function buildMockUseOnboardV2Return() {
    const mock = buildUseOnboardV2Ret();
    mock.active = false;
    return mock;
}

export { buildMockUseOnboardV2Return };
