import forms from "@tailwindcss/forms";
// @import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
        ubuntu: ["Ubuntu", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        dosis: ["Dosis", "sans-serif"], // Add custom font
      },
      boxShadow: {
        "inner-custom": "inset 0 4px 4px 0 rgba(0, 0, 0, 0.1)",

        inner:
          "inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["focus"],
    },
  },

  plugins: [forms],
};
