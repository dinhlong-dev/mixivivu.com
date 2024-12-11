import { useState, useRef, useEffect } from 'react';

export const useDropdown = (length) => {
  const [dropdownOpen, setDropdownOpen] = useState(Array(length).fill(false));
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) =>
      prevState.map((open, i) => (i === index ? !open : open))
    );
  };

  const closeAllDropdowns = () => {
    setDropdownOpen(Array(length).fill(false));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((dropdown, index) => {
        if (dropdown && !dropdown.contains(event.target)) {
          closeAllDropdowns();
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { dropdownOpen, toggleDropdown, dropdownRefs };
};
