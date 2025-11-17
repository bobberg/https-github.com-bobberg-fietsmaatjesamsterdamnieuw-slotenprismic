import { globalSearch } from '@/utils/global-search';
import { fetchAllDocuments } from '@/utils/prismic-fetcher';

jest.mock('@/utils/prismic-fetcher', () => ({
  fetchAllDocuments: jest.fn(),
}));

const mockDocuments = [
  {
    id: '1',
    type: 'post',
    uid: 'post-1',
    data: {
      title: [{ type: 'heading1', text: 'Post Title 1' }],
    },
  },
  {
    id: '2',
    type: 'route',
    uid: 'route-1',
    data: {
      title: 'Route Title 1',
    },
  },
  {
    id: '3',
    type: 'unknown',
    uid: 'unknown-1',
    data: {
      title: 'Unknown Title 1',
    },
    url: '/unknown-url',
  },
];

describe('globalSearch', () => {
  beforeEach(() => {
    fetchAllDocuments.mockClear();
  });

  test('returns search results for different document types', async () => {
    fetchAllDocuments.mockResolvedValue(mockDocuments);

    const results = await globalSearch('test query');

    expect(results).toEqual([
      {
        id: '1',
        title: 'Nieuws - Post Title 1',
        url: '/nieuws#post-1',
      },
      {
        id: '2',
        title: 'Fietsroutes - Route Title 1',
        url: '/word-fietsmaatje/fietsroutes#route-1',
      },
      {
        id: '3',
        title: 'Unknown Title 1',
        url: '/unknown-url',
      },
    ]);
  });

  test('handles errors correctly', async () => {
    fetchAllDocuments.mockRejectedValue(new Error('Error fetching documents'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const results = await globalSearch('test query');

    expect(results).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error performing global search:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});