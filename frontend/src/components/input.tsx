// import PropTypes from 'prop-types'
// import { FontAwesomeIcon } from '@htmlFortawesome/react-fontawesome'
// import { faCheck, faCircleExclamation } from '@htmlFortawesome/free-solid-svg-icons'
import { Children, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";

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
        <div className="mt-1.5">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <span className="error text-red-500">{error}</span>
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
          aria-describedby={htmlFor}
          className={`peer box-content h-4 w-4 appearance-none rounded-s border-gray-300 bg-gray-100 text-blue-600 checked:border-0 checked:bg-blue-800 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 ${inputStyle}`}
          {...attribute}
        />
        <FaCheck
          color="white"
          size="xs"
          className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 peer-checked:block"
        />
        {error && (
          <div className="mt-1.5">
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
          {Children.only(children)}
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
        <div className="mt-1.5">
          <FaExclamationCircle className="mr-2 text-red-500" />
          <span className="error text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}

function MultiSelect() {
  return (
    <>
      <div className="h-3 w-5 bg-red-500"></div>
    </>
  );
}

export { Input, Checkbox, RSelect, MultiSelect };
