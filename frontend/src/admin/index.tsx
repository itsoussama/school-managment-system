import Items from "@src/components/item";
import { Layout } from "@src/layout/layout";
import { useContext, useState } from "react";
import { hoverContext } from "@context/hoverContext";
import {
  FaChartPie,
  FaCog,
  FaLayerGroup,
  FaUserFriends,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import { Link, Outlet, useMatch } from "react-router-dom";
import useBreakpoint from "@hooks/useBreakpoint";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

export default function Admin() {
  const [isOnHover, setIsOnHover] = useState<boolean>(false);

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (!localStorage.getItem("accessToken")) {
  //     dispatch(login());
  //   }
  // }, [dispatch]);

  return (
    <hoverContext.Provider
      value={{ isOnHover: isOnHover, setIsOnHover: setIsOnHover }}
    >
      <Layout menu={<Menu />}>
        <Outlet />
      </Layout>
    </hoverContext.Provider>
  );
}

function Menu() {
  const [subMenuVisible, toggleSubMenuVisible] = useState<SubMenuVisible>({
    ref: "",
    state: false,
  });

  const { isOnHover } = useContext(hoverContext);

  const onToggleSubMenu = (item: string) => {
    toggleSubMenuVisible((prev) => ({
      ref: item,
      state: prev.ref !== item ? true : !prev.state,
    }));
  };

  // const isUriMatch = (uri: string) => {
  //   const match = useMatch('');
  //   return match;
  // };

  const maxXxl = useBreakpoint("min", "2xl");

  return (
    <div className="menu z-50 w-full">
      <div className="main-menu flex w-full flex-col gap-y-2">
        {/* <div
          className={`rounded-s ${useMatch("/") ? `relative bg-blue-600 ${!isOnHover ? "max-2xl:bg-transparent after:max-2xl:absolute after:max-2xl:right-0 after:max-2xl:top-0 after:max-2xl:h-full after:max-2xl:w-1 after:max-2xl:translate-x-3 after:max-2xl:rounded-xs after:max-2xl:bg-blue-600" : ""}` : ""}`}
        >
          <Link to={"/"} className="flex w-full items-center px-2 py-3">
            <FaChartPie
              className={`mr-3 flex-shrink-0 text-lg ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} ${useMatch("/") ? "text-white" : "text-gray-500 dark:text-gray-100"}`}
            />
            <span
              className={`text-s text-nowrap ${!isOnHover ? "max-2xl:hidden" : ""} ${useMatch("/") ? "text-white" : "text-gray-900 dark:text-gray-100"}`}
            >
              {t("overview")}
            </span>
          </Link>
        </div> */}

        <Link to="/">
          <Items
            itemId="item-0"
            itemName="overview"
            isActive={useMatch("/") ? true : false}
            icon={
              <FaChartPie
                className={`mr-3 flex-shrink-0 text-lg ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} ${useMatch("/") && (maxXxl || isOnHover) ? "text-white" : "text-gray-500 dark:text-gray-100"}`}
              />
            }
            onToggleSubMenu={onToggleSubMenu}
          />
        </Link>

        <Items
          itemId="item-1"
          itemName="teachers"
          icon={
            <FaUserTie
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="teachers/new" state={{ active: true }}>
            <Items
              isActive={useMatch("/teachers/new") ? true : false}
              itemId="subitem-1"
              itemName="new-teacher"
            />
          </Link>
          <Link to="teachers/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/teachers/manage") ? true : false}
              itemId="subitem-1"
              itemName="view-teachers"
            />
          </Link>
        </Items>

        <Items
          itemId="item-2"
          itemName="students"
          icon={
            <FaUserGraduate
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="students/new" state={{ active: true }}>
            <Items
              isActive={useMatch("/students/new") ? true : false}
              itemId="subitem-1"
              itemName="new-student"
            />
          </Link>
          <Link to="students/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/students/manage") ? true : false}
              itemId="subitem-1"
              itemName="view-students"
            />
          </Link>
        </Items>

        <Items
          itemId="item-3"
          itemName="parents"
          icon={
            <FaUserFriends
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="Parents/new" state={{ active: true }}>
            <Items
              isActive={useMatch("/Parents/new") ? true : false}
              itemId="subitem-1"
              itemName="new-parent"
            />
          </Link>
          <Link to="Parents/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/Parents/manage") ? true : false}
              itemId="subitem-1"
              itemName="view-parents"
            />
          </Link>
        </Items>

        <Items
          itemId="item-4"
          itemName="finance"
          icon={
            <FaScaleBalanced
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          containerClass="locked"
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>

        <Items
          itemId="item-5"
          itemName="resources"
          icon={
            <FaLayerGroup
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          containerClass="locked"
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>
      </div>
      <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>
      {/* configuration */}
      <Items
        itemId="item-6"
        itemName="configuration"
        icon={
          <FaCog
            className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
          />
        }
        subMenuVisible={subMenuVisible}
        onToggleSubMenu={onToggleSubMenu}
      >
        <Link to="/configuration/data-management" state={{ active: true }}>
          <Items
            isActive={useMatch("/configuration/data-management") ? true : false}
            itemId="subitem-1"
            itemName="data-management"
          />
        </Link>
      </Items>
    </div>
  );
}
