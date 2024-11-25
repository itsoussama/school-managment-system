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
  useId,
  useRef,
  useState,
} from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { FaFileLines, FaXmark } from "react-icons/fa6";
import ReactDOM from "react-dom";
import { FileInput, Label } from "flowbite-react";
import { useTranslation } from "react-i18next";

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

interface TextArea extends Field, InputHTMLAttributes<HTMLTextAreaElement> {}
interface Checkbox extends Field, InputHTMLAttributes<HTMLInputElement> {
  image?: React.ReactNode;
}
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
          className={`rounded-s border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring-blue-600 disabled:opacity-40 sm:text-sm ${error && "border-red-600 dark:border-red-500"} block w-full p-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${inputStyle}`}
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

function RTextArea({
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
}: TextArea) {
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
        <textarea
          className={`rounded-s border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring-blue-600 disabled:opacity-40 sm:text-sm ${error && "border-red-600 dark:border-red-500"} block w-full p-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${inputStyle}`}
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
  image,
  ...attribute
}: Checkbox) {
  return (
    <div
      className={`flex items-center rounded-xs px-2 ${image ? "py-2" : "py-1"} hover:bg-gray-200 hover:dark:bg-gray-600 ${containerStyle}`}
    >
      <div className={`relative flex items-center ${wrapperInputStyle}`}>
        <input
          id={htmlFor}
          name={htmlFor}
          type="checkbox"
          className={`peer h-4 w-4 appearance-none rounded-xs border-gray-300 bg-gray-100 text-blue-600 checked:border-0 checked:bg-blue-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 ${inputStyle}`}
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
      <div
        className={`ml-2 flex flex-row items-center gap-x-2 text-sm ${wrapperLabelStyle}`}
      >
        {image}
        <label
          htmlFor={htmlFor}
          className={`text-gray-500 dark:text-gray-300 ${labelStyle}`}
        >
          {label}
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
          className={`block w-full rounded-s border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${inputStyle}`}
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
  externalSelectedItems = null,
}: MultiSelectProps & { externalSelectedItems?: SelectedData[] | null }) {
  const [selectedItems, setSelectedItems] = useState<Array<SelectedData>>(
    externalSelectedItems ?? [],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownStyles, setDropdownStyles] = useState<{
    width: number;
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);
  const dropdownUid = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownList = useRef<HTMLDivElement>(null);

  const handleItemsChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    let itemsCollection: SelectedData[];

    if (target.type === "checkbox") {
      const hasItem = selectedItems.find((item) => item.id === target.id);

      if (hasItem) {
        const newItemsSet = selectedItems.filter(
          (item) => item.id !== target.id,
        );
        itemsCollection = newItemsSet;
        setSelectedItems(newItemsSet);
      } else {
        itemsCollection = [
          ...selectedItems,
          { id: target.id, label: target.value },
        ];
        setSelectedItems(itemsCollection);
      }

      onSelectItem(itemsCollection); // Notify parent
    }
  };

  const deleteItem = (event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.target as HTMLSpanElement;

    // Uncheck the corresponding checkbox in the dropdown list
    document.getElementsByName(name).forEach((item) => {
      if ((item as HTMLInputElement).id == target.parentElement?.id) {
        (item as HTMLInputElement).checked = false;
      }
    });

    // Filter out the deleted item
    const newItemsSet = selectedItems.filter(
      (item) => item.id !== target.parentElement?.id,
    );
    setSelectedItems(newItemsSet);
    onSelectItem(newItemsSet); // Notify parent
  };

  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child as ReactElement, {
        onChange: handleItemsChange,
      });
    }
    return child;
  });

  const openDropDown = () => {
    setIsDropdownOpen(true);

    if (document.getElementById(dropdownUid)?.id == dropdownUid) {
      selectedItems.forEach((item) => {
        (document.getElementById(item.id) as HTMLInputElement).checked = true;
      });
    }

    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const availableSpace = window.innerHeight - rect.bottom;
      setDropdownStyles({
        width: rect.width,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        maxHeight: Math.max(availableSpace - 20, 150),
      });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(event.target as Node) &&
      !(dropdownList.current as HTMLDivElement)?.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if externalSelectedItems is different from selectedItems
    if (externalSelectedItems) {
      console.log(externalSelectedItems);

      setSelectedItems(externalSelectedItems);
    }
  }, [externalSelectedItems]);

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <div
          id={name}
          className="dropdown relative flex h-10 w-full items-center overflow-y-scroll rounded-s border border-gray-300 bg-gray-50 px-2 text-gray-900 focus:border-2 focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          tabIndex={0}
          onClick={() => openDropDown()}
        >
          {selectedItems.length < 1 ? (
            <span className="pointer-events-none select-none text-gray-500 dark:text-gray-400">
              None
            </span>
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
        {ReactDOM.createPortal(
          <div
            ref={dropdownList}
            id={dropdownUid}
            className="dropdown-content absolute left-0 z-50 mt-1 flex max-h-full flex-col gap-y-2 overflow-y-auto rounded-s border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700"
            style={{
              display: isDropdownOpen && dropdownStyles ? "flex" : "none",
              width: `${dropdownStyles?.width}px`,
              top: `${dropdownStyles?.top}px`,
              left: `${dropdownStyles?.left}px`,
              maxHeight: `${dropdownStyles?.maxHeight}px`,
            }}
          >
            {clonedChildren}
          </div>,
          document.body,
        )}
      </div>
    </div>
  );
}

