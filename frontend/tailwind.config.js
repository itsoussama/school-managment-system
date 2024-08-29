import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    borderRadius: {
      xs: "4px",
      s: "8px",
      m: "12px",
      lg: "16px",
      full: "100%",
    },

    // fontSize: {
    //   l: "32px",
    //   m: "24px",
    //   s: "16px",
    //   xs: "14px",
    // },

    extend: {
      colors: {
        "light-primary": "#FFFFFF",
        "light-secondary": "#F5F5F5",
        "dark-primary": "#1F2A37",
        "dark-secondary": "#111928",
      },
      boxShadow: {
        "sharp-dark":
          "inset 0 1px 0 0 rgba(0, 0, 0, .07), 0 1px 2px -1px rgba(0, 0, 0, .2)",
        "sharp-light":
          "inset 0 1px 0 0 rgba(255, 255, 255, .06), 0 2px 3px -4px rgba(255, 255, 255, .1)",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
