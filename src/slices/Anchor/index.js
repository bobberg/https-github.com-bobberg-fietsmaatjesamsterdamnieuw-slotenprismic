/**
 * @typedef {import("@prismicio/client").Content.AnchorSlice} AnchorSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AnchorSlice>} AnchorProps
 * @type {import("react").FC<AnchorProps>}
 */
const Anchor = ({ slice }) => {
  const sectionId = slice.primary.anchor_id || undefined;
  return (
    <section id={sectionId} 
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={{ width: '100%', height: '10px' }}
    >
    {
      /**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
    </section>
  );
};

export default Anchor;
