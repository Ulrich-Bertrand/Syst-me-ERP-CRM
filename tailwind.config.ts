const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */

module.exports = {
  // darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Good
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
     
    },
    screens: {
      xs: {
        min: "300px",
        max: "768px"
      },
      // => @media (min-width: 410px and max-width 639) { ... }
      sm: {
        min: "769px",
        max: "949px"
      },
      // => @media (min-width: 640px and max-width: 767px) { ... }
      md: {
        min: "950px",
        //  max: "1023px"
      },
      // => @media (min-width: 768px and max-width: 1023px) { ... }
      lg: {
        min: "1024px",
        // max: "1279px" 
      },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }
      xl: {
        min: "1280px",
        //  max: "1535px"
      },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }
      "2xl": { min: "1536px" },
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    plugin(({ matchUtilities }) => {
      matchUtilities({
        perspective: (value) => ({
          perspective: value,
        }),
      });
    }),
  ],
}