"use client";

import { useEffect, useState } from 'react';
import { fetchNewsContent } from '@/utils/prismic-fetcher';
import { PrismicRichText, PrismicImage } from '@prismicio/react';
import { dateResolver } from '@/utils/helpers';

/**
 * @typedef {import("@prismicio/client").Content.LatestNewsSlice} LatestNewsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<LatestNewsSlice>} LatestNewsProps
 * @param {LatestNewsProps}
 */
const LatestNews = ({ slice, context }) => {
  const [news, setNews] = useState([]);
  const dateFromPage = context.pageDate;

  // Fetch latest news on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestNews = await fetchNewsContent(true);
        setNews(latestNews);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      }
    };

    fetchData();
  }, []);

  // Truncate text to a specified length
  const truncateText = (text, length) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mt-8 w-full p-4 text-center"
    >
      <h1 className="mb-2 border-b pb-2 border-primary">Laatste nieuwsberichten</h1>
      <div
        className={`p-4 grid grid-cols-1 xl:grid-cols-3 justify-items-center gap-4`}
      >
        {news.length > 0 ? (
          news.map((item, index) => {
            const formattedDate = dateResolver(dateFromPage);
            const hasImage = item.data.image && item.data.image.url;

            // Concatenate all text blocks into a single string
            const concatenatedText = item.data.body.map(block => block.text).join(' ');
            // Truncate the concatenated text to 400 characters
            const truncatedText = truncateText(concatenatedText, 350);

            return (
              <div
                key={index}
                className="group hover:bg-primary hover:text-white w-[350px] h-[400px] bg-secondary rounded-lg p-4 flex flex-col justify-between"
              >
                {hasImage && (
                  <PrismicImage
                    field={item.data.image}
                    className="rounded-lg w-[340px] h-[150px] object-cover object-center"
                  />
                )}
                <div
                  className={`mb-3 gap-1 bg-white rounded-b opacity-80 mt-[-20px] w-full flex items-center justify-center ${hasImage ? '' : 'p-2'}`}
                >
                  <p className="text-primary font-bold">{formattedDate.day}</p>
                  <p className="text-primary">{formattedDate.month}</p>
                  <p className="text-primary font-bold">{formattedDate.year}</p>
                </div>
                {item.data.title && (
                  <PrismicRichText
                    field={item.data.title}
                    components={{
                      heading1: ({ children }) => (
                        <h3 className="group-hover:text-white">
                          {truncateText(item.data.title[0]?.text, 50)}
                        </h3>
                      ),
                      heading2: ({ children }) => (
                        <h3 className="group-hover:text-white">
                          {truncateText(item.data.title[0]?.text, 50)}
                        </h3>
                      ),
                    }}
                  />
                )}
                {truncatedText && (
                  <p className="text-xs text-justify">
                    {truncatedText}
                  </p>
                )}
                <a
                  href={`/nieuws#${item.uid}`}
                  className="group-hover:text-tertiary hover:no-underline font-bold text-xs mt-auto"
                >
                  Lees meer
                </a>
              </div>
            );
          })
        ) : (
          <p className="text-primary">Geen nieuws beschikbaar :(</p>
        )}
      </div>
    </section>
  );
};

export default LatestNews;