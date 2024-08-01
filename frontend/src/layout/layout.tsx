import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import { UseTheme } from "@hooks/useTheme";
import {
  FaBell,
  FaCalendar,
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaCompress,
  FaExpand,
  FaLayerGroup,
  FaUserFriends,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FaMessage, FaScaleBalanced } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

export function Layout() {
  const [theme, setTheme] = UseTheme();
  const { t } = useTranslation();
  const [subMenuVisible, toggleSubMenuVisible] = useState<SubMenuVisible>({
    ref: "",
    state: false,
  });
  const [isFullScreen, toggleFullScreen] = useState<boolean>(false);

  const onToggleSubMenu = (item: string) => {
    toggleSubMenuVisible((prev) => ({
      ref: item,
      state: prev.ref !== item ? true : !prev.state,
    }));
  };

  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      toggleFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      toggleFullScreen(false);
    }
  };

  useEffect(() => {
    const style = getComputedStyle(document.body);
    document
      .getElementById("root")
      ?.style.setProperty(
        "background-color",
        style.getPropertyValue(
          theme === "dark" ? "--dark-secondary" : "--light-secondary",
        ),
      );
  }, [theme]);

  return (
    <div className={`flex flex-1 ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-[0_0_15%] bg-light-primary p-3 dark:bg-dark-primary">
        <img
          className="mx-auto mb-7 mt-3"
          src={theme === "dark" ? logo_dark : logo_light}
          width={"150px"}
          alt="logo"
        />
        <div className="menu">
          <div className="main-menu flex flex-col gap-y-2">
            <div
              className="rounded-s bg-blue-600"
              onClick={() => toggleSubMenuVisible({ ref: "", state: false })}
            >
              <Link to={"/"} className="flex w-full items-center px-2 py-3">
                <FaChartPie className="mr-3 text-lg text-white" />
                <span className="text-s text-white">{t("overview")}</span>
              </Link>
            </div>

            <div className="w-full">
              <div
                id="item-1"
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === "item-1" && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => onToggleSubMenu("item-1")}
              >
                <FaUserTie className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("teachers")}
                </span>
                {subMenuVisible.state && subMenuVisible.ref === "item-1" ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === "item-1" ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
              >
                <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
                <div className="flex w-full flex-col">
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s bg-blue-600 px-2 py-3"
                  >
                    <span className="text-s text-white">{t("parents")}</span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                id="item-2"
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === "item-2" && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => onToggleSubMenu("item-2")}
              >
                <FaUserGraduate className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("students")}
                </span>
                {subMenuVisible.state && subMenuVisible.ref === "item-2" ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === "item-2" ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
              >
                <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
                <div className="flex w-full flex-col">
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s bg-blue-600 px-2 py-3"
                  >
                    <span className="text-s text-white">{t("teachers")}</span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                id="item-3"
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === "item-3" && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => onToggleSubMenu("item-3")}
              >
                <FaUserFriends className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("parents")}
                </span>
                {subMenuVisible.state && subMenuVisible.ref === "item-3" ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === "item-3" ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
              >
                <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
                <div className="flex w-full flex-col">
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s bg-blue-600 px-2 py-3"
                  >
                    <span className="text-s text-white">{t("teachers")}</span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                id="item-4"
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === "item-4" && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => onToggleSubMenu("item-4")}
              >
                <FaScaleBalanced className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("finance")}
                </span>
                {subMenuVisible.state && subMenuVisible.ref === "item-4" ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === "item-4" ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
              >
                <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
                <div className="flex w-full flex-col">
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s bg-blue-600 px-2 py-3"
                  >
                    <span className="text-s text-white">{t("teachers")}</span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                id="item-5"
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible.state && subMenuVisible.ref === "item-5" && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => onToggleSubMenu("item-5")}
              >
                <FaLayerGroup className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("resources")}
                </span>
                {subMenuVisible.state && subMenuVisible.ref === "item-5" ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all duration-200 ${subMenuVisible.state && subMenuVisible.ref === "item-5" ? "my-3 max-h-96 delay-150" : "my-0 max-h-0"}`}
              >
                <div className="mx-4 border-r border-gray-300 dark:border-gray-700"></div>
                <div className="flex w-full flex-col">
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s bg-blue-600 px-2 py-3"
                  >
                    <span className="text-s text-white">{t("teachers")}</span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                  <Link
                    to={"/"}
                    className="flex w-full items-center justify-start rounded-s px-2 py-3"
                  >
                    <span className="text-s text-gray-900 dark:text-white">
                      {t("teachers")}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="mx-6 my-6 flex h-12 justify-between border-white">
          <div className="date text-right font-semibold text-white">
            <div className="text-gray-900 dark:text-gray-100">
              Mardi 12 juillet 2024
            </div>
            <div className="text-blue-600">20h30</div>
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
            <div className="profile flex items-center gap-4 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <div className="flex items-center gap-4">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://i.pravatar.cc/300"
                  alt=""
                />
                <div className="text-sm font-medium dark:text-white">
                  <div>Jese Leos</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined in August 2014
                  </div>
                </div>
              </div>
            </div>
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
        <Outlet />
      </div>
    </div>
  );
}
