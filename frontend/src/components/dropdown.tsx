import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { FaUser } from "react-icons/fa6";

type TriggerEvent = "click" | "hover";

interface DropdownProps {
  element: React.ReactNode;
  children: React.ReactNode;
  triggerEvent?: TriggerEvent; // Condition to trigger dropdown via click or hover
  closeOnEvent?: "click" | "hover" | "both";
  additionalStyle?: {
    containerStyle: string;
  };
}

interface ListProps {
  children: React.ReactNode;
}

interface ItemProps {
  img: string;
  name: string;
}

interface ButtonProps {
  children: React.ReactNode;
}

function Dropdown({
  element,
  children,
  triggerEvent = "click",
  closeOnEvent = "click",
  additionalStyle,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const toggleDropdown = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const availableSpace = window.innerHeight - rect?.bottom;
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: Math.max(availableSpace - 20, 70),
      });
    }
    setIsVisible((prev) => !prev);
  }, []);

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      triggerRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnterDropdown = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseEnterTrigger = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Add event listeners for hover and click triggers
  useEffect(() => {
    if (triggerEvent === "click") {
      triggerRef.current?.addEventListener("click", toggleDropdown);
    } else if (triggerEvent === "hover") {
      triggerRef.current?.addEventListener(
        "mouseenter",
        handleMouseEnterTrigger,
      );
      dropdownRef.current?.addEventListener(
        "mouseenter",
        handleMouseEnterDropdown,
      );
      triggerRef.current?.addEventListener("mouseleave", handleMouseLeave);
      dropdownRef.current?.addEventListener("mouseleave", handleMouseLeave);
    }

    if (isVisible) {
      if (closeOnEvent === "click" || closeOnEvent === "both") {
        document.addEventListener("mousedown", handleOutsideClick);
      }
      if (closeOnEvent === "hover" || closeOnEvent === "both") {
        dropdownRef.current?.addEventListener("mouseleave", handleMouseLeave);
      }
    }

    return () => {
      if (triggerEvent === "click") {
        triggerRef.current?.removeEventListener("click", toggleDropdown);
      } else if (triggerEvent === "hover") {
        triggerRef.current?.removeEventListener(
          "mouseenter",
          handleMouseEnterTrigger,
        );
        dropdownRef.current?.removeEventListener(
          "mouseenter",
          handleMouseEnterDropdown,
        );
        triggerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        dropdownRef.current?.removeEventListener(
          "mouseleave",
          handleMouseLeave,
        );
      }

      document.removeEventListener("mousedown", handleOutsideClick);
      dropdownRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    isVisible,
    triggerEvent,
    closeOnEvent,
    toggleDropdown,
    handleOutsideClick,
    handleMouseLeave,
    handleMouseEnterDropdown,
    handleMouseEnterTrigger,
  ]);

  // Position the dropdown after it becomes visible
  useEffect(() => {
    if (isVisible && dropdownRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const availableSpace = window.innerHeight - rect?.bottom;

      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight: Math.max(availableSpace - 20, 70),
      });
    }
  }, [isVisible]);

  return (
    <>
      {/* Trigger element */}
      <div ref={triggerRef}>{element}</div>

      {/* Dropdown content */}
      {isVisible &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={`absolute z-10 w-[inherit] min-w-[inherit] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow dark:border-gray-600 dark:bg-gray-700 ${additionalStyle?.containerStyle}`}
            style={{
              top: dropdownPosition?.top,
              left: dropdownPosition?.left,
              width: dropdownPosition?.width,
              maxHeight: dropdownPosition?.maxHeight,
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

// List component for dropdown items
function List({ children }: ListProps) {
  return (
    <ul className="w-full overflow-y-auto py-2 text-gray-700 dark:text-gray-200">
      {children}
    </ul>
  );
}

// Item component to display each item within the List
function Item({ img, name }: ItemProps) {
  return (
    <li>
      <div className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        <img className="mr-2 h-6 w-6 rounded-full" src={img} alt={name} />
        {name}
      </div>
    </li>
  );
}

// Button component for any action within the dropdown
function Button({ children }: ButtonProps) {
  return (
    <div className="flex cursor-pointer items-center rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600">
      <FaUser className="mr-2" />
      {children}
    </div>
  );
}

// Exporting Dropdown with subcomponents as properties
Dropdown.List = List;
Dropdown.Item = Item;
Dropdown.Button = Button;

export default Dropdown;
