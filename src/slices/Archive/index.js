"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { fetchNewsContent, fetchRoutesContent } from "../../utils/prismic-fetcher";
import { dateResolver } from "@/utils/helpers";
import Post from "@/app/post";
import BikeRoute from "@/app/bike-route";

/**
 * @typedef {import("@prismicio/client").Content.ArchiveSlice} ArchiveSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ArchiveSlice>} ArchiveProps
 * @param {ArchiveProps}
 */
const Archive = ({ slice: { variation, slice_type } }) => {
  const [state, setState] = useState({
    items: [],
    expandedYears: {},
    expandedMonths: {},
    selectedItem: null,
    itemNotFound: false,
    expandedDefaultGroup: window.matchMedia("(min-width: 1024px)").matches, // Expanded for "lg" devices and larger
  });
  const itemsRef = useRef([]);
  const initialHash = useRef(window.location.hash.substring(1));

  // Fetch data on initial page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allItems =
          variation === "automatic"
            ? await fetchNewsContent(false)
            : await fetchRoutesContent();
        itemsRef.current = allItems;
        setState((prevState) => ({
          ...prevState,
          items: allItems,
          expandedYears: variation === "automatic" ? { [new Date().getFullYear()]: true } : {},
          expandedMonths:
            variation === "automatic"
              ? { [`${new Date().getFullYear()}-${new Date().getMonth() + 1}`]: true }
              : {},
        }));
        handleInitialHash(allItems);
      } catch (error) {
        console.error("Error fetching all items:", error);
      }
    };

    fetchData();
  }, [variation]);

  // Handle initial hash in URL
  const handleInitialHash = (allItems) => {
    if (initialHash.current) {
      const selectedItem = allItems.find((item) => item.uid === initialHash.current);
      if (selectedItem) {
        setState((prevState) => ({
          ...prevState,
          selectedItem,
          itemNotFound: false,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          itemNotFound: true,
        }));
        console.error("Item not found for hash:", initialHash.current);
      }
    } else if (allItems.length > 0) {
      const newestItem = allItems[0];
      window.location.hash = newestItem.uid;
      setState((prevState) => ({
        ...prevState,
        selectedItem: newestItem,
        itemNotFound: false,
      }));
    }
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const selectedItem = itemsRef.current.find((item) => item.uid === hash);
      if (selectedItem) {
        setState((prevState) => ({
          ...prevState,
          selectedItem,
          itemNotFound: false,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          itemNotFound: true,
        }));
        console.error("Item not found for hash change:", hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Collapse all groups on non-lg devices when an item is selected
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    if (state.selectedItem && mediaQuery.matches) {
      setState((prevState) => ({
        ...prevState,
        expandedYears: {},
        expandedMonths: {},
        expandedDefaultGroup: false,
      }));
    }
  }, [state.selectedItem]);

  // Toggle year expansion
  const toggleYear = (year) => {
    setState((prevState) => ({
      ...prevState,
      expandedYears: { [year]: !prevState.expandedYears[year] },
      expandedMonths: {},
    }));
  };

  // Toggle month expansion
  const toggleMonth = (year, month) => {
    const key = `${year}-${month}`;
    setState((prevState) => ({
      ...prevState,
      expandedMonths: { [key]: !prevState.expandedMonths[key] },
    }));
  };

  // Handle default group toggle
  const toggleDefaultGroup = () => {
    setState((prevState) => ({
      ...prevState,
      expandedDefaultGroup: !prevState.expandedDefaultGroup,
    }));
  };

  // Group items by date
  const groupedItems = useMemo(() => {
    return variation === "automatic" ? groupItemsByDate(state.items) : {};
  }, [state.items, variation]);

  // Sort items by title
  const sortedItems = useMemo(() => {
    return variation === "default" ? sortItemsByDistance(state.items) : [];
  }, [state.items, variation]);

  return (
    <section
      data-slice-type={slice_type}
      data-slice-variation={variation}
      className="flex flex-col gap-8 p-4 lg:flex-row w-full"
    >
      <div className="w-full lg:w-[350px]">
        {variation === "automatic" && Object.keys(groupedItems).length > 0 ? (
          renderGroupedItems(
            groupedItems,
            toggleYear,
            toggleMonth,
            state.expandedYears,
            state.expandedMonths,
            setState
          )
        ) : variation === "default" && sortedItems.length > 0 ? (
          renderSortedItems(sortedItems, state, setState, toggleDefaultGroup)
        ) : (
          <p>Geen artikelen beschikbaar :(</p>
        )}
      </div>
      <div className="w-full lg:max-w-[calc(100%-350px)]">
        {state.itemNotFound ? (
          ""
        ) : state.selectedItem ? (
          <div className="w-full item-details">
            {variation === "automatic" ? (
              <Post {...state.selectedItem} />
            ) : (
              <BikeRoute {...state.selectedItem} />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

// Group items by year and month
const groupItemsByDate = (items) => {
  return items.reduce((acc, item) => {
    const publicationDate = new Date(item.data.date);
    const year = publicationDate.getFullYear();
    const month = publicationDate.getMonth() + 1;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(item);

    return acc;
  }, {});
};

// Sort items by title
const sortItemsByDistance = (items) => {
  return items.sort((a, b) => a.data.distance - b.data.distance);
};

// Render grouped items
export const renderGroupedItems = (groupedItems, toggleYear, toggleMonth, expandedYears, expandedMonths, setState) => {
  return Object.keys(groupedItems)
    .sort((a, b) => b - a)
    .map((year) => (
      <div key={year} className="py-1">
        <h2
          onClick={() => toggleYear(year)}
          className="
            flex items-center justify-between
            p-2 px-3
            text-white bg-primary rounded-lg cursor-pointer hover:bg-secondary
          "
        >
          {year}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`transition-transform duration-200 size-4 text-white ${
              expandedYears[year] ? "rotate-90" : ""
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </h2>
        {expandedYears[year] && (
          <div>
            {Object.keys(groupedItems[year])
              .sort((a, b) => b - a)
              .map((month) => {
                const key = `${year}-${month}`;
                return (
                  <div key={month} className="py-2">
                    <h3
                      onClick={() => toggleMonth(year, month)}
                      className="
                        flex items-center justify-between
                        p-2 px-3
                        border-b border-primary
                        uppercase cursor-pointer hover:text-secondary
                      "
                    >
                      {new Date(year, month - 1).toLocaleString("nl-NL", { month: "long" })}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`transition-transform duration-200 size-4 ${
                          expandedMonths[key] ? "rotate-90" : ""
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </h3>
                    {expandedMonths[key] && (
                      <div>
                        {groupedItems[year][month]
                          .sort(
                            (a, b) =>
                              new Date(b.data.date) - new Date(a.data.date)
                          )
                          .map((item, index) => {
                            const publicationDate = item.data.date;
                            const itemBgColor =
                              window.location.hash.substring(1) === item.uid
                                ? "bg-secondary"
                                : index % 2 === 0
                                ? "bg-white"
                                : "bg-quaternary";
                            return (
                              <div
                                key={index}
                                className={`
                                  flex items-center gap-2
                                  p-2
                                  rounded-lg cursor-pointer hover:bg-secondary
                                  ${itemBgColor}
                                `}
                                onClick={() => handleItemClick(item, setState)}
                              >
                                <h3>{dateResolver(publicationDate).day}</h3>
                                <p>{item.data.title[0].text}</p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    ));
};

// Render sorted items in a collapsible container for "default" variation
export const renderSortedItems = (sortedItems, state, setState, toggleDefaultGroup) => {
  const isExpanded = state.expandedDefaultGroup;

  return (
    <div className="py-1">
      <h2
        onClick={toggleDefaultGroup}
        className="
          flex items-center justify-between
          p-2 px-3 mb-2
          text-white uppercase bg-primary rounded-lg cursor-pointer hover:bg-secondary
        "
      >
        Fietsroutes
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`transition-transform duration-200 size-4 text-white ${isExpanded ? "rotate-90" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </h2>
      {isExpanded && (
        <div>
          {sortedItems.map((item, index) => {
            const itemBgColor =
              window.location.hash.substring(1) === item.uid
                ? "bg-secondary"
                : index % 2 === 0
                ? "bg-white"
                : "bg-quaternary";
            return (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-secondary ${itemBgColor}`}
                onClick={() => handleItemClick(item, setState)}
              >
                <p>{item.data.title}</p><p className="font-bold">({item.data.distance}km)</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Handle item click
const handleItemClick = (item, setState) => {
  window.location.hash = item.uid;
  setState((prevState) => ({
    ...prevState,
    selectedItem: item,
    itemNotFound: false,
  }));
};

export default Archive;
