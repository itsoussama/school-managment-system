import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxEvent";
import { toggleThemeMode } from "@src/features/redux/preferenceSlice";

export type Theme = "dark" | "light" | "auto";

export function UseTheme(fallbackValue?: Theme) {
  //  todo: use localstorage to initiate mode
  const localstorage = window.localStorage;
  const [state, setState] = useState<Theme>(
    (localstorage.getItem("color-preferd") as Theme) ?? "",
  );
  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
  const dispatch = useAppDispatch();

  // todo: check if there is no initial value in the localstorage then add the default mode based on the device mode

  // const themeChange = useCallback(
  //   (ev: MediaQueryListEvent) => {
  //     if (ev.matches) {
  //       setState("dark");
  //       dispatch(toggleThemeMode("dark"));
  //       localstorage.setItem("color-preferd", "dark");
  //     } else {
  //       setState("light");
  //       dispatch(toggleThemeMode("light"));
  //       localstorage.setItem("color-preferd", "light");
  //     }
  //   },
  //   [localstorage, dispatch],
  // );

  const updateTheme = (value: Theme) => {
    dispatch(toggleThemeMode(value));
    return setState(value);
  };

  useEffect(() => {
    if (themeState) {
      localstorage.setItem("color-preferd", state);

      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

      switch (themeState) {
        case "dark":
          document.body.className = "dark";
          document.getElementById("layout")?.classList.add("dark");
          localstorage.setItem("color-preferd", "dark");
          break;
        case "light":
          document.body.className = "";
          document.getElementById("layout")?.classList.remove("dark");
          localstorage.setItem("color-preferd", "light");
          break;
        default:
          if (mediaQueryList.matches) {
            document.body.className = "dark";
            document.getElementById("layout")?.classList.add("dark");
            localstorage.setItem("color-preferd", "dark");
          } else {
            document.body.className = "";
            document.getElementById("layout")?.classList.remove("dark");
            localstorage.setItem("color-preferd", "light");
          }
          break;
      }

      if (!localstorage.getItem("color-preferd")) {
        localstorage.setItem(
          "color-preferd",
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        );
      }
    }
  }, [state, localstorage, themeState]);

  useEffect(() => {
    if (fallbackValue) {
      setState(fallbackValue);
    }
  }, [fallbackValue]);

  return [state, updateTheme] as const;
}
