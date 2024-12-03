import { ReactNode, useState } from "react";
import { FaChevronDown, FaPen, FaTrash } from "react-icons/fa";

interface Accordion {
  children: ReactNode;
}

interface Body extends Accordion {
  title: string;
}

interface Section extends Accordion {
  "addtional-style": {
    containerStyle: string;
  };
}

interface Button extends Accordion {}

function Accordion({ children, title }: Body) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
        <div className="group flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <FaPen
            size={14}
            className="ms-2 hidden text-gray-400 group-hover:block dark:text-gray-500"
          />
        </div>

        <div className="flex flex-row items-center gap-3 text-gray-400 dark:text-gray-500">
          <FaTrash />
          <FaChevronDown onClick={() => setIsCollapsed((prev) => !prev)} />
        </div>
      </div>
      {isCollapsed && <div className="panel-content">{children}</div>}
    </div>
  );
}

Accordion.section = function section({
  children,
  "addtional-style": { containerStyle },
}: Section) {
  return (
    <div
      className={`animate-scale-up mt-2 h-auto max-h-0 overflow-hidden rounded-s bg-light-primary shadow-sharp-dark transition-[height] dark:bg-dark-primary dark:shadow-sharp-light ${containerStyle}`}
    >
      {children}
    </div>
  );
};

export default Accordion;
