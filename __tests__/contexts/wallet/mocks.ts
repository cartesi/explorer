import { mock } from 'jest-mock-extended';
import { useOnboardV2 } from '../../../src/contexts/wallet/useOnboardV2';
import { ReturnOf } from '../../test-utilities';

type UseOnboardV2Return = ReturnOf<typeof useOnboardV2>;

const buildUseOnboardV2Ret = () => mock<UseOnboardV2Return>();

function buildMockUseOnboardV2Return() {
    const mock = buildUseOnboardV2Ret();
    mock.active = false;
    return mock;
}

export { buildMockUseOnboardV2Return };
