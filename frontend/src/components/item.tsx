import { hoverContext } from "@src/features/context/hoverContext";
import useBreakpoint from "@hooks/useBreakpoint";
import React, { CSSProperties, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { useAppSelector } from "@src/hooks/useReduxEvent";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

interface Item {
  itemId: string;
  itemName: string;
  icon?: React.ReactElement;
  isActive?: boolean;
  childActive?: string;
  children?: React.ReactNode;
  subMenuVisible?: SubMenuVisible;
  onToggleSubMenu?: (param: string) => void;
  containerClass?: string;
}

//   <FaUserTie className="mr-3 text-lg text-gray-500 dark:text-gray-100" />

export default function Items({
  itemId,
  itemName,
  icon,
  isActive = false,
  children,
  subMenuVisible = { ref: "", state: false },
  onToggleSubMenu = (param) => param,
  containerClass,
}: Item) {
  const min2xl = useBreakpoint("min", "2xl");
  const max2xl = useBreakpoint("max", "2xl");
  const minSm = useBreakpoint("min", "sm");
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);

  const { isOnHover } = useContext(hoverContext);
  const location = useLocation();

  // const className = customStyle?.className;

  return (
    <div className="w-full">
      {/* {location.state} */}
      <div
        id={itemId}
        className={`relative flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === itemId && `${isOnHover || max2xl || min2xl || !minSm ? "bg-gray-100 dark:bg-gray-700" : location.state?.active && "after:max-2xl:absolute after:max-2xl:right-0 after:max-2xl:top-0 after:max-2xl:h-full after:max-2xl:w-1 after:max-2xl:translate-x-3 after:max-2xl:rounded-xs after:max-2xl:bg-[var(--brand-color-600)]"}`} ${isActive ? (isOnHover || min2xl || !minSm ? "bg-[var(--brand-color-600)]" : "after:sm:absolute after:sm:right-0 after:sm:top-0 after:sm:h-full after:sm:w-1 after:sm:translate-x-3 after:sm:rounded-xs after:sm:bg-[var(--brand-color-600)]") : ""} ${containerClass}`}
        style={
          {
            "--brand-color-600": colorPalette[brandState as BrandColor][600],
          } as CSSProperties
        }
        onClick={() => onToggleSubMenu(itemId)}
      >
        {icon}
        <span
          className={`text-s max-w-44 overflow-hidden whitespace-nowrap ${!isOnHover ? "sm:hidden 2xl:block" : ""} ${isActive ? "max-w-max text-white" : "fade-text w-44 text-gray-900 dark:text-gray-100"}`}
        >
          {itemName}
        </span>
        {children &&
          (subMenuVisible.state && subMenuVisible.ref === itemId ? (
            <FaChevronUp
              className={`ml-auto text-xs ${!isOnHover ? "sm:hidden 2xl:block" : ""} text-gray-900 dark:text-gray-100`}
            />
          ) : (
            <FaChevronDown
              className={`ml-auto text-xs ${!isOnHover ? "sm:hidden 2xl:block" : ""} text-gray-900 dark:text-gray-100`}
            />
          ))}
      </div>
      <div
        className={`${!min2xl && !isOnHover ? "sm:hidden" : ""} flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === itemId ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
      >
        <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
