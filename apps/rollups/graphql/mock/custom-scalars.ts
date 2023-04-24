import casual from 'casual';

const BigInt = () => casual.integer(0, Number.MAX_SAFE_INTEGER);

const Int = () => casual.integer(0, 1000);

const Float = () => casual.integer(0, Number.MAX_SAFE_INTEGER);

const String = () => casual.words(2);

export { BigInt, Int, Float, String };
