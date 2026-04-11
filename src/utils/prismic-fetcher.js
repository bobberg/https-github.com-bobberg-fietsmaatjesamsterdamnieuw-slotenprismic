import * as prismic from '@prismicio/client';
import { createClient } from '../prismicio';

/**
 * Fetches and renders content based on document identifier.
 * @param {string} documentIdentifier - The document identifier (UID or ID).
 * @returns {Promise<Object>} - The fetched document with full UID.
 */
async function renderContent(documentIdentifier) {
  const client = createClient();

  // Fetches the parent UID for a given parent ID
  async function fetchParentUid(parentId) {
    try {
      const parentDoc = await client.getByID(parentId);
      return parentDoc?.uid || '';
    } catch (error) {
      console.error('Error fetching parent UID:', error);
      return '';
    }
  }

  // Constructs the full UID for a document
  async function constructFullUid(document) {
    if (document.data.parent?.id) {
      const parentUid = await fetchParentUid(document.data.parent.id);
      return parentUid ? `${parentUid}/${document.uid}` : document.uid;
    }
    return document.uid;
  }

  try {
    // Try to fetch by UID first
    const documentByUid = await client.getByUID('page', documentIdentifier);
    if (documentByUid) {
      documentByUid.fullUid = await constructFullUid(documentByUid);
      return documentByUid;
    }
  } catch (error) {
    console.error('Fetching by UID failed:', error);
  }

  try {
    // Try to fetch by ID if fetching by UID fails
    const documentById = await client.getByID(documentIdentifier);
    if (documentById) {
      documentById.fullUid = await constructFullUid(documentById);
      return documentById;
    }
  } catch (error) {
    console.error('Fetching by ID failed:', error);
  }

  throw new Error('No documents were returned');
}

/**
 * Fetches main page content.
 * @returns {Promise<Array>} - A promise that resolves to an array of main page content.
 */
async function fetchMainPageContent() {
  try {
    const client = createClient();
    const response = await client.getByType('page');
    return response.results
      .filter(result => !result.data.parent.id)
      .sort((a, b) => a.data.order - b.data.order);
  } catch (error) {
    console.error('Error fetching main page content from Prismic:', error);
    throw error;
  }
}

/**
 * Fetches sub page content for a given main page.
 * @param {string} mainPage - The main page ID.
 * @returns {Promise<Array>} - A promise that resolves to an array of sub page content.
 */
async function fetchSubPageContent(mainPage) {
  try {
    const client = createClient();
    const response = await client.getByType('page');
    return response.results
      .filter(result => result.data.parent.id === mainPage)
      .sort((a, b) => a.data.order - b.data.order);
  } catch (error) {
    console.error('Error fetching sub page content from Prismic:', error);
    throw error;
  }
}

/**
 * Fetches social content.
 * @returns {Promise<Array>} - A promise that resolves to an array of social content.
 */
async function fetchSocialContent() {
  try {
    const client = createClient();
    const response = await client.getByType('social');
    return response.results[0].data.social_item;
  } catch (error) {
    console.error('Error fetching social content from Prismic:', error);
    throw error;
  }
}

/**
 * Fetches news content, optionally limited to the latest entries.
 * @param {boolean} latest - Whether to fetch only the latest news.
 * @returns {Promise<Array>} - A promise that resolves to an array of news content.
 */
async function fetchNewsContent(latest) {
  try {
    const client = createClient();
    const response = await client.getByType('post');
    const sortedResults = response.results
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return latest ? sortedResults.slice(0, 3) : sortedResults;
  } catch (error) {
    console.error('Error fetching news content from Prismic:', error);
    throw error;
  }
}

/**
 * Fetches routes content.
 * @returns {Promise<Array>} - A promise that resolves to an array of routes content.
 */
async function fetchRoutesContent() {
  try {
    const client = createClient();
    const response = await client.getByType('route');
    return response.results.sort((a, b) => a.data.title.localeCompare(b.data.title));
  } catch (error) {
    console.error('Error fetching routes content from Prismic:', error);
    throw error;
  }
}

/**
 * Fetches all documents matching the query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - A promise that resolves to an array of documents.
 */
async function fetchAllDocuments(query) {
  const client = createClient();
  try {
    const response = await client.get({
      filters: [prismic.filter.fulltext('document', query)],
      pageSize: 100,
    });
    console.log('Query:', query);
    console.log('Response:', response);
    return response.results;
  } catch (error) {
    console.error('Error fetching documents from Prismic:', error);
    throw error;
  }
}

export { fetchMainPageContent, fetchSubPageContent, fetchSocialContent, renderContent, fetchNewsContent, fetchRoutesContent, fetchAllDocuments };