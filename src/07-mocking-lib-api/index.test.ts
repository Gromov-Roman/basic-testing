import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({ throttle: jest.fn((fn) => fn) }));

describe('throttledGetDataFromApi', () => {
  const mockAxiosGet = jest.fn();
  const mockResponseData = { id: 1, title: 'Test Data' };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({ get: mockAxiosGet });
    mockAxiosGet.mockResolvedValue({ data: mockResponseData });
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/test-path');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/test-path';

    await throttledGetDataFromApi(relativePath);

    expect(mockAxiosGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('/test-path');

    expect(result).toEqual(mockResponseData);
  });
});
