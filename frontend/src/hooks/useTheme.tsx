import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "./useReduxEvent";
import { toggleThemeMode } from "@src/features/redux/themeModeSlice";

type Theme = "dark" | "light";

export function UseTheme() {
  //  todo: use localstorage to initiate mode
  const localstorage = window.localStorage;
  const [state, setState] = useState<Theme>(
    (localstorage.getItem("color-preferd") as Theme) ?? "dark",
  );
  const dispatch = useAppDispatch();

  // todo: check if there is no initial value in the localstorage then add the default mode based on the device mode
  // todo: when changing mode we want to change also the value in the local storage
  // todo: add a state changer in the output to dynamicly update the state in other components
  const themeChange = useCallback(
    (ev: MediaQueryListEvent) => {
      if (ev.matches) {
        setState("dark");
        dispatch(toggleThemeMode("dark"));
        localstorage.setItem("color-preferd", "dark");
      } else {
        setState("light");
        dispatch(toggleThemeMode("light"));
        localstorage.setItem("color-preferd", "light");
      }
    },
    [localstorage, dispatch],
  );

  const updateTheme = (value: Theme) => setState(value);

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

    if (!localstorage.getItem("color-preferd")) {
      localstorage.setItem(
        "color-preferd",
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );

      return;
    }

    mediaQueryList.addEventListener("change", themeChange);

    return () => mediaQueryList.removeEventListener("change", themeChange);
  }, [localstorage, themeChange]);

  useEffect(() => {
    if (state) {
      localstorage.setItem("color-preferd", state);
    }
  }, [state, localstorage]);

  return [state, updateTheme] as const;
}
