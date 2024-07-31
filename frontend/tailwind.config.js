/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    borderRadius: {
      xs: "4px",
      s: "8px",
      m: "12px",
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
          "inset 0 1px 0 0 rgba(0, 0, 0, .06), 0 1px 3px 0 rgba(0, 0, 0, .13), 0 1px 2px -1px rgba(0, 0, 0, .1)",
        "sharp-light":
          "inset 0 1px 0 0 rgba(0, 0, 0, .06), 0 1px 0 -4px rgba(0, 0, 0, .09)",
      },
    },
  },
  plugins: [],
};
