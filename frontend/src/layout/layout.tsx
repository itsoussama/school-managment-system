import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import logo_minimize from "@assets/icon.png";
import { UseTheme } from "@hooks/useTheme";
import {
  FaBell,
  FaCalendar,
  FaCompress,
  FaExpand,
  FaGripLines,
} from "react-icons/fa";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaArrowRightFromBracket, FaMessage } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { hoverContext } from "@context/hoverContext";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxEvent";
import { Dropdown } from "flowbite-react";
import { logout } from "@src/features/redux/userAsyncActions";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import ReactDOM from "react-dom";
// import { MegaMenu } from "flowbite-react";

interface Layout {
  children: React.ReactNode;
  menu: React.ReactElement;
  role?: string;
}

interface DateTime {
  date: string;
  time: string;
}

export function Layout({ children, menu }: Layout) {
  const { t } = useTranslation();
  const { isOnHover, setIsOnHover } = useContext(hoverContext);
  const [theme, setTheme] = UseTheme();
  const [openMobileMenu, toggleOpenMobileMenu] = useState<boolean>(false);
  const [isFullScreen, toggleFullScreen] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState<DateTime>({ date: "", time: "" });
  const minXxl = useBreakpoint("min", "2xl");
  const authUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const route = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toggleFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      toggleFullScreen(false);
    }
  };

  const onMouseEnter = () => {
    setIsOnHover(true);
  };
  const onMouseLeave = () => {
    setIsOnHover(false);
  };

  const getMyIANATZ = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const handleDateTime = useCallback(
    (options: Intl.DateTimeFormatOptions, date: number): string => {
      return new Intl.DateTimeFormat(t("locales"), options).format(date);
    },
    [t],
  );

  const handleLogout = () => {
    dispatch(logout()).then(
      (res) => res.meta.requestStatus == "fulfilled" && route("/login"),
    );
  };

  const handleToggleMobilMenu = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      mobileMenuButtonRef.current &&
      !mobileMenuButtonRef.current.contains(event.target as Node)
    ) {
      toggleOpenMobileMenu(false);
    }
  };

  useEffect(() => {
    setDateTime({
      time: handleDateTime({ timeStyle: "short" }, Date.now()),
      date: handleDateTime({ dateStyle: "full" }, Date.now()),
    });
  }, [handleDateTime]);

  useEffect(() => {
    setInterval(() => {
      setDateTime((prev: DateTime) => ({
        ...prev,
        time: handleDateTime({ timeStyle: "short" }, Date.now()),
      }));
    }, 60 * 1000);

    return clearInterval(60 * 1000);
  }, [handleDateTime]);

  useEffect(() => {
    setInterval(
      () => {
        setDateTime((prev: DateTime) => ({
          ...prev,
          date: handleDateTime({ dateStyle: "full" }, Date.now()),
        }));
      },
      24 * 60 * 60 * 1000,
    );

    return clearInterval(24 * 60 * 60 * 1000);
  }, [handleDateTime]);

  useEffect(() => {
    document.addEventListener("click", handleToggleMobilMenu);
    return () => {
      document.removeEventListener("click", handleToggleMobilMenu);
    };
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  useEffect(() => {
    toggleOpenMobileMenu(false);
  }, [location]);

  return (
    <div
      className={`relative flex h-full w-full flex-1 ${theme === "dark" ? "dark" : ""}`}
    >
      <div
        className={`z-[10] hidden h-full overflow-hidden bg-light-primary sm:absolute sm:block sm:p-3 md:min-w-fit 2xl:relative ${isOnHover ? "sm:w-max" : "sm:w-16"} transition-all dark:bg-dark-primary`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`flex ${!minXxl && !isOnHover ? "min-h-16" : "min-h-20"} items-start justify-start transition-all`}
        >
          <img
            className={`mx-auto mt-3 transition-all ${!minXxl && !isOnHover ? "w-7" : ""}`}
            src={
              minXxl || isOnHover
                ? theme === "dark"
                  ? logo_dark
                  : logo_light
                : logo_minimize
            }
            // width={"150px"}
            alt="logo"
          />
        </div>
        {/* <div className="my-4 w-full border-t border-gray-300 dark:border-gray-700"></div> */}

        {menu}
      </div>
      <div
        className={`w-[75%] flex-1 transition-all sm:mx-8 sm:my-6 2xl:ms-8 ${isOnHover ? "sm:ms-0" : "sm:ms-24"}`}
      >
        {/* //? screen size above 640px*/}
        <div className="hidden h-12 w-full justify-between border-white sm:flex">
          <div className="date text-right font-semibold text-white">
            <div className="text-gray-900 dark:text-gray-100">
              {dateTime?.date}
            </div>
            <div className="text-lg text-blue-600">{dateTime?.time}</div>
          </div>
          <div className="top-bar flex gap-4">
            <div className="channels flex items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <div className="notifications relative">
                <span className="absolute flex h-2 w-2 rounded-full">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                </span>
                <FaBell className="text-xl text-gray-500" />
              </div>
              <div className="messages relative">
                {/* <span className="rounded-full absolute flex h-2 w-2">
                  <span className="rounded-full absolute inline-flex h-full w-full animate-ping bg-sky-400 opacity-75"></span>
                  <span className="rounded-full relative inline-flex h-2 w-2 bg-sky-500"></span>
                </span> */}
                <FaMessage className="mt-0.5 text-lg text-gray-500" />
              </div>
              <div className="events relative">
                {/* <span className="rounded-full absolute flex h-2 w-2">
                  <span className="rounded-full absolute inline-flex h-full w-full animate-ping bg-sky-400 opacity-75"></span>
                  <span className="rounded-full relative inline-flex h-2 w-2 bg-sky-500"></span>
                </span> */}
                <FaCalendar className="mb-0.5 text-lg text-gray-500" />
              </div>
            </div>
            <Dropdown
              label
              theme={{
                floating: {
                  base: "z-10 w-fit divide-y divide-gray-100 rounded-xs shadow-sharp-dark dark:shadow-sharp-light focus:outline-none",
                },
              }}
              dismissOnClick={false}
              renderTrigger={() => (
                <div className="profile flex cursor-pointer items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://i.pravatar.cc/300?img=12"
                      alt=""
                    />

                    <div className="text-sm font-medium dark:text-white">
                      <div>{authUser.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Joined in August 2014
                      </div>
                    </div>
                  </div>
                </div>
              )}
            >
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                className="items-center justify-between font-medium text-red-600 hover:!bg-red-600 hover:text-white"
              >
                Sign out
                <FaArrowRightFromBracket size={12} />
              </Dropdown.Item>
            </Dropdown>

            <div className="display flex items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              {isFullScreen ? (
                <FaCompress
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={onToggleFullScreen}
                />
              ) : (
                <FaExpand
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={onToggleFullScreen}
                />
              )}
              {theme === "dark" ? (
                <MdLightMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("light")}
                />
              ) : (
                <MdDarkMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("dark")}
                />
              )}
            </div>
          </div>
        </div>
        {/* //? top bar screen size below 640px */}
        <div className="flex h-16 w-full items-center border-white bg-gray-800 px-6 py-4 sm:hidden">
          <div className="flex gap-x-3">
            <img
              className={`w-7 object-contain transition-all`}
              src={logo_minimize}
              // width={"150px"}
              alt="logo"
            />
            <button
              ref={mobileMenuButtonRef}
              onClick={() => toggleOpenMobileMenu((prev) => !prev)}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              <FiMenu size={"24"} />
            </button>
          </div>
          {ReactDOM.createPortal(
            <div
              ref={mobileMenuRef}
              className={`absolute top-0 z-[10] h-full overflow-hidden bg-light-primary shadow-md outline outline-[rgba(0,0,0,0.5)] transition-all ${openMobileMenu ? "w-1/2 min-w-fit p-3 outline-[9999px]" : "w-0 outline-[0px]"} sm:hidden dark:bg-dark-primary`}
            >
              <div
                className={`flex min-h-20 items-start justify-start transition-all`}
              >
                <img
                  className={`mx-auto mt-3 w-28 transition-all`}
                  src={theme === "dark" ? logo_dark : logo_light}
                  // width={"150px"}
                  alt="logo"
                />
              </div>
              {/* <div className="my-4 w-full border-t border-gray-300 dark:border-gray-700"></div> */}

              {menu}
            </div>,
            document.body,
          )}
        </div>
        <div className="mx-6 my-4 sm:m-0">{children}</div>
      </div>
    </div>
  );
}
