import { ContractTransaction } from 'ethers';
import { mock } from 'jest-mock-extended';
import { buildContractReceipt } from '../components/node/mocks';

const contractTransactionFactory = () => mock<ContractTransaction>();

const buildContractTransaction = () => contractTransactionFactory();

export { buildContractReceipt, buildContractTransaction };
