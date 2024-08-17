import { createContext, Dispatch, SetStateAction } from "react";

interface HoverContextProps {
  isOnHover?: boolean;
  setIsOnHover: Dispatch<SetStateAction<boolean>>;
}

export const hoverContext = createContext<HoverContextProps>({
  isOnHover: false,
  setIsOnHover: () => {},
});
