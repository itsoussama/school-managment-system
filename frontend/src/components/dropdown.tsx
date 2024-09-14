import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { FaUser } from "react-icons/fa6";

interface DropdownListButton {
  children: ReactNode;
  position?: EventTarget;
  elemId?: string;
}
interface ListProps {
  children: ReactNode;
}
interface ItemProps {
  img: string;
  name: string;
}

interface Button {
  children: React.ReactNode;
}

function DropdownListButton({
  children,
  position,
  elemId,
}: DropdownListButton) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    maxHeight: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const subComponentList = Object.keys(DropdownListButton);

  const subComponents = subComponentList.map((key) => {
    return React.Children.map(children, (child) =>
      child?.type.name === key ? child : null,
    );
  });

  const onToggleDropDown = useCallback(
    (event: MouseEvent) => {
      const element = position as HTMLDivElement;

      // if (dropdownRef.current) {
      if (
        dropdownRef.current &&
        element &&
        !dropdownRef.current.contains(event.target as Node) &&
        !element.contains(event.target as Node)
      ) {
        setIsVisible(false);
      } else {
        if (elemId == element.dataset.id) {
          const rect = element.getBoundingClientRect();
          const availableSpace = window.innerHeight - rect?.bottom;

          setDropdownPosition({
            top: rect?.top + element.clientHeight,
            left: rect?.left,
            maxHeight: Math.max(availableSpace - 20, 70),
          });
          setIsVisible(true);
        }
      }

      // }
    },
    [position],
  );

  // useEffect(() => {
  //   onVisible();
  // }, [onVisible]);

  useEffect(() => {
    // console.log(visible);

    document.addEventListener("mouseover", onToggleDropDown);
    // // dropdownRef.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseover", onToggleDropDown);
      //   // triggerElement.removeEventListener("mouseleave", handleMouseLeave);
    };
    // console.log(position);
  }, [onToggleDropDown]);

  return ReactDOM.createPortal(
    <div
      // id="dropdownUsers"
      ref={dropdownRef}
      className={`absolute ${!isVisible ? "hidden" : ""} z-10 flex w-56 flex-col rounded-lg bg-white shadow dark:bg-gray-700`}
      style={{
        top: dropdownPosition?.top,
        left: dropdownPosition?.left,
        maxHeight: dropdownPosition?.maxHeight,
      }}
    >
      {subComponents.map((component) => component)}
    </div>,
    document.body,
  );
}

function List({ children }: ListProps) {
  return (
    <ul
      className="max-h-[inherit] overflow-y-auto py-2 text-gray-700 dark:text-gray-200"
      aria-labelledby="dropdownUsersButton"
    >
      {children}
    </ul>
  );
}

function Item({ img, name }: ItemProps) {
  return (
    <li>
      <div className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        <img className="me-2 h-6 w-6 rounded-full" src={img} alt={name} />
        {name}
      </div>
    </li>
  );
}

function Button({ children }: Button) {
  return (
    <div className="flex cursor-pointer items-center rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-gray-600">
      <FaUser className="me-2" />
      {children}
    </div>
  );
}

DropdownListButton.List = List;
DropdownListButton.Item = Item;
DropdownListButton.Button = Button;

export { DropdownListButton };
