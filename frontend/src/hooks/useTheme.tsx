import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxEvent";
import { toggleThemeMode } from "@src/store/slices/preferenceSlice";

export type Theme = "dark" | "light" | "auto";

export function UseTheme(fallbackValue?: Theme) {
  //  todo: use localstorage to initiate mode

  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
  const [state, setState] = useState<Theme>((themeState as Theme) ?? "");

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
      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

      switch (themeState) {
        case "dark":
          document.body.className = "dark";
          document.getElementById("layout")?.classList.add("dark");
          dispatch(toggleThemeMode("dark"));
          break;
        case "light":
          document.body.className = "";
          document.getElementById("layout")?.classList.remove("dark");
          dispatch(toggleThemeMode("light"));
          break;
        default:
          if (mediaQueryList.matches) {
            document.body.className = "dark";
            document.getElementById("layout")?.classList.add("dark");
            dispatch(toggleThemeMode("dark"));
          } else {
            document.body.className = "";
            document.getElementById("layout")?.classList.remove("dark");
            dispatch(toggleThemeMode("light"));
          }
          break;
      }

      if (!themeState) {
        dispatch(
          toggleThemeMode(
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light",
          ),
        );
      }
    }
  }, [state, themeState, dispatch]);

  useEffect(() => {
    if (fallbackValue) {
      setState(fallbackValue);
    }
  }, [fallbackValue]);

  return [state, updateTheme] as const;
}
