"use client";

import { PrismicRichText, PrismicImage } from '@prismicio/react';
import { useEffect, useRef, useState } from 'react';

/**
 * @typedef {import("@prismicio/client").Content.SectionSlice} SectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SectionSlice>} SectionProps
 * @param {SectionProps}
 */
const Section = ({ slice }) => {
  const variation = slice.variation;
  const bgColor = slice.primary.background_color;
  const imageRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('auto');
  const sectionId = slice.primary.anchor_id || undefined;

  useEffect(() => {
    if (imageRef.current) {
      setMaxHeight(`${imageRef.current.clientHeight}px`);
    }
  }, []);

  // Common styles for sections
  const sectionStyles = `
    h-full w-full gap-6
    p-4
    items-center justify-center
  `;

  // Common styles for images
  const imageStyles = `
    object-cover object-center rounded-lg
  `;

  // Common styles for text containers
  const textContainerStyles = `
    flex flex-col p-4
  `;

  // Function to render PrismicRichText with common components
  const renderRichText = (field, components) => (
    <PrismicRichText
      field={field}
      components={components}
    />
  );

  // Function to render image
  const renderImage = (field, additionalStyles = '') => (
    <div className="flex flex-col items-center">
      <PrismicImage
        ref={imageRef}
        field={field}
        className={`${imageStyles} ${additionalStyles}`}
      />
      {slice.primary.image.copyright && (
        <h6
          className=" 
            relative max-w-[200px]
            ml-[10px] mt-[-24px] py-1 px-2 rounded-t-lg
            font-bold
            text-white text-center
            bg-primary
          ">&copy; {slice.primary.image.copyright}</h6>
      )}
    </div>
  );

  // Function to render section with image and text
  const renderSectionWithImageAndText = (imageStyles, textStyles, richTextComponents) => (
    <section id={sectionId} className={`${sectionStyles} ${bgColor === "lichtblauw" ? "bg-secondary" : "bg-white"} flex flex-col md:flex-row items-center`}>
      {renderImage(slice.primary.image, imageStyles)}
      <div className={`${textContainerStyles} ${textStyles}`}>
        {renderRichText(slice.primary.body, richTextComponents)}
      </div>
    </section>
  );

  // Define rich text components for different variations
  const defaultRichTextComponents = {
    heading1: ({ children }) => <h1 className="pt-2">{children}</h1>,
    heading2: ({ children }) => <h2 className="pt-2">{children}</h2>,
    heading3: ({ children }) => <h3 className="pt-2">{children}</h3>,
    paragraph: ({ children }) => <p className="pt-2 text-justify">{children}</p>,
  };

  const verticalRichTextComponents = {
    heading1: ({ children }) => <h1 className="text-justify">{children}</h1>,
    paragraph: ({ children }) => (
      <p className="mt-4 text-justify">
        {children}
      </p>
    ),
  };

  const mirroredRichTextComponents = {
    heading1: ({ children }) => <h1 className="text-justify">{children}</h1>,
    paragraph: ({ children }) => (
      <p className="mt-4 text-justify">
        {children}
      </p>
    ),
  };

  const stackedRichTextComponents = {
    heading1: ({ children }) => <h1 className="text-4xl">{children}</h1>,
    heading2: ({ children }) => <h2 className="text-4xl text-white">{children}</h2>,
    heading3: ({ children }) => <h3 className="text-4xl text-primary">{children}</h3>,
  };

  // Render different variations
  if (variation === "default") {
    return renderSectionWithImageAndText("md:w-[40dvw] max-h-[500px]", "md:w-[60dvw]", defaultRichTextComponents);
  } else if (variation === "vertical") {
    return (
      <section id={sectionId} className={`${sectionStyles} flex flex-col`}>
        {renderImage(slice.primary.image, "w-full h-[70dvh]")}
        <div className="py-4 px-8 md:px-40 w-full">
          {renderRichText(slice.primary.body, verticalRichTextComponents)}
        </div>
      </section>
    );
  } else if (variation === "mirrored") {
    return (
      <section id={sectionId} className={`${sectionStyles} md:flex-row gap-10 py-10 px-8 lg:px-36 ${bgColor === "Lichtblauw" ? "bg-secondary" : "bg-white"} flex flex-col`}>
        <div className="p-4 md:w-[60dvw]">
          {renderRichText(slice.primary.body, mirroredRichTextComponents)}
        </div>
        {renderImage(slice.primary.image, "md:w-[40dvw] max-w-[85dvw]")}
      </section>
    );
  } else if (variation === "stacked") {
    return (
      <section id={sectionId} className="relative h-full w-full flex flex-col gap-6">
        {renderImage(slice.primary.image, "rounded-none w-full h-[70dvh]")}
        <div className="absolute inset-0 flex items-end mb-14 justify-center">
          {slice.primary.body != '' &&
            <div className="p-4 w-full bg-white bg-opacity-60 p-4 md:p-10 flex items-center justify-center">
              <div className="font-semibold text-white text-center w-full">
                {renderRichText(slice.primary.body, stackedRichTextComponents)}
              </div>
            </div>}
        </div>
      </section>
    );
  } else if (variation === "noImage") {
    return (
      <section id={sectionId}>
        <div className="px-8 py-8 md:px-52 flex flex-col w-full text-center items-center justify-center">
          {renderRichText(slice.primary.body, {})}
        </div>
      </section>
    );
  } else {
    return <div>test</div>;
  }
};

export default Section;