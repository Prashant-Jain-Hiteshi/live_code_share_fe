module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e41c44",
        "primary-black": "#111927",
        secondary: "#6c737f",
        error: "#f04438",
        warning: "#b54708",
        "primary-light": "#ffe0de",
        success: "#107569",
        background: "#efefef",
        darkBg: "#8c3737",
      },
      fontFamily: {
        default: ["Inter", "sans-serif"],
        primary: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      screens: {
        xs: "360px", // custom breakpoint
      },
    },
  },
  plugins: [],
};
