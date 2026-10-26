export const THEME_KEY = "rudransh-theme";

/**
 * Runs in <head> before the page paints, so there is no light/dark flash.
 * Saved choice wins; otherwise follow the operating system setting.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var dark=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;
