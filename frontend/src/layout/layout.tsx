import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import { UseTheme } from "@hooks/useTheme";
import {
  FaChartPie,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function Layout() {
  const theme = UseTheme();
  const { t } = useTranslation();
  const [subMenuVisible, toggleSubMenuVisible] = useState<boolean>(true);
  return (
    <div className="flex flex-1">
      <div className="flex-[0_0_15%] bg-light-primary p-3 dark:bg-dark-primary">
        <img
          className="mx-auto mb-7 mt-3"
          src={theme === "dark" ? logo_dark : logo_light}
          width={"150px"}
          alt="logo"
        />
        <div className="menu">
          <div className="main-menu flex flex-col gap-y-2">
            <div className="rounded-s bg-blue-600">
              <Link to={"/"} className="flex w-full items-center px-2 py-3">
                <FaChartPie className="text-lg mr-3 text-white" />
                <span className="text-s text-white">{t("overview")}</span>
              </Link>
            </div>
            <div className="w-full">
              <div
                className={`flex w-full cursor-pointer select-none items-center justify-start rounded-s px-2 py-3 ${subMenuVisible && "bg-gray-100 dark:bg-gray-700"}`}
                onClick={() => toggleSubMenuVisible((prev) => !prev)}
              >
                <FaUserTie className="text-lg mr-3 text-gray-500 dark:text-white" />
                <span className="text-s text-gray-900 dark:text-white">
                  {t("teachers")}
                </span>
                {subMenuVisible ? (
                  <FaChevronUp className="ml-auto text-xs text-gray-900 dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
                )}
              </div>
              <div
                className={`flex overflow-hidden transition-all ${subMenuVisible ? "my-3 max-h-96" : "my-0 max-h-0"}`}
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
            <div className="flex w-full items-center justify-start rounded-s px-2 py-3">
              <FaUserGraduate className="text-lg mr-3 text-gray-500 dark:text-white" />
              <span className="text-s text-gray-900 dark:text-white">
                {t("students")}
              </span>
              <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
            </div>
            <div className="flex w-full items-center justify-start rounded-s px-2 py-3">
              <FaUserGroup className="text-lg mr-3 text-gray-500 dark:text-white" />
              <span className="text-s text-gray-900 dark:text-white">
                {t("parents")}
              </span>
              <FaChevronDown className="ml-auto text-xs text-gray-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
