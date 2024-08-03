import Items from "@src/components/item";
import { Layout } from "@src/layout/layout";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaChartPie,
  FaCog,
  FaLayerGroup,
  FaUserFriends,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

// const pathName = {
//   teachers: {
//     new: "new-teacher",
//   },
//   students: [],
//   parents: [],
//   finance: [],
//   resources: [],
//   settings: [],
// };

export default function Admin() {
  return (
    <Layout menu={<Menu />}>
      <Outlet />
    </Layout>
  );
}

function Menu() {
  const [subMenuVisible, toggleSubMenuVisible] = useState<SubMenuVisible>({
    ref: "",
    state: false,
  });
  const onToggleSubMenu = (item: string) => {
    toggleSubMenuVisible((prev) => ({
      ref: item,
      state: prev.ref !== item ? true : !prev.state,
    }));
  };
  const { t } = useTranslation();
  return (
    <div className="menu">
      <div className="main-menu flex flex-col gap-y-2">
        <div className="rounded-s bg-blue-600">
          <Link to={"/"} className="flex w-full items-center px-2 py-3">
            <FaChartPie className="mr-3 text-lg text-white" />
            <span className="text-s text-white">{t("overview")}</span>
          </Link>
        </div>

        <Items
          itemId="item-0"
          itemName="teachers"
          icon={
            <FaUserTie className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="/teacher/new">
            <Items itemId="subitem-1" itemName="new-teacher" />
          </Link>
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>

        <Items
          itemId="item-1"
          itemName="students"
          icon={
            <FaUserGraduate className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>

        <Items
          itemId="item-2"
          itemName="parents"
          icon={
            <FaUserFriends className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>

        <Items
          itemId="item-3"
          itemName="finance"
          icon={
            <FaScaleBalanced className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>

        <Items
          itemId="item-4"
          itemName="resources"
          icon={
            <FaLayerGroup className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Items itemId="subitem-1" itemName="sub item" />
          <Items itemId="subitem-2" itemName="sub item" />
          <Items itemId="subitem-3" itemName="sub item" />
        </Items>
      </div>
      <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>
      <Items
        itemId="item-5"
        itemName="settings"
        icon={
          <FaCog className="mr-3 text-lg text-gray-500 dark:text-gray-100" />
        }
        subMenuVisible={subMenuVisible}
        onToggleSubMenu={onToggleSubMenu}
      >
        <Items itemId="subitem-1" itemName="sub item" />
        <Items itemId="subitem-2" itemName="sub item" />
        <Items itemId="subitem-3" itemName="sub item" />
      </Items>
    </div>
  );
}
