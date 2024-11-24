const customTooltip = {
    "arrow": {
      "base": "absolute z-10 h-2 w-2 rotate-45",
      "style": {
        "dark": "bg-gray-900",
        "light": "bg-white",
        "auto": "bg-white dark:bg-gray-900"
      },
      "placement": "-4px"
    },
    "base": "absolute z-10 inline-block rounded-s px-3 py-1.5 text-xs font-medium shadow-sm",
    "hidden": "invisible opacity-0",
    "style": {
      "dark": "bg-gray-900 text-white",
      "light": "border border-gray-200 bg-white text-gray-900",
      "auto": "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-900 dark:text-white"
    },
    "content": "relative z-20"
  }

  export {customTooltip}