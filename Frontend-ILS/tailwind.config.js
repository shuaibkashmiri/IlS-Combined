module.exports = {
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
        slideDown: "slideDown 0.2s ease-out",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      scale: {
        "102": "1.02",
      },
    },
  },
};
