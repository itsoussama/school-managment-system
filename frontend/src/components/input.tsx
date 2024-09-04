// import PropTypes from 'prop-types'
// import { FontAwesomeIcon } from '@htmlFortawesome/react-fontawesome'
// import { faCheck, faCircleExclamation } from '@htmlFortawesome/free-solid-svg-icons'
import React, {
  ChangeEvent,
  cloneElement,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface Field {
  htmlFor?: string;
  label?: string;
  icon?: React.ReactNode;
  "custom-style"?: {
    inputStyle?: string;
    labelStyle?: string;
    wrapperInputStyle?: string;
    wrapperLabelStyle?: string;
    containerStyle?: string;
  };
  error?: null | string;
  children?: React.ReactNode;
}

interface Input extends Field, InputHTMLAttributes<HTMLInputElement> {}
interface Select extends Field, SelectHTMLAttributes<HTMLSelectElement> {}

function Input({
  htmlFor,
  label = "",
  icon,
  "custom-style": {
    inputStyle = "",
    labelStyle = "",
    containerStyle = "",
  } = {},
  error = null,
  ...attribute
}: Input) {
  // const [inputValue, setInputValue] = useState<string>(value ?? "");

  return (
    <div className={containerStyle}>
      <label
        htmlFor={htmlFor}
        className={`mb-2 block text-sm font-medium text-gray-900 dark:text-white ${labelStyle}`}
      >
        {label}
      </label>
      <div className="relative">
        {icon}
        <input
          className={`rounded-s border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring-blue-600 sm:text-sm ${error && "border-red-600 dark:border-red-500"} block w-full p-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${inputStyle}`}
          {...attribute}
        />
      </div>
      {error && (
        <div className="mt-1.5 flex items-start">
          <FaExclamationCircle className="mr-2 mt-0.5 min-w-4 text-red-500" />
          <span className="error text-sm text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}

function Checkbox({
  htmlFor,
  label = "",
  "custom-style": {
    inputStyle = "",
    labelStyle = "",
    containerStyle = "",
    wrapperInputStyle = "",
    wrapperLabelStyle = "",
  } = {},
  error = null,
  children,
  ...attribute
}: Input) {
  return (
    <div className={`flex items-center ${containerStyle}`}>
      <div className={`relative flex items-center ${wrapperInputStyle}`}>
        <input
          id={htmlFor}
          type="checkbox"
          className={`peer h-4 w-4 appearance-none rounded-xs border-gray-300 bg-gray-100 text-blue-600 checked:border-0 checked:bg-blue-800 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 ${inputStyle}`}
          {...attribute}
        />
        <FaCheck
          color="white"
          size="xs"
          className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 peer-checked:block"
        />
        {error && (
          <div className="mt-1.5 flex items-center">
            <FaExclamationCircle className="mr-2 text-red-500" />
            <span className="error text-red-500">{error}</span>
          </div>
        )}
      </div>
      <div className={`ml-2 text-sm ${wrapperLabelStyle}`}>
        <label
          htmlFor={htmlFor}
          className={`text-gray-500 dark:text-gray-300 ${labelStyle}`}
        >
          {label}
          {children}
        </label>
      </div>
    </div>
  );
}

function RSelect({
  htmlFor,
  label = "",
  icon,
  "custom-style": {
    inputStyle = "",
    labelStyle = "",
    containerStyle = "",
  } = {},
  error = null,
  children,
  ...attribute
}: Select) {
  return (
    <div className={containerStyle}>
      <label
        htmlFor={htmlFor}
        className={`mb-2 block text-sm font-medium text-gray-900 dark:text-white ${labelStyle}`}
      >
        {label}
      </label>
      <div className="relative">
        {icon}
        <select
          className={`block w-full rounded-s border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${inputStyle}`}
          {...attribute}
        >
          {children}
        </select>
      </div>
      {error && (
        <div className="mt-1.5 flex items-center">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <span className="error text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}

interface MultiSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  onSelectItem: (items: Array<SelectedData>) => void;
  children: ReactNode;
}

export interface SelectedData {
  id: string;
  label: string;
}

function MultiSelect({
  label,
  name,
  onSelectItem,
  children,
}: MultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<Array<SelectedData>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownList = useRef<HTMLDivElement>(null);

  const handleItemsChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    let itemsCollection: SelectedData[];

    const hasItem = selectedItems.find((item) => item.id == target.id);

    if (hasItem) {
      const newItemsSet = selectedItems.filter((item) => item.id !== target.id);
      itemsCollection = newItemsSet;
      setSelectedItems(newItemsSet);
    } else {
      itemsCollection = [
        ...selectedItems,
        {
          id: (event.target as HTMLInputElement).id,
          label: (event.target as HTMLInputElement).value,
        },
      ];
      setSelectedItems(itemsCollection);
    }

    onSelectItem(itemsCollection);
  };

  const deleteItem = (event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.target as HTMLSpanElement;

    document.getElementsByName(name).forEach((item) => {
      if ((item as HTMLInputElement).id == target.parentElement?.id) {
        (item as HTMLInputElement).checked = false;
      }
    });

    const newItemsSet = selectedItems.filter(
      (item) => item.id !== target.parentElement?.id,
    );
    setSelectedItems(newItemsSet);
    onSelectItem(newItemsSet);
  };

  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child as ReactElement, {
        onChange: handleItemsChange,
      });
    }
    return child;
  });

  const handleDropDown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label
        htmlFor="dropdown"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div ref={dropdownRef}>
        <div
          id="dropdown"
          className="dropdown relative flex h-10 w-full items-center overflow-y-scroll rounded-s border border-gray-300 bg-gray-50 px-2 text-gray-900 focus:border-2 focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          tabIndex={0}
          onClick={() => handleDropDown()}
        >
          {selectedItems.length < 1 ? (
            <span className="text-gray-500 dark:text-gray-400">None</span>
          ) : (
            selectedItems?.map((item, key) => (
              <span
                key={key}
                id={item.id}
                className="me-2 inline-flex items-center text-nowrap rounded-xs bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              >
                {item.label}
                <button
                  type="button"
                  className="rounded-sm ms-2 inline-flex items-center bg-transparent p-1 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                  aria-label="Remove"
                  onClick={deleteItem}
                >
                  <FaXmark className="pointer-events-none h-3 w-3" />
                  <span className="sr-only">Remove badge</span>
                </button>
              </span>
            ))
          )}
        </div>
        <div
          ref={dropdownList}
          className={`dropdown-content ${!isDropdownOpen ? "hidden" : ""} absolute left-0 z-50 mt-1 flex h-max w-full flex-col gap-y-2 overflow-y-auto rounded-s border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700`}
        >
          {clonedChildren}
        </div>
      </div>
    </div>
  );
}

export { Input, Checkbox, RSelect, MultiSelect };
