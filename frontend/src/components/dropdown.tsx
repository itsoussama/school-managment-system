import { useAppSelector } from "@src/hooks/useReduxEvent";
import { BrandColor, colorPalette } from "@src/utils/colors";
import React, {
  CSSProperties,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { FaUser } from "react-icons/fa6";

type TriggerEvent = "click" | "hover";

interface DropdownProps {
  element: React.ReactNode;
  children: React.ReactNode;
  triggerEvent?: TriggerEvent; // Condition to trigger dropdown via click or hover
  closeOnEvent?: "click" | "hover" | "both";
  onClose?: (value?: boolean) => void;
  close?: boolean;
  additionalStyle?: {
    containerStyle?: string;
    dropdownStyle?: string;
  };
  width?: "auto";
}

interface ListProps {
  children: React.ReactNode;
  additionalStyle?: {
    containerStyle: string;
  };
}

interface ItemProps {
  img?: string;
  children: React.ReactNode;
  onClick?: HTMLAttributes<HTMLLIElement>["onClick"];
}

interface ButtonProps {
  children: React.ReactNode;
}

function Dropdown({
  element,
  children,
  triggerEvent = "click",
  closeOnEvent = "click",
  onClose,
  close,
  additionalStyle: { containerStyle = "", dropdownStyle = "" } = {},
  width,
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
    // const target = event.target as HTMLElement;

    // console.log(event.isPropagationStopped());

    // if (target.closest("[data-ignore]")) return;+

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

  const closeDropDown = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnterDropdown = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseEnterTrigger = useCallback(() => {
    setIsVisible(true);
  }, []);

  // const updateDropdownPosition = () => {
  //   if (triggerRef.current && dropdownRef.current) {
  //     const rect = triggerRef.current.getBoundingClientRect();
  //     const availableSpace = window.innerHeight - rect?.bottom;

  //     setDropdownPosition({
  //       top: rect.bottom + window.scrollY,
  //       left: rect.left + window.scrollX,
  //       width: rect.width,
  //       maxHeight: Math.max(availableSpace - 20, 70),
  //     });
  //   }
  // };

  // Add event listeners for hover and click triggers
  useEffect(() => {
    const triggerElement = triggerRef?.current;
    const dropdownElement = dropdownRef?.current;

    if (triggerEvent === "click") {
      triggerRef.current?.addEventListener("click", toggleDropdown);
    } else if (triggerEvent === "hover") {
      triggerRef.current?.addEventListener(
        "mouseenter",
        handleMouseEnterTrigger,
      );
      dropdownElement?.addEventListener("mouseenter", handleMouseEnterDropdown);
      triggerRef.current?.addEventListener("mouseleave", closeDropDown);
      dropdownElement?.addEventListener("mouseleave", closeDropDown);
    }

    if (isVisible) {
      if (triggerEvent === "click") {
        window.addEventListener("scroll", closeDropDown, true); // `true` for capturing phase
      }
      window.addEventListener("resize", closeDropDown);
      window.addEventListener("transitionstart", closeDropDown);

      if (closeOnEvent === "click" || closeOnEvent === "both") {
        document.addEventListener("mousedown", handleOutsideClick);
      }
      if (closeOnEvent === "hover" || closeOnEvent === "both") {
        dropdownElement?.addEventListener("mouseleave", closeDropDown);
      }
    }

    return () => {
      if (triggerEvent === "click") {
        triggerElement?.removeEventListener("click", toggleDropdown);
      } else if (triggerEvent === "hover") {
        triggerElement?.removeEventListener(
          "mouseenter",
          handleMouseEnterTrigger,
        );
        dropdownElement?.removeEventListener(
          "mouseenter",
          handleMouseEnterDropdown,
        );
        triggerElement?.removeEventListener("mouseleave", closeDropDown);
        dropdownElement?.removeEventListener("mouseleave", closeDropDown);
      }
      window.removeEventListener("transitionstart", closeDropDown);
      document.removeEventListener("mousedown", handleOutsideClick);
      dropdownElement?.removeEventListener("mouseleave", closeDropDown);
      if (triggerEvent === "click") {
        window.removeEventListener("scroll", closeDropDown);
      }
      window.removeEventListener("resize", closeDropDown);
    };
  }, [
    isVisible,
    triggerEvent,
    closeOnEvent,
    toggleDropdown,
    handleOutsideClick,
    closeDropDown,
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

  useEffect(() => {
    if (close) {
      setIsVisible(false);
      onClose && onClose(false);
    }
  }, [close, onClose]);

  return (
    <>
      {/* Trigger element */}
      <div ref={triggerRef} className={containerStyle}>
        {element}
      </div>

      {/* Dropdown content */}
      {isVisible &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={`absolute z-10 w-[inherit] min-w-[inherit] overflow-y-auto rounded-m border border-gray-400 bg-white shadow dark:border-gray-500 dark:bg-gray-700 ${dropdownStyle}`}
            style={{
              top: dropdownPosition?.top,
              left: dropdownPosition?.left,
              width: width ? "max-content" : dropdownPosition?.width,
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
function List({ children, additionalStyle }: ListProps) {
  return (
    <ul
      className={`min-w-min overflow-y-auto whitespace-nowrap text-gray-700 dark:text-gray-200 ${additionalStyle?.containerStyle}`}
    >
      {children}
    </ul>
  );
}

// Item component to display each item within the List
function Divider() {
  return (
    <li>
      <div className="border-t border-gray-200 dark:border-gray-600" />
    </li>
  );
}

// Item component to display each item within the List
function Item({ img, children, onClick }: ItemProps) {
  return (
    <li
      className={`w-full ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <div className="flex w-full items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        {img && <img className="mr-2 h-6 w-6 rounded-full" src={img} />}
        {children}
      </div>
    </li>
  );
}

// Button component for any action within the dropdown
function Button({ children }: ButtonProps) {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  return (
    <div
      className="flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-[var(--brand-color-600)] hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--brand-color-500)] dark:hover:bg-gray-600"
      style={
        {
          "--brand-color-500": colorPalette[brandState as BrandColor][500],
          "--brand-color-600": colorPalette[brandState as BrandColor][600],
        } as CSSProperties
      }
    >
      <FaUser className="mr-2" />
      {children}
    </div>
  );
}

// Exporting Dropdown with subcomponents as properties
Dropdown.List = List;
Dropdown.Item = Item;
Dropdown.Divider = Divider;
Dropdown.Button = Button;

export default Dropdown;
