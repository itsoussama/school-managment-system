import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import { UseTheme } from "@hooks/useTheme";
import { FaBell, FaCalendar, FaCompress, FaExpand } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";

interface Layout {
  children: React.ReactNode;
  menu: React.ReactElement;
  role?: string;
}

export function Layout({ children, menu }: Layout) {
  const [theme, setTheme] = UseTheme();
  const [isFullScreen, toggleFullScreen] = useState<boolean>(false);

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
        {menu}
      </div>
      <div className="mx-6 my-6 flex-1">
        <div className="flex h-12 justify-between border-white">
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
        {children}
      </div>
    </div>
  );
}
