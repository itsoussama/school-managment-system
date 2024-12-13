import Items from "@src/components/item";
import { Layout } from "@src/layout/layout";
import { useContext, useState } from "react";
import { hoverContext } from "@context/hoverContext";
import {
  FaChalkboardTeacher,
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            itemName={t("general.overview")}
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
          itemName={t("entities.administrators")}
          icon={
            <FaUserTie
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="administrators/new" state={{ active: true }}>
            <Items
              isActive={useMatch("/administrators/new") ? true : false}
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.administrators"),
              })}
            />
          </Link>
          <Link to="administrators/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/administrators/manage") ? true : false}
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.administrators"),
              })}
            />
          </Link>
        </Items>

        <Items
          itemId="item-2"
          itemName={t("entities.teachers")}
          icon={
            <FaChalkboardTeacher
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
              itemName={t("actions.new_entity", {
                entity: t("entities.teacher"),
              })}
            />
          </Link>
          <Link to="teachers/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/teachers/manage") ? true : false}
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.teachers"),
              })}
            />
          </Link>
        </Items>

        <Items
          itemId="item-3"
          itemName={t("entities.students")}
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
              itemName={t("actions.new_entity", {
                entity: t("entities.student"),
              })}
            />
          </Link>
          <Link to="students/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/students/manage") ? true : false}
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.students"),
              })}
            />
          </Link>
        </Items>

        <Items
          itemId="item-4"
          itemName={t("entities.parents")}
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
              itemName={t("actions.new_entity", {
                entity: t("entities.parent"),
              })}
            />
          </Link>
          <Link to="Parents/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/Parents/manage") ? true : false}
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.parents"),
              })}
            />
          </Link>
        </Items>

        <Items
          itemId="item-5"
          itemName={t("entities.finance")}
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
          itemId="item-6"
          itemName={t("entities.resources")}
          icon={
            <FaLayerGroup
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          // containerClass="locked"
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="resources/new" state={{ active: true }}>
            <Items
              isActive={useMatch("/Resources/new") ? true : false}
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.resource"),
              })}
            />
          </Link>
          <Link to="resources/manage" state={{ active: true }}>
            <Items
              isActive={useMatch("/resources/manage") ? true : false}
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.resource"),
              })}
            />
          </Link>
          <Link to="resources/maintenance-requests" state={{ active: true }}>
            <Items
              isActive={
                useMatch("/resources/maintenance-requests") ? true : false
              }
              itemId="subitem-3"
              itemName={t("entities.requests")}
            />
          </Link>
        </Items>
      </div>
      <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>
      {/* configuration */}
      <Items
        itemId="item-7"
        itemName={t("entities.configurations")}
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
            itemName={t("entities.data_management")}
          />
        </Link>
        <Link to="/configuration/settings/general" state={{ active: true }}>
          <Items
            isActive={
              useMatch("/configuration/settings/general") ? true : false
            }
            itemId="subitem-2"
            itemName={t("entities.general_settings")}
          />
        </Link>
        <Link
          to="/configuration/settings/grades-and-sections"
          state={{ active: true }}
        >
          <Items
            isActive={
              useMatch("/configuration/settings/grades-and-sections")
                ? true
                : false
            }
            itemId="subitem-2"
            itemName={t("entities.grades_sections")}
          />
        </Link>
        <Link to="/configuration/settings/subjects" state={{ active: true }}>
          <Items
            isActive={
              useMatch("/configuration/settings/subjects") ? true : false
            }
            itemId="subitem-2"
            itemName={t("form.fields.subjects")}
          />
        </Link>
        <Link to="/configuration/settings/timetable" state={{ active: true }}>
          <Items
            isActive={
              useMatch("/configuration/settings/timetable") ? true : false
            }
            itemId="subitem-2"
            itemName={t("entities.timetable")}
          />
        </Link>
      </Items>
    </div>
  );
}
