import { getBankAccount } from '.';

const INITIAL_BALANCE = 100;
const DEPOSIT_AMOUNT = 50;
const WITHDRAW_AMOUNT = 50;
const TRANSFER_AMOUNT = 50;
const INSUFFICIENT_BALANCE = 50;
const INSUFFICIENT_AMOUNT = 51;
const FETCH_BALANCE_SUCCESS = 200;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    expect(account.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(INSUFFICIENT_BALANCE);
    expect(() => account.withdraw(INSUFFICIENT_AMOUNT)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(INSUFFICIENT_BALANCE);
    const account2 = getBankAccount(INITIAL_BALANCE);
    expect(() => account1.transfer(INSUFFICIENT_AMOUNT, account2)).toThrow();
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    expect(() => account.transfer(TRANSFER_AMOUNT, account)).toThrow(
      'Transfer failed',
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    account.deposit(DEPOSIT_AMOUNT);
    expect(account.getBalance()).toBe(INITIAL_BALANCE + DEPOSIT_AMOUNT);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(INITIAL_BALANCE);
    account.withdraw(WITHDRAW_AMOUNT);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - WITHDRAW_AMOUNT);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(INITIAL_BALANCE);
    const account2 = getBankAccount(DEPOSIT_AMOUNT);
    account1.transfer(TRANSFER_AMOUNT, account2);
    expect(account1.getBalance()).toBe(INITIAL_BALANCE - TRANSFER_AMOUNT);
    expect(account2.getBalance()).toBe(DEPOSIT_AMOUNT + TRANSFER_AMOUNT);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    const balance = await account.fetchBalance();
    if (balance !== null) {
      expect(typeof balance).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(FETCH_BALANCE_SUCCESS);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(FETCH_BALANCE_SUCCESS);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(INITIAL_BALANCE);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
