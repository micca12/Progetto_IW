import { ref, watch } from "vue";

// Inizializzazione immediata da localStorage per evitare flash del tema sbagliato
function getInitialTheme(): boolean {
  if (typeof localStorage === "undefined" || typeof window === "undefined") {
    return false;
  }
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored === "dark" || (!stored && prefersDark);
}

const isDark = ref(getInitialTheme());

// Applica tema iniziale immediatamente
if (typeof document !== "undefined" && isDark.value) {
  document.documentElement.classList.add("dark");
}

export function useDarkMode() {
  function toggle() {
    isDark.value = !isDark.value;
  }

  function setDarkMode(value: boolean) {
    isDark.value = value;
  }

  // Sync con DOM e localStorage
  watch(isDark, (value) => {
    if (value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return {
    isDark,
    toggle,
    setDarkMode,
  };
}
