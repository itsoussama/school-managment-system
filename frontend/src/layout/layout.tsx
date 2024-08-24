import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import logo_minimize from "@assets/icon.png";
import { UseTheme } from "@hooks/useTheme";
import { FaBell, FaCalendar, FaCompress, FaExpand } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { hoverContext } from "@context/hoverContext";

interface Layout {
  children: React.ReactNode;
  menu: React.ReactElement;
  role?: string;
}

export function Layout({ children, menu }: Layout) {
  const [theme, setTheme] = UseTheme();
  const { isOnHover, setIsOnHover } = useContext(hoverContext);
  const minXxl = useBreakpoint("min", "2xl");
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

  const onMouseEnter = () => {
    setIsOnHover(true);
  };
  const onMouseLeave = () => {
    setIsOnHover(false);
  };

  useEffect(() => {
    // const style = getComputedStyle(document.body);
    // document
    //   .getElementById("root")
    //   ?.style.setProperty(
    //     "background-color",
    //     style.getPropertyValue(
    //       theme === "dark" ? "--dark-secondary" : "--light-secondary",
    //     ),
    //   );
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  return (
    <div className={`flex w-full flex-1 ${theme === "dark" ? "dark" : ""}`}>
      <div
        className={`z-[10] w-[18%] overflow-hidden bg-light-primary p-3 max-2xl:absolute max-2xl:h-full ${isOnHover ? "max-2xl:w-60" : "max-2xl:w-16"} transition-all dark:bg-dark-primary`}
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
        className={`mx-8 my-6 w-[82%] flex-1 transition-all ${isOnHover ? "max-2xl:ms-0" : "max-2xl:ms-24"}`}
      >
        <div className="flex h-12 w-full justify-between border-white">
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
                  src="https://i.pravatar.cc/300?img=12"
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
