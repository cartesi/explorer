import { ContractTransaction, Event } from 'ethers';
import { mock } from 'jest-mock-extended';
import { buildContractReceipt } from '../components/node/mocks';

const contractTransactionFactory = () => mock<ContractTransaction>();
const receiptEventFactory = () => mock<Event>();

const buildContractTransaction = () => contractTransactionFactory();

const buildContractReceiptEvent = () => receiptEventFactory();

export {
    buildContractReceipt,
    buildContractTransaction,
    buildContractReceiptEvent,
};
