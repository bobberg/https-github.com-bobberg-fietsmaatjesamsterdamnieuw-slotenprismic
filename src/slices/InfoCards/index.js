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

  // Determine grid layout based on number of cards to prevent excessive width
  let gridLayoutClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"; // Standard for 3, 5, 6...

  if (filteredCards.length === 4) {
    // For 4 cards, use a 2x2 grid with a constrained width
    gridLayoutClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto";
  } else if (filteredCards.length === 2) {
    // For 2 cards, limit container width so they don't stretch too wide
    gridLayoutClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
  } else if (filteredCards.length === 1) {
    // For 1 card, limit width significantly and center
    gridLayoutClass = "grid-cols-1 max-w-md mx-auto";
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className={`grid ${gridLayoutClass} gap-6`}>
        {filteredCards.map((item, index) => (
          <InfoCardsItem
            key={index}
            item={item}
            variation={slice.variation}
            isExpanded={expandedIndex === index}
            toggleExpanded={() => toggleExpanded(index)}
          />
        ))}
      </div>
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
  const canExpand = variation === "infoCardsExpandable";
  
  return (
    <div
      onClick={canExpand ? toggleExpanded : undefined}
      className={`
        group flex flex-col p-6 rounded-xl border border-gray-200 bg-white
        shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
        items-center justify-start text-center gap-4 h-full cursor-pointer
        ${canExpand ? 'cursor-pointer' : ''}
        ${isExpanded ? 'row-span-2' : ''}
      `}
    >
      {item.icon && (
        <ReactSVG
          src={`data:image/svg+xml;base64,${btoa(item.icon)}`}
          beforeInjection={(svg) => {
            svg.classList.add('w-12', 'h-12', 'text-primary', 'group-hover:scale-110', 'transition-transform', 'duration-300');
            svg.setAttribute('style', 'width: 3rem; height: 3rem;'); 
          }}
          className="mb-2"
        />
      )}
      
      <div className="flex flex-col gap-2 w-full">
        <PrismicRichText
          field={item.title}
          components={{
            heading2: ({ children }) => <h2 className="text-xl font-bold text-gray-800">{children}</h2>,
          }}
        />

        {canExpand ? (
            // Logic for Expandable Cards
            <div className="text-gray-600 text-sm leading-relaxed">
                 {isExpanded ? (
                    <div className="text-left animate-in fade-in duration-300">
                      <PrismicRichText
                        field={item.body_expanded}
                        components={{
                          paragraph: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                          heading4: ({ children }) => <h4 className="font-bold mt-4 mb-2">{children}</h4>,
                          heading5: ({ children }) => <h5 className="font-bold mt-3 mb-1">{children}</h5>,
                          list: ({ children }) => <ul className="list-disc pl-4 mb-4 text-left">{children}</ul>,
                          listItem: ({ children }) => <li className="mb-1">{children}</li>,
                          hyperlink: ({ node, children }) => (
                            <a href={node.data.url} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                              {children}
                            </a>
                          ),
                        }}
                      />
                    </div>
                 ) : (
                    <p>{item.body}</p>
                 )}
            </div>
        ) : (
            // Logic for Default Cards (Static)
            <div className="text-gray-600 text-sm">
                <p>{item.body}</p>
            </div>
        )}

        {/* Links for Default Cards */}
        {!canExpand && item.link && (
            <div className="mt-auto pt-4">
                 {item.link.link_type !== "Web" ? (
                    <PrismicNextLink field={item.link} className="text-primary font-bold hover:underline" />
                  ) : (
                    <a href={'http://' + item.link.url} target={item.link.target} className="text-primary font-bold hover:underline">
                        {item.link.text || "Lees meer"}
                    </a>
                  )}
            </div>
        )}

        {/* Expand/Collapse Button for Expandable Cards */}
        {canExpand && (
           <div className="mt-auto pt-4 text-primary font-bold text-sm">
             {isExpanded ? "Inklappen" : "Lees meer"}
           </div>
        )}
      </div>
    </div>
  );
};

export default InfoCards;