interface DropZone {
  label?: string;
  onChange: (event: ChangeEvent) => void;
  "custom-style"?: {
    inputStyle?: string;
    labelStyle?: string;
    containerStyle?: string;
  };
}

function Dropzone({
  label,
  onChange,
  "custom-style": {
    inputStyle = "",
    labelStyle = "",
    containerStyle = "",
  } = {},
}: DropZone) {
  const [file, setFile] = useState<File>();
  const { t } = useTranslation();
  const fileDetailsPreview = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target?.files?.length) {
      const file = target?.files[0];
      setFile(file);
    }
  };

  const fileSizeConverter = (fileSize: number) => {
    const size = (number: number) => parseFloat(number.toFixed(2));
    if (fileSize >= Math.pow(1024, 3)) {
      return size(fileSize / Math.pow(1024, 3)) + " GB";
    } else if (fileSize >= Math.pow(1024, 2)) {
      return size(fileSize / Math.pow(1024, 2)) + " MB";
    } else if (fileSize >= Math.pow(1024, 1)) {
      return size(fileSize / Math.pow(1024, 1)) + " KB";
    } else {
      return size(fileSize) + " Bytes";
    }
  };

  return (
    <div
      className={`flex h-auto w-full flex-col justify-center ${containerStyle}`}
    >
      <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </span>
      <Label
        htmlFor="dropzone-file"
        className={`group flex h-full w-full cursor-pointer flex-col items-start justify-center overflow-x-auto rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-5 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${labelStyle}`}
      >
        <div className="w-full pb-6 pt-5" onClick={(e) => e.stopPropagation()}>
          {file ? (
            <div className="flex flex-row items-center justify-between">
              <div className="relative flex w-full max-w-[90%] items-center justify-start gap-3 overflow-x-auto">
                {/*  //todo: overflow fade prefer to be in component */}
                {/* <div className="sticky left-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-r to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
                <FaFileLines className="shrink-0" size={38} />
                <div className="text-start">
                  {file.name}{" "}
                  <div className="mt-1 text-gray-500 dark:text-gray-400">
                    {fileSizeConverter(file.size)}
                  </div>
                </div>
                {/* <div className="sticky right-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-l to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
              </div>
              <FaXmark
                className="self-start"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(undefined);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("maximum-size")}: 1024MB
              </p>
            </div>
          )}
        </div>
        <FileInput
          id="dropzone-file"
          className={`hidden ${inputStyle}`}
          onChange={(event) => (onChange(event), fileDetailsPreview(event))}
        />
      </Label>
    </div>
  );
}

export { Input, RTextArea, Checkbox, RSelect, MultiSelect, Dropzone };
