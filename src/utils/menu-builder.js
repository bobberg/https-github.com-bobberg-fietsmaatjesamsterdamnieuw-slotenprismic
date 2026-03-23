import { fetchMainPageContent, fetchSubPageContent, fetchSocialContent } from "./prismic-fetcher";


function getSlicesWithAnchors(page) {
  if (!page?.data?.slices) {
    return [];
  }
  const slicesWithAnchors = page.data.slices.filter(slice => {
    // We checken of de slice een primary sectie heeft én of anchor_id is ingevuld.
    // Boolean() zorgt ervoor dat lege strings, null of undefined eruit worden gefilterd.
    return Boolean(slice.primary?.anchor_id);
  });

  return slicesWithAnchors;
}

/**
 * Builds the menu structure by fetching main, anchors and sub page content.
 * @returns {Promise<Array>} - A promise that resolves to an array representing the menu structure.
 */
async function buildMenu() {
    try {
        // Fetch main page content
        const mainPages = await fetchMainPageContent();
        const menu = [];

        for (const mainPage of mainPages) {
            // 1. Fetch slices with anchors and sub pages
            const slices = getSlicesWithAnchors(mainPage);
            const subPages = await fetchSubPageContent(mainPage.id);

            // 2. Create submenu items from the subpages
            const subPageItems = subPages.map(subPage => ({
                id: subPage.id,
                uid: subPage.uid,
                // Note: watch out for double slashes if Prismic already returns a full path
                url: `${mainPage.url}${subPage.url}`, 
                label: subPage.data.title[0].text
            }));

            // 3. Create submenu items from the anchor slices
            const sliceItems = slices.map(slice => ({
                id: slice.primary.anchor_id,
                uid: mainPage.uid,
                url: `${mainPage.url}#${slice.primary.anchor_id}`,
                label: slice.primary.label 
            }));

            // 4. Combine both arrays into a single submenu
            const combinedSubmenu = [...subPageItems, ...sliceItems];

            // 5. Add the complete item to the main menu
            menu.push({
                id: mainPage.id,
                uid: mainPage.uid,
                url: mainPage.url,
                label: mainPage.data.title[0].text,
                submenu: combinedSubmenu
            });
        }

        return menu;
    } catch (error) {
        console.error('Error fetching menu content:', error);
        return [];
    }
}

/**
 * Fetches and returns social content.
 * @returns {Promise<Array>} - A promise that resolves to an array of social content.
 */
async function buildSocial() {
    try {
        // Fetch social content
        const socials = await fetchSocialContent();
        return socials;
    } catch (error) {
        console.error('Error fetching social content:', error);
        return [];
    }
}

export { buildMenu, buildSocial };