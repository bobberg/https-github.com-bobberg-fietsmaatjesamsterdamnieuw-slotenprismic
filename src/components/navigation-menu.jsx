"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";
import SubMenu from "@/components/sub-menu";

const NavigationMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false); // Tracks main menu state
  const [hoveredItem, setHoveredItem] = useState(null); // Tracks hovered menu item
  const [openSubMenu, setOpenSubMenu] = useState(null); // Tracks open sub-menu in mobile
  const navRef = useRef(null); // Reference to the navigation element
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" }); // Responsive check
  const pathName = usePathname(); // Current path for active link highlighting

  // Toggles the visibility of the main menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Closes the menu and sub-menus if a click occurs outside the nav element
  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
      setOpenSubMenu(null);
    }
  };

  // Adds or removes the event listener for clicks outside the menu
  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Closes the menu and sub-menus on menu item click
  const handleMenuItemClick = () => {
    setIsOpen(false);
    setOpenSubMenu(null);
    setHoveredItem(null)
  };

  // Handles hover state for medium screens and above
  const handleMouseEnter = (item) => {
    if (isMediumScreen) setHoveredItem(item);
  };
  const handleMouseLeave = (item) => {
    if (isMediumScreen && hoveredItem === item) setHoveredItem(null);
  };

  // Toggles sub-menu visibility for mobile view
  const handleSubMenuToggle = (item) => {
    if (!isMediumScreen) setOpenSubMenu(openSubMenu === item ? null : item);
  };

  return (
    <nav ref={navRef}>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Main menu */}
      <ul
        className={`${
          isOpen ? "flex-col absolute px-6 pt-8 bg-primary rounded-lg w-[330px]" : "hidden"
        } 
        md:flex md:gap-6 md:pb-0 flex gap-6 pb-4`}
      >
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="group md:flex md:flex-col relative list-none md:mt-3 items-center"
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={() => handleMouseLeave(item)}
          >
            {/* Menu item link */}
            <a
              href={item.url}
              className={`font-bold text-base 
              hover:text-secondary hover:no-underline 
              ${pathName.includes(item.uid) ? "text-tertiary" : "text-white"}`}
              onClick={handleMenuItemClick}
            >
              {item.label}
            </a>

            {/* Sub-menu toggle button for mobile */}
            {item.submenu.length > 0 && (
              <button
                onClick={() => handleSubMenuToggle(item)}
                className="absolute right-0 md:relative border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4 text-white group-hover:text-secondary md:mt-[-6px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            )}

            {/* Sub-menu */}
            {((hoveredItem === item && item.submenu.length > 0) ||
              (openSubMenu === item && item.submenu.length > 0)) && (
              <div
                role="submenu"
                className="relative md:absolute top-full left-0 
                md:w-[220px] pt-2 md:pt-0 block sub-menu"
                onClick={() => {handleMenuItemClick()}}
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={() => handleMouseLeave(item)}
              >
                <SubMenu menuItem={item} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
