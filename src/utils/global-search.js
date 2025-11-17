import { fetchAllDocuments } from './prismic-fetcher';

/**
 * Performs a global search based on the provided query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - A promise that resolves to an array of search results.
 */
export const globalSearch = async (query) => {
  try {
    const documents = await fetchAllDocuments(query);

    // Map through documents and construct search results
    const results = documents.map((doc) => {
      let url;
      let title;

      // Determine URL and title based on document type
      switch (doc.type) {
        case 'post':
          url = `/nieuws#${doc.uid}`;
          title = `Nieuws - ${doc.data.title[0].text}`;
          break;
        case 'route':
          url = `/word-fietsmaatje/fietsroutes#${doc.uid}`;
          title = `Fietsroutes - ${doc.data.title}`;
          break;
        default:
          url = doc.url;
          title = doc.data.title || doc.data.name || 'Untitled';
      }

      return {
        id: doc.id,
        title: title,
        url: url,
      };
    });

    return results;
  } catch (error) {
    console.error('Error performing global search:', error);
    return [];
  }
};