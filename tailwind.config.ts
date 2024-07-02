import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#00CBBF",
        secondary: "#85E6C5",
        tertiary: "#2AEEE2",
        "secondary-text": "#32B7C5",
        "txt-yellow": "#39967C",
        "primary-gray": "#F2F2F2",
        "secondary-gray": "#828282",
        "tertiary-gray": "#E0E0E0",
      },
      fontFamily: {
        sans: ["Poppins"],
        "noto-naskh": ["Noto Naskh Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
