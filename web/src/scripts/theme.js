const getThemePreference = () => {
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("theme")
  ) {
    return localStorage.getItem("theme");
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setDarkMode = () => {
  const isDark = getThemePreference() === "dark";
  document.documentElement.classList[isDark ? "add" : "remove"]("dark");
}


document.addEventListener('astro:after-swap', () => {
  console.log('dentro')
  setDarkMode();
});