import { ChangeEvent, ReactNode, useState } from "react";
import { FaChevronDown, FaChevronUp, FaPen, FaTrash } from "react-icons/fa";
import { Input } from "./input";

interface Accordion {
  children: ReactNode;
}

interface Body extends Accordion {
  id: number;
  title: string;
  deleteItem?: () => void;
  onChange?: (event: ChangeEvent) => void;
  value?: string;
}

interface Section extends Accordion {
  "additional-style"?: {
    containerStyle?: string;
  };
}

function Accordion({ id, children, title, onChange, deleteItem, value }: Body) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
        <div className="group flex h-6 items-center">
          {editTitle ? (
            <input
              type="text"
              id={id.toString()}
              className="border-0 bg-transparent text-white focus:border-b focus:border-gray-300 focus:ring-0"
              onBlur={() => setEditTitle(false)}
              autoFocus={editTitle}
              value={value || ""}
              // placeholder={fieldsTrans("address-placeholder")}
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
                onClick={() => setEditTitle(true)}
              />
            </>
          )}
        </div>

        <div className="flex flex-row items-center gap-3 text-gray-400 dark:text-gray-500">
          <FaTrash className="cursor-pointer" onClick={deleteItem} />
          {isCollapsed ? (
            <FaChevronUp
              className="animate-fade-fwd cursor-pointer"
              onClick={() => setIsCollapsed((prev) => !prev)}
            />
          ) : (
            <FaChevronDown
              className="animate-fade-fwd cursor-pointer"
              onClick={() => setIsCollapsed((prev) => !prev)}
            />
          )}
        </div>
      </div>
      {isCollapsed && <div className="panel-content">{children}</div>}
    </div>
  );
}

Accordion.section = function section({
  children,
  "additional-style": { containerStyle = "" } = {},
}: Section) {
  return (
    <div
      className={`mt-2 h-auto max-h-0 animate-scale-up overflow-hidden rounded-s bg-light-primary shadow-sharp-dark transition-[height] dark:bg-dark-primary dark:shadow-sharp-light ${containerStyle}`}
    >
      {children}
    </div>
  );
};

export default Accordion;
