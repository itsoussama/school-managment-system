import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

interface Item {
  itemId: string;
  itemName: string;
  icon?: React.ReactElement;
  children?: React.ReactNode;
  subMenuVisible?: SubMenuVisible;
  onToggleSubMenu?: (param: string) => void;
}

//   <FaUserTie className="mr-3 text-lg text-gray-500 dark:text-gray-100" />

export default function Items({
  itemId,
  itemName,
  icon,
  children,
  subMenuVisible = { ref: "", state: false },
  onToggleSubMenu = (param) => param,
}: Item) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div
        id={itemId}
        className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === itemId && "bg-gray-100 dark:bg-gray-700"}`}
        onClick={() => onToggleSubMenu(itemId)}
      >
        {icon}
        <span className="text-s text-gray-900 dark:text-white">
          {t(itemName)}
        </span>
        {children &&
          (subMenuVisible.state && subMenuVisible.ref === itemId ? (
            <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
          ) : (
            <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
          ))}
      </div>
      <div
        className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === itemId ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
      >
        <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
        <div className="flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
