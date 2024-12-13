const customTooltip = {
    "arrow": {
      "base": "absolute z-10 h-2 w-2 rotate-45",
      "style": {
        "dark": "bg-gray-900",
        "light": "bg-white",
        "auto": "bg-gray-600 dark:bg-gray-900"
      },
      "placement": "-4px"
    },
    "base": "absolute z-10 inline-block rounded-s px-3 py-1.5 text-xs font-medium shadow-sm",
    "hidden": "invisible opacity-0",
    "style": {
      "dark": "bg-gray-900 text-white",
      "light": "border border-gray-200 bg-white text-gray-900",
      "auto": "border border-gray-200 bg-gray-600 dark:border-none dark:bg-gray-900 text-white"
    },
    "content": "relative z-20"
  }

  const customBadge = {
    "root": {
      "base": "flex h-fit items-center gap-1 font-semibold",
      "color": {
        "info": "bg-cyan-100 text-cyan-800 group-hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-800 dark:group-hover:bg-cyan-300",
        "gray": "bg-gray-100 text-gray-800 group-hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-gray-600",
        "failure": "bg-red-100 text-red-800 group-hover:bg-red-200 dark:bg-red-200 dark:text-red-900 dark:group-hover:bg-red-300",
        "success": "bg-green-100 text-green-800 group-hover:bg-green-200 dark:bg-green-200 dark:text-green-900 dark:group-hover:bg-green-300",
        "warning": "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:group-hover:bg-yellow-300",
        "indigo": "bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 dark:bg-indigo-200 dark:text-indigo-900 dark:group-hover:bg-indigo-300",
        "purple": "bg-purple-100 text-purple-800 group-hover:bg-purple-200 dark:bg-purple-200 dark:text-purple-900 dark:group-hover:bg-purple-300",
        "pink": "bg-pink-100 text-pink-800 group-hover:bg-pink-200 dark:bg-pink-200 dark:text-pink-900 dark:group-hover:bg-pink-300",
        "blue": "bg-blue-100 text-blue-800 group-hover:bg-blue-200 dark:bg-blue-200 dark:text-blue-900 dark:group-hover:bg-blue-300",
        "cyan": "bg-cyan-100 text-cyan-800 group-hover:bg-cyan-200 dark:bg-cyan-200 dark:text-cyan-900 dark:group-hover:bg-cyan-300",
        "dark": "bg-gray-600 text-gray-100 group-hover:bg-gray-500 dark:bg-gray-900 dark:text-gray-200 dark:group-hover:bg-gray-700",
        "light": "bg-gray-200 text-gray-800 group-hover:bg-gray-300 dark:bg-gray-400 dark:text-gray-900 dark:group-hover:bg-gray-500",
        "green": "bg-green-100 text-green-800 group-hover:bg-green-200 dark:bg-green-200 dark:text-green-900 dark:group-hover:bg-green-300",
        "lime": "bg-lime-100 text-lime-800 group-hover:bg-lime-200 dark:bg-lime-200 dark:text-lime-900 dark:group-hover:bg-lime-300",
        "red": "bg-red-100 text-red-800 group-hover:bg-red-200 dark:bg-red-200 dark:text-red-900 dark:group-hover:bg-red-300",
        "orange": "bg-orange-100 text-orange-800 group-hover:bg-orange-200 dark:bg-orange-200 dark:text-orange-900 dark:group-hover:bg-orange-300",
        "teal": "bg-teal-100 text-teal-800 group-hover:bg-teal-200 dark:bg-teal-200 dark:text-teal-900 dark:group-hover:bg-teal-300",
        "yellow": "bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:group-hover:bg-yellow-300"
      },
      "href": "group",
      "size": {
        "xs": "p-1 text-xs",
        "sm": "p-1.5 text-sm"
      }
    },
    "icon": {
      "off": "rounded px-2 py-0.5",
      "on": "rounded-full p-1.5",
      "size": {
        "xs": "w-1.5 h-1.5",
        "sm": "h-3.5 w-3.5"
      }
    }
  }

  const customTable = 
  {
    root: {
      base: "w-full relative whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400",
      shadow:
        "absolute left-0 top-0 -z-10 h-full w-full rounded-s drop-shadow-lg",
      wrapper: "",
    },
    body: {
      cell: {
        base: "px-6 py-4",
      },
      
    },
    head: {
      cell: {
        base: "bg-gray-50 px-6 py-3 dark:bg-gray-700 ",
      },
    },
    row: {
      base: "group/row group",
      hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
      striped:
        "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
    },
  }

  const customToggleSwitch = {
    "root": {
      "base": "group flex rounded-lg focus:outline-none",
      "active": {
        "on": "cursor-pointer",
        "off": "cursor-not-allowed opacity-50"
      },
      "label": "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900 dark:text-gray-300"
    },
    "toggle": {
      "base": "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
      "checked": {
        "on": "after:translate-x-full after:border-white rtl:after:-translate-x-full",
        "off": "border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700",
        "color": {
          "blue": "border-cyan-700 bg-cyan-700",
          "dark": "bg-dark-700 border-dark-900",
          "failure": "border-red-900 bg-red-700",
          "gray": "border-gray-600 bg-gray-500",
          "green": "border-green-700 bg-green-600",
          "light": "bg-light-700 border-light-900",
          "red": "border-red-900 bg-red-700",
          "purple": "border-purple-900 bg-purple-700",
          "success": "border-green-500 bg-green-500",
          "yellow": "border-yellow-400 bg-yellow-400",
          "warning": "border-yellow-600 bg-yellow-600",
          "cyan": "border-cyan-500 bg-cyan-500",
          "lime": "border-lime-400 bg-lime-400",
          "indigo": "border-indigo-400 bg-indigo-400",
          "teal": "bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4",
          "info": "border-cyan-600 bg-cyan-600",
          "pink": "border-pink-600 bg-pink-600"
        }
      },
      "sizes": {
        "sm": "h-5 w-9 min-w-9 after:left-px after:top-px after:h-4 after:w-4 rtl:after:right-px",
        "md": "h-6 w-11 min-w-11 after:left-px after:top-px after:h-5 after:w-5 rtl:after:right-px",
        "lg": "h-7 w-14 min-w-14 after:left-1 after:top-0.5 after:h-6 after:w-6 rtl:after:right-1"
      }
    }
  }

  export {customTooltip, customBadge, customTable, customToggleSwitch}