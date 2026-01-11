import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.LogosSlice} LogosSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<LogosSlice>} LogosProps
 * @param {LogosProps}
 */
const Logos = ({ slice }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {slice.primary.title && (
          <div className="mb-8 text-center text-3xl font-bold text-gray-900">
            <PrismicRichText field={slice.primary.title} />
          </div>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {slice.items.map((item, index) => (
            <div key={index} className="flex justify-center flex-shrink-0">
               {/* Use PrismicNextLink if link is present, else just render image */}
               {item.link && item.link.link_type !== 'Any' ? ( 
                 <PrismicNextLink field={item.link} className="hover:opacity-80 transition-opacity duration-300">
                   <PrismicNextImage 
                     field={item.logo} 
                     className="max-h-24 w-auto object-contain"
                     fallbackAlt=""
                   />
                 </PrismicNextLink>
               ) : (
                 <PrismicNextImage 
                   field={item.logo} 
                   className="max-h-24 w-auto object-contain"
                   fallbackAlt=""
                 />
               )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logos;
