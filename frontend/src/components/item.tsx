import { hoverContext } from "@src/features/context/hoverContext";
import useBreakpoint from "@src/hooks/useBreakpoint";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

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
}: Item) {
  const { t } = useTranslation();
  const maxXxl = useBreakpoint("min", "2xl");

  const { isOnHover } = useContext(hoverContext);
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div className="w-full">
      {/* {location.state} */}
      <div
        id={itemId}
        className={`relative flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === itemId && `${maxXxl || isOnHover ? "bg-gray-100 dark:bg-gray-700" : location.state?.active && "after:max-2xl:absolute after:max-2xl:right-0 after:max-2xl:top-0 after:max-2xl:h-full after:max-2xl:w-1 after:max-2xl:translate-x-3 after:max-2xl:rounded-xs after:max-2xl:bg-blue-600"}`} ${isActive ? (isOnHover || maxXxl ? "bg-blue-600" : "after:max-2xl:absolute after:max-2xl:right-0 after:max-2xl:top-0 after:max-2xl:h-full after:max-2xl:w-1 after:max-2xl:translate-x-3 after:max-2xl:rounded-xs after:max-2xl:bg-blue-600") : ""}`}
        onClick={() => onToggleSubMenu(itemId)}
      >
        {icon}
        <span
          className={`text-s text-nowrap ${!isOnHover ? "max-2xl:hidden" : ""} ${isActive ? "text-white" : "text-gray-900 dark:text-gray-100"}`}
        >
          {t(itemName)}
        </span>
        {children &&
          (subMenuVisible.state && subMenuVisible.ref === itemId ? (
            <FaChevronUp
              className={`ml-auto text-xs ${!isOnHover ? "max-2xl:hidden" : ""} text-gray-900 dark:text-gray-100`}
            />
          ) : (
            <FaChevronDown
              className={`ml-auto text-xs ${!isOnHover ? "max-2xl:hidden" : ""} text-gray-900 dark:text-gray-100`}
            />
          ))}
      </div>
      <div
        className={`${!maxXxl && !isOnHover ? "hidden" : ""} flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === itemId ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
      >
        <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
