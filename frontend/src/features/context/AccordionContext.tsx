import { createContext, Dispatch, SetStateAction } from "react";

export type IsCollapsed = number;

interface AccordionContextProps {
  isCollapsed: IsCollapsed;
  setIsCollapsed: Dispatch<SetStateAction<IsCollapsed>>;
}

export const AccordionContext = createContext<AccordionContextProps>({
  isCollapsed: 0,
  setIsCollapsed: () => {},
});
