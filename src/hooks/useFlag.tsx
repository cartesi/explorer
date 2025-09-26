import { getOr } from 'lodash/fp';

const buildFlags = () => {
    return {
        posV2Enabled: process.env.NEXT_PUBLIC_FLAG_POS_V2_ENABLED === 'true',
        ankrEnabled: process.env.NEXT_PUBLIC_FLAG_ANKR_ENABLED === 'true',
    } as const;
};

type FlagName = keyof ReturnType<typeof buildFlags>;

const useFlag = (name: FlagName): boolean => {
    return getOr(false, [name], buildFlags());
};

export default useFlag;
