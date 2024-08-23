import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwindcss/defaultConfig";

const fullConfig = resolveConfig(tailwindConfig);

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
type Prefix = "max" | "min";

export default function useBreakpoint(prefix: Prefix, breakpoint: Breakpoint) {
  const twBreakpoint = fullConfig.theme.screens;

  const [isBreakpointMatch, setisBreakpointMatch] = useState<boolean>(false);

  const checkBreakpointMatch = useCallback(() => {
    const mediaQuery = window.matchMedia(
      `(${prefix}-width: ${twBreakpoint[breakpoint]})`,
    );

    // setisBreakpointMatch(mediaQuery.matches ? true : false);
    setisBreakpointMatch(mediaQuery.matches);
  }, [breakpoint, prefix, twBreakpoint]);

  useLayoutEffect(() => {
    setisBreakpointMatch(
      window.matchMedia(`(${prefix}-width: ${twBreakpoint[breakpoint]})`)
        .matches,
    );
  }, [prefix, breakpoint, twBreakpoint]);

  useEffect(() => {
    window.addEventListener("resize", checkBreakpointMatch);

    return () => window.removeEventListener("resize", checkBreakpointMatch);
  }, [checkBreakpointMatch]);

  return isBreakpointMatch;
}
