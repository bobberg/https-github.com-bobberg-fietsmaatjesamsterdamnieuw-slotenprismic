"use client";

import { useState } from 'react';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { ReactSVG } from 'react-svg';

/**
 * @typedef {import("@prismicio/client").Content.InfoCardsSlice} InfoCardsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<InfoCardsSlice>} InfoCardsProps
 * @param {InfoCardsProps}
 */
const InfoCards = ({ slice }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Filter out empty columns
  const filteredCards = slice.primary.card.filter(item => item.title || item.body || item.icon);

  /**
   * Toggles the expanded state of a card
   * @param {number} index - Index of the card to toggle
   */
  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Determine the grid column class based on the number of filtered cards
  const gridColsClass = `lg:grid-cols-${Math.min(filteredCards.length, slice.variation === "infoCardsExpandable" ? 3 : 4)}`;

  return (
    <section
      className={`flex flex-col xl:flex-row justify-items-center`}
    >
      {filteredCards.map((item, index) => (
        <InfoCardsItem
          key={index}
          item={item}
          variation={slice.variation}
          isExpanded={expandedIndex === index}
          toggleExpanded={() => toggleExpanded(index)}
        />
      ))}
    </section>
  );
};

/**
 * Renders a single content card item.
 * @param {Object} props
 * @param {Object} props.item - The info card item data.
 * @param {string} props.variation - The variation of the slice.
 * @param {boolean} props.isExpanded - Whether the item is expanded.
 * @param {Function} props.toggleExpanded - Function to toggle the expanded state.
 */
const InfoCardsItem = ({ item, variation, isExpanded, toggleExpanded }) => {
  return (
    <div
      className={`
        my-4 group flex flex-col p-4 border border-primary rounded-lg
        hover:bg-primary w-[320px] md:w-[250px] m-4 items-center justify-center text-center gap-1
        ${isExpanded ? 'h-[710px]' : 'h-[200px] md:h-[300px]'}
      `}
    >
      <ReactSVG
        src={`data:image/svg+xml;base64,${btoa(item.icon)}`}
        beforeInjection={(svg) => {
          svg.classList.add('svg-container', 'group-hover:text-white', 'transition', 'ease-in-out');
        }}
      />
      <PrismicRichText
        field={item.title}
        components={{
          heading2: ({ children }) => <h2 className="group-hover:text-white transition ease-in-out break-words">{children}</h2>,
        }}
      />
      {variation === "infoCardsExpandable" ? (
        isExpanded ? (
          <PrismicRichText
            field={item.body_expanded}
            components={{
              paragraph: ({ children }) => <p className="text-xs text-primary group-hover:text-white transition ease-in-out">{children}</p>,
              hyperlink: ({ node, children }) => (
                <a href={node.data.url} className="text-secondary hover:underline text-xs">
                  {children}
                </a>
              ),
            }}
          />
        ) : (
          <h6 className="text-primary group-hover:text-white text-center">{item.body}</h6>
        )
      ) : (
        <h6 className="text-primary group-hover:text-white text-center">{item.body}</h6>
      )}
      {item.link && item.link.link_type !== "Web" ? (
        <PrismicNextLink field={item.link} className="mt-auto text-xs font-bold group-hover:text-tertiary hover:no-underline" />
      ) : (
        item.link && (
          <a href={'http://' + item.link.url} target={item.link.target} className="mt-auto text-xs font-bold group-hover:text-tertiary hover:no-underline">
            {item.link.text}
          </a>
        )
      )}
      {variation === "infoCardsExpandable" && (
        <a onClick={toggleExpanded} className="cursor-pointer mt-auto text-xs font-bold group-hover:text-tertiary hover:no-underline">
          {isExpanded ? "Terug" : "Lees meer"}
        </a>
      )}
    </div>
  );
};

export default InfoCards;