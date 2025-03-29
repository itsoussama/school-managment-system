import { useAppSelector } from "@src/hooks/useReduxEvent";
import { BrandColor, colorPalette, Colors } from "@src/utils/colors";
import { Avatar, AvatarProps } from "flowbite-react";
import React, {
  createContext,
  CSSProperties,
  HTMLAttributes,
  JSXElementConstructor,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { IconBaseProps, IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";

interface EventProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface EventItemProps extends HTMLAttributes<HTMLDivElement> {
  avatar?: string;
  accountStatus?: AvatarProps["status"];
  readStatus?: "read" | "unread";
  message: React.ReactNode;
  time: string;
  badgeColor?: keyof Colors;
  badgeIcon?: JSXElementConstructor<IconBaseProps>;
  rounded?: boolean;
  link?: string;
}

interface EventDropdownProps extends EventProps {
  trigger: React.ReactNode;
}

interface EventContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultEventContext: EventContextProps = {
  isOpen: false,
  setIsOpen: () => false,
};

const EventContext = createContext<EventContextProps>(defaultEventContext);

function Event({ children, trigger }: EventDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      if (
        triggerRef.current &&
        dropdownRef.current &&
        triggerRef.current.parentElement
      ) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        setDropdownStyles({
          top:
            triggerRect.bottom +
            triggerRef.current?.clientHeight +
            window.scrollY,
          left:
            triggerRect.left +
            window.scrollX -
            dropdownRef.current?.clientWidth / 2,
        });
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const dropdownContent = (
    <div
      ref={dropdownRef}
      id="dropdownEvent"
      style={dropdownStyles}
      className={`absolute z-20 ${
        isOpen ? "block" : "hidden"
      } w-full max-w-sm divide-y divide-gray-200 rounded-lg bg-white dark:divide-gray-700 dark:bg-gray-800`}
      aria-labelledby="dropdownEventButton"
    >
      {children}
    </div>
  );

  return (
    <EventContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        <div ref={triggerRef} onClick={toggleDropdown}>
          {trigger}
        </div>
        {ReactDOM.createPortal(dropdownContent, document.body)}
      </div>
    </EventContext.Provider>
  );
}

Event.Header = function Header({ children }: EventProps) {
  return (
    <div className="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700 shadow-sharp-dark dark:bg-gray-800 dark:text-white dark:shadow-sharp-light">
      {children}
    </div>
  );
};

Event.Body = function Body({ children }: EventProps) {
  return (
    <div className="divide-y divide-gray-200 bg-gray-100 dark:divide-gray-700 dark:bg-gray-750">
      {children}
    </div>
  );
};

Event.Item = function Item({
  avatar,
  accountStatus,
  readStatus,
  message,
  time,
  badgeColor = "blue",
  badgeIcon,
  rounded,
  link,
}: EventItemProps) {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => link && navigate(link)}
      className={`relative flex px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 ${readStatus === "unread" ? "bg-[var(--brand-color-100)] dark:bg-[var(--brand-color-950)]" : ""} ${link ? "cursor-pointer" : "cursor-auto"} ${rounded ? "rounded-m" : ""}`}
      style={
        {
          "--brand-color-950": colorPalette[brandState as BrandColor][950],
          "--brand-color-100": colorPalette[brandState as BrandColor][100],
          "--events-color-900": colorPalette[badgeColor][900],
          "--events-color-500": colorPalette[badgeColor][500],
          "--events-color-100": colorPalette[badgeColor][100],
        } as CSSProperties
      }
    >
      <div className="relative shrink-0">
        {avatar ? (
          <Avatar
            img={avatar}
            rounded
            status={accountStatus}
            statusPosition="bottom-right"
          />
        ) : (
          <div
            // className={`absolute -mt-5 ms-6 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-color-50)] bg-opacity-10`}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-[var(--events-color-100)] dark:bg-[var(--events-color-900)]`}
          >
            <IconContext.Provider
              value={{
                className: "text-gray-500 dark:text-gray-400",
              }}
            >
              {badgeIcon &&
                React.createElement(badgeIcon, {
                  size: "20px",
                  className:
                    "text-[var(--events-color-500)] dark:text-[var(--events-color-500)]",
                })}
            </IconContext.Provider>
          </div>
        )}
      </div>
      <div className="w-full ps-2">
        <div className="mb-1.5 text-sm text-gray-600 dark:text-gray-200">
          {message}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500">{time}</div>
      </div>
      <div className="relative ms-5">
        {readStatus === "unread" && <Indicator position="top-right" />}
      </div>
    </div>
  );
};

Event.Footer = function Footer({
  children,
  link,
}: EventProps & { link?: string }) {
  const navigate = useNavigate();
  const { setIsOpen } = useContext(EventContext);

  const handleOnClick = () => {
    if (link) {
      navigate(link);
      setIsOpen(false);
    }
  };
  return (
    <div
      onClick={() => handleOnClick()}
      className={`block rounded-b-lg bg-gray-50 py-2 text-center text-sm font-medium text-gray-900 shadow-sharp-dark-buttom hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:shadow-sharp-light-buttom dark:hover:bg-gray-700 ${link ? "cursor-pointer" : "cursor-auto"}`}
    >
      <div className="inline-flex items-center">{children}</div>
    </div>
  );
};

interface IndicatorProps {
  motion?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

function Indicator({ motion = false, position = "top-left" }: IndicatorProps) {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const elementPosition = (): Partial<CSSProperties> => {
    switch (position) {
      case "top-left":
        return {
          position: "absolute",
          top: "0",
          left: "0",
        };
      case "top-right":
        return {
          position: "absolute",
          top: "0",
          right: "0",
        };
      case "bottom-left":
        return {
          position: "absolute",
          bottom: "0",
          left: "0",
        };
      case "bottom-right":
        return {
          position: "absolute",
          bottom: "0",
          right: "0",
        };
    }
  };
  return (
    <span
      className={`flex h-2 w-2 rounded-full`}
      style={{
        position: elementPosition().position,
        left: elementPosition().left,
        top: elementPosition().top,
        right: elementPosition().right,
        bottom: elementPosition().bottom,
      }}
    >
      <span
        className={`absolute inline-flex h-full w-full ${motion ? "animate-ping" : ""} rounded-full bg-[var(--brand-color-500)] opacity-75`}
        style={
          {
            "--brand-color-500": colorPalette[brandState as BrandColor][500],
          } as CSSProperties
        }
      ></span>
      <span
        className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-color-500)]"
        style={
          {
            "--brand-color-500": colorPalette[brandState as BrandColor][500],
          } as CSSProperties
        }
      ></span>
    </span>
  );
}

export { Event, Indicator };
