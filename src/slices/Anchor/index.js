/**
 * @typedef {import("@prismicio/client").Content.AnchorSlice} AnchorSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AnchorSlice>} AnchorProps
 * @type {import("react").FC<AnchorProps>}
 */
const Anchor = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for anchor (variation: {slice.variation}) slices.
      <br />
      <strong>You can edit this slice directly in your code editor.</strong>
      {/**
       * 💡 Use the Prismic MCP server with your code editor
       * 📚 Docs: https://prismic.io/docs/ai#code-with-prismics-mcp-server
       */}
    </section>
  );
};

export default Anchor;
