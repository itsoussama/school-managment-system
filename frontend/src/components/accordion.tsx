import { AccordionContext, IsCollapsed } from "@src/context/AccordionContext";
import {
  ChangeEvent,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { FaChevronDown, FaChevronUp, FaPen, FaTrash } from "react-icons/fa";

interface Accordion {
  children: ReactNode;
}

interface Body extends Accordion {
  id: number;
  title: string;
  deleteItem?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onValidateChange?: () => void;
  value?: string;
  deletable?: boolean;
  editable?: boolean;
  customSideIcon?: ReactNode;
}

interface Section extends Accordion {
  "additional-style"?: {
    containerStyle?: string;
  };
}

function Accordion({ children }: Accordion) {
  const [isCollapsed, setIsCollapsed] = useState<IsCollapsed>(0);
  return (
    <AccordionContext.Provider
      value={{ isCollapsed: isCollapsed, setIsCollapsed: setIsCollapsed }}
    >
      {children}
    </AccordionContext.Provider>
  );
}

Accordion.container = function Container({
  id,
  title,
  children,
  onChange,
  onValidateChange,
  deleteItem,
  value,
  deletable = false,
  editable = false,
  customSideIcon,
}: Body) {
  const { isCollapsed, setIsCollapsed } = useContext(AccordionContext);
  const [editTitle, setEditTitle] = useState<boolean>(editable);
  const [isRendred, setIsRendred] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
        <div
          className="group flex h-6 cursor-default items-center"
          onClick={() => setEditTitle(true)}
        >
          {editTitle ? (
            <input
              type="text"
              id={id.toString()}
              className="border-0 bg-transparent text-xl text-white focus:border-b focus:border-gray-300 focus:ring-0"
              onBlur={() => (setEditTitle(false), onValidateChange?.())}
              autoFocus={editTitle}
              value={value || ""}
              placeholder={value}
              onChange={onChange}
            />
          ) : (
            <>
              <h1
                id="accordion-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h1>

              <FaPen
                size={14}
                className="outli ms-2 hidden cursor-pointer text-gray-400 group-hover:block dark:text-gray-500"
              />
            </>
          )}
        </div>

        {customSideIcon ?? (
          <div className="flex flex-row items-center gap-3 text-gray-400 dark:text-gray-500">
            {deletable && (
              <FaTrash className="cursor-pointer" onClick={deleteItem} />
            )}
            {isCollapsed === id ? (
              <FaChevronUp
                className="animate-fade-fwd cursor-pointer"
                onClick={() => setIsCollapsed(0)}
              />
            ) : (
              <FaChevronDown
                className="animate-fade-fwd cursor-pointer"
                onClick={() => (setIsRendred(true), setIsCollapsed(id))}
              />
            )}
          </div>
        )}
      </div>

      <div
        className={`panel-content max-h-0 overflow-hidden transition-[height] ${
          isRendred
            ? isCollapsed === id
              ? "animate-scale-up"
              : "animate-scale-down"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

Accordion.section = function section({
  children,
  "additional-style": { containerStyle = "" } = {},
}: Section) {
  return (
    <div
      className={`mt-2 h-auto overflow-hidden rounded-s bg-light-primary shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light ${containerStyle}`}
    >
      {children}
    </div>
  );
};

export default Accordion;
