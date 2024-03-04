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

  console.log(isDark)
  document.documentElement.classList[isDark ? "add" : "remove"]("dark");

  if (typeof localStorage !== "undefined") {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
}

document.addEventListener('astro:before-swap', ev => {
  // Pasa el documento entrante para establecer el tema en él
  setDarkMode();
});