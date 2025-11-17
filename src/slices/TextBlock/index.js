"use client";

import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.TextBlockSlice} TextBlockSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TextBlockSlice>} TextBlockProps
 * @param {TextBlockProps}
 */
const TextBlock = ({ slice }) => {
  const {
    body,
    width = "medium",
    alignment = "left",
    padding = "medium",
    background_color = "none",
    min_height,
  } = slice.primary || {};

  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  const widthClasses = {
    narrow: "max-w-2xl",
    medium: "max-w-3xl",
    wide: "max-w-5xl",
    full: "max-w-none",
  };

  const paddingClasses = {
    none: "py-0",
    small: "py-4",
    medium: "py-8",
    large: "py-16",
  };

  const backgroundClasses = {
    none: "bg-transparent",
    secondary: "bg-secondary",
    primary: "bg-primary text-white",
  };

  const alignmentConfig = {
    left: {
      container: "items-start",
      text: "text-left",
    },
    center: {
      container: "items-center",
      text: "text-center",
    },
  };

  const resolvedPadding = paddingClasses[padding] || paddingClasses.medium;
  const resolvedBackground = backgroundClasses[background_color] || backgroundClasses.none;
  const { container: containerAlignment, text: textAlignment } =
    alignmentConfig[alignment] || alignmentConfig.left;
  const resolvedWidth = widthClasses[width] || widthClasses.medium;

  const innerWidthClass =
    resolvedWidth === "max-w-none"
      ? "w-full max-w-none"
      : `${resolvedWidth} w-full mx-auto`;

  const minHeightStyle =
    typeof min_height === "number" && !Number.isNaN(min_height)
      ? { minHeight: `${min_height}px` }
      : undefined;

  const richTextComponents = {
    heading1: ({ children }) => <h1 className="mb-4 text-4xl font-semibold">{children}</h1>,
    heading2: ({ children }) => <h2 className="mb-3 text-3xl font-semibold">{children}</h2>,
    heading3: ({ children }) => <h3 className="mb-2 text-2xl font-semibold">{children}</h3>,
    paragraph: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    listItem: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
    oListItem: ({ children }) => <li className="ml-4 list-decimal">{children}</li>,
  };

  return (
    <section
      className={classNames(
        "w-full flex flex-col justify-center px-4 md:px-6",
        resolvedPadding,
        resolvedBackground,
        containerAlignment
      )}
      style={minHeightStyle}
    >
      <div
        className={classNames(
          innerWidthClass,
          textAlignment
        )}
      >
        {Array.isArray(body) && body.length > 0 ? (
          <PrismicRichText field={body} components={richTextComponents} />
        ) : (
          <p className="text-sm italic text-gray-500">Dit tekstblok heeft nog geen inhoud.</p>
        )}
      </div>
    </section>
  );
};

export default TextBlock;
