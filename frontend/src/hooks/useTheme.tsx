import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function UseTheme() {
  const [state, setState] = useState<Theme>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const themeChange = (ev: MediaQueryListEvent) => {
    // console.log(ev);
    if (ev.matches) {
      setState("dark");
    } else {
      setState("light");
    }
  };

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQueryList.addEventListener("change", themeChange);

    return () => mediaQueryList.removeEventListener("change", themeChange);
  }, []);

  return state;
}
