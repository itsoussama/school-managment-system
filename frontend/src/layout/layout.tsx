import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import logo_minimize from "@assets/icon.svg";
import { UseTheme } from "@hooks/useTheme";
import {
  FaBell,
  FaCalendar,
  FaChartPie,
  FaCog,
  FaCompress,
  FaExpand,
} from "react-icons/fa";
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaArrowRightFromBracket, FaMessage } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { hoverContext } from "@src/context/hoverContext";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@src/hooks/useReduxEvent";
import { Dropdown } from "flowbite-react";
import { logout } from "@src/store/actions/userAsyncActions";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import ReactDOM from "react-dom";
import { TabBar } from "@src/components/tabBar";
import { BrandColor, colorPalette } from "@src/utils/colors";
import { changeLanguage } from "i18next";
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

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function Layout({ children, menu }: Layout) {
  const { t } = useTranslation();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const langState = useAppSelector((state) => state.preferenceSlice.language);
  const { isOnHover, setIsOnHover } = useContext(hoverContext);
  const [theme, setTheme] = UseTheme();
  const [openMobileMenu, toggleOpenMobileMenu] = useState<boolean>(false);
  const [isFullScreen, toggleFullScreen] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState<DateTime>({ date: "", time: "" });
  const minXxl = useBreakpoint("min", "2xl");
  const authUser = useAppSelector((state) => state.userSlice.user);
  const themeState = useAppSelector((state) => state.preferenceSlice.themeMode);
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

  // const getMyIANATZ = () => {
  //   return Intl.DateTimeFormat().resolvedOptions().timeZone;
  // };

  const handleDateTime = useCallback(
    (options: Intl.DateTimeFormatOptions, date: number): string => {
      return new Intl.DateTimeFormat(t("general.locales"), options).format(
        date,
      );
    },
    [t],
  );

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

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
    toggleOpenMobileMenu(false);
  }, [location]);

  useEffect(() => {
    changeLanguage(langState);
  }, [langState]);
  return (
    <div id="layout" className={`relative flex w-full flex-1`}>
      <div className="relative z-[10] h-full">
        <div
          className={`left-0 top-0 hidden h-full max-h-screen overflow-y-auto border-r border-gray-300 bg-light-primary transition-all duration-200 sm:sticky sm:block sm:p-3 md:min-w-fit 2xl:sticky dark:border-gray-700 ${isOnHover ? "sm:w-8" : "sm:w-16"} dark:bg-dark-primary`}
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
                  ? themeState === "dark"
                    ? logo_dark
                    : themeState === "light"
                      ? logo_light
                      : themeState === "auto" &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
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
      </div>
      <div
        className={`flex w-[75%] flex-1 flex-col transition-all sm:my-6 sm:me-8 2xl:ms-8 ${isOnHover ? "sm:-ms-24" : "sm:ms-8"}`}
      >
        {/* //? screen size above 640px*/}
        <div className="hidden h-12 w-full justify-between border-white sm:flex">
          <div className="date text-right font-semibold text-white">
            <div className="text-gray-900 dark:text-gray-100">
              {dateTime?.date &&
                dateTime?.date.split("")[0].toUpperCase() +
                  dateTime?.date.slice(1)}
            </div>
            <div
              className="text-lg text-[var(--brand-color-500)]"
              style={
                {
                  "--brand-color-500":
                    colorPalette[brandState as BrandColor][500],
                } as CSSProperties
              }
            >
              {dateTime?.time}
            </div>
          </div>
          <div className="top-bar flex gap-4">
            <div className="channels flex items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <div className="notifications relative">
                <span className="absolute flex h-2 w-2 rounded-full">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-color-500)] opacity-75"
                    style={
                      {
                        "--brand-color-500":
                          colorPalette[brandState as BrandColor][500],
                      } as CSSProperties
                    }
                  ></span>
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-color-500)]"
                    style={
                      {
                        "--brand-color-500":
                          colorPalette[brandState as BrandColor][500],
                      } as CSSProperties
                    }
                  ></span>
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
              dismissOnClick={true}
              renderTrigger={() => (
                <div className="profile flex cursor-pointer items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-7 rounded-full"
                      src={
                        authUser.imagePath
                          ? SERVER_STORAGE + authUser.imagePath
                          : `https://ui-avatars.com/api/?background=random&name=${getUserName(authUser.name).firstName}+${getUserName(authUser.name).lastName}`
                      }
                      alt="profile"
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
              <Link to={"/profile"}>
                <Dropdown.Item>{t("general.profile")}</Dropdown.Item>
              </Link>
              <Link to={"/preference"}>
                <Dropdown.Item>{t("entities.preference")}</Dropdown.Item>
              </Link>
              <Dropdown.Item
                onClick={handleLogout}
                className="items-center justify-between font-medium text-red-600 hover:!bg-red-600 hover:text-white"
              >
                {t("general.sign_out")}
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
              {themeState === "dark" ? (
                <MdLightMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("light")}
                />
              ) : themeState === "light" ? (
                <MdDarkMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("dark")}
                />
              ) : window.matchMedia("(prefers-color-scheme: dark)").matches ? (
                <MdLightMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("light")}
                />
              ) : (
                <MdLightMode
                  className="cursor-pointer text-xl text-gray-500"
                  onClick={() => setTheme("dark")}
                />
              )}
            </div>
          </div>
        </div>
        {/* //? top bar screen size below 640px */}
        <div className="fixed z-50 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-light-primary px-6 py-4 sm:hidden dark:border-gray-700 dark:bg-dark-primary">
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
          <div className="notifications relative">
            <span className="absolute flex h-2 w-2 rounded-full">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-color-500)] opacity-75"
                style={
                  {
                    "--brand-color-400":
                      colorPalette[brandState as BrandColor][500],
                  } as CSSProperties
                }
              ></span>
              <span
                className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-color-500)]"
                style={
                  {
                    "--brand-color-600":
                      colorPalette[brandState as BrandColor][500],
                  } as CSSProperties
                }
              ></span>
            </span>
            <FaBell className="text-xl text-gray-500" />
          </div>
          {ReactDOM.createPortal(
            <div
              ref={mobileMenuRef}
              className={`fixed left-0 top-0 z-[9999] h-full min-w-fit overflow-hidden bg-light-primary p-3 outline outline-[#00000060] transition-all ${openMobileMenu ? "block outline-[9999px]" : "hidden outline-0"} sm:hidden dark:bg-dark-primary`}
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
        <div className="mx-6 my-4 h-full pb-20 pt-16 sm:m-0 sm:p-0">
          {" "}
          {/* h-full */}
          {children}
        </div>
        <TabBar>
          <TabBar.Item
            icon={<FaChartPie size={20} />}
            label="Overview"
            path="/"
            isActive={useMatch("/") ? true : false}
          />
          <TabBar.Item
            icon={<FaMessage size={20} />}
            label="Chats"
            path="/chats"
            isActive={useMatch("/chats") ? true : false}
          />
          <TabBar.Item
            icon={<FaCog size={20} />}
            label="Settings"
            path="/settings"
            isActive={useMatch("/settings") ? true : false}
          />
          <TabBar.Item
            icon={
              <img
                className="h-6 w-6 rounded-full"
                src="https://i.pravatar.cc/300?img=12"
                alt=""
              />
            }
            label="Profile"
            path="/profile"
            isActive={useMatch("/profile") ? true : false}
          />
        </TabBar>
      </div>
    </div>
  );
}
