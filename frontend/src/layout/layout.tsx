import logo_dark from "@assets/logo_dark.png";
import logo_light from "@assets/logo_light.png";
import { UseTheme } from "@hooks/useTheme";

export function Layout() {
  const theme = UseTheme();

  return (
    <div className="flex flex-1">
      <div className="flex-[0_0_15%] bg-light-primary dark:bg-dark-primary">
        <img
          src={theme === "dark" ? logo_dark : logo_light}
          width={"150px"}
          alt="logo"
        />
        <div></div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
