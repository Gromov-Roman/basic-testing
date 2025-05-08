import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({ existsSync: jest.fn() }));
jest.mock('fs/promises', () => ({ readFile: jest.fn() }));
jest.mock('path', () => ({ join: jest.fn() }));

describe('doStuffByTimeout', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(interval * 3);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockPath = 'test.txt';
  const mockFullPath = '/mock/full/path/test.txt';
  const mockFileContent = 'File content';

  beforeEach(() => jest.clearAllMocks());

  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(mockPath);

    expect(join).toHaveBeenCalledWith(__dirname, mockPath);
  });

  test('should return null if file does not exist', async () => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mockPath);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));

    const result = await readFileAsynchronously(mockPath);

    expect(result).toBe(mockFileContent);
    expect(readFile).toHaveBeenCalledWith(mockFullPath);
  });
});
