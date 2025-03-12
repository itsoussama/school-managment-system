import Items from "@src/components/item";
import { Layout } from "@src/layout/layout";
import { useContext, useState } from "react";
import { hoverContext } from "@src/context/hoverContext";
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
import { SiGoogleclassroom } from "react-icons/si";
import { Link, Outlet, useMatch } from "react-router-dom";
import useBreakpoint from "@hooks/useBreakpoint";
import { useTranslation } from "react-i18next";
import { usePermission } from "@src/hooks/usePermission";

interface SubMenuVisible {
  ref: string;
  state: boolean;
}

export default function Main() {
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

  // const isSubmMenuVisible = () => {

  //   return {};
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
            isHidden={false}
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
          path="/administrators"
          itemName={t("entities.administrators")}
          isHidden={!usePermission("administrator")}
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
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.administrators"),
              })}
              isActive={useMatch("/administrators/new") ? true : false}
              isHidden={!usePermission("add_administrator")}
            />
          </Link>
          <Link to="administrators/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.administrators"),
              })}
              isActive={useMatch("/administrators/manage") ? true : false}
              isHidden={!usePermission("view_administrators")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-2"
          path="/teachers"
          itemName={t("entities.teachers")}
          isHidden={!usePermission("teacher")}
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
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.teacher"),
              })}
              isActive={useMatch("/teachers/new") ? true : false}
              isHidden={!usePermission("add_teacher")}
            />
          </Link>
          <Link to="teachers/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.teachers"),
              })}
              isActive={useMatch("/teachers/manage") ? true : false}
              isHidden={!usePermission("view_teachers")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-3"
          path="/students"
          itemName={t("entities.students")}
          isHidden={!usePermission("student")}
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
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.student"),
              })}
              isActive={useMatch("/students/new") ? true : false}
              isHidden={!usePermission("add_student")}
            />
          </Link>
          <Link to="students/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.students"),
              })}
              isActive={useMatch("/students/manage") ? true : false}
              isHidden={!usePermission("view_students")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-4"
          path="/parents"
          itemName={t("entities.parents")}
          isHidden={!usePermission("parent")}
          icon={
            <FaUserFriends
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="parents/new" state={{ active: true }}>
            <Items
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.parent"),
              })}
              isActive={useMatch("/parents/new") ? true : false}
              isHidden={!usePermission("add_parent")}
            />
          </Link>
          <Link to="parents/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.parents"),
              })}
              isActive={useMatch("/parents/manage") ? true : false}
              isHidden={!usePermission("view_parents")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-5"
          path="/finance"
          itemName={t("entities.finances")}
          isHidden={!usePermission("finance")}
          icon={
            <FaScaleBalanced
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="finance/budget/manage" state={{ active: true }}>
            <Items
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.masculine") +
                  " " +
                  t("entities.budget"),
              })}
              isActive={useMatch("/finance/budget/manage") ? true : false}
              isHidden={!usePermission("budget_management")}
            />
          </Link>
          <Link to="finance/fee/manage" state={{ active: true }}>
            <Items
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") + " " + t("entities.fee"),
              })}
              isActive={useMatch("/finance/fee/manage") ? true : false}
              isHidden={!usePermission("fee_management")}
            />
          </Link>
          <Link to="finance/payroll/manage" state={{ active: true }}>
            <Items
              itemId="subitem-1"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.masculine") +
                  " " +
                  t("entities.payroll"),
              })}
              isActive={useMatch("/finance/payroll/manage") ? true : false}
              isHidden={!usePermission("payroll_management")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-6"
          path="/resources"
          itemName={t("entities.resources")}
          isHidden={!usePermission("resource")}
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
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.resource"),
              })}
              isActive={useMatch("/resources/new") ? true : false}
              isHidden={!usePermission("add_resource")}
            />
          </Link>
          <Link to="resources/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.resource"),
              })}
              isActive={useMatch("/resources/manage") ? true : false}
              isHidden={!usePermission("view_resources")}
            />
          </Link>
          <Link to="resources/maintenance-requests" state={{ active: true }}>
            <Items
              itemId="subitem-3"
              itemName={t("entities.requests")}
              isActive={
                useMatch("/resources/maintenance-requests") ? true : false
              }
              isHidden={!usePermission("manage_resources_requests")}
            />
          </Link>
        </Items>

        <Items
          itemId="item-7"
          path="/classrooms"
          itemName={t("entities.classrooms")}
          isHidden={!usePermission("classroom")}
          icon={
            <SiGoogleclassroom
              className={`mr-3 flex-shrink-0 text-lg text-gray-500 ${!isOnHover ? "sm:mx-auto 2xl:mx-0 2xl:mr-3" : ""} dark:text-gray-100`}
            />
          }
          // containerClass="locked"
          subMenuVisible={subMenuVisible}
          onToggleSubMenu={onToggleSubMenu}
        >
          <Link to="classrooms/new" state={{ active: true }}>
            <Items
              itemId="subitem-1"
              itemName={t("actions.new_entity", {
                entity: t("entities.classroom"),
              })}
              isActive={useMatch("/classrooms/new") ? true : false}
              isHidden={!usePermission("add_classroom")}
            />
          </Link>
          <Link to="classrooms/manage" state={{ active: true }}>
            <Items
              itemId="subitem-2"
              itemName={t("actions.view_entity", {
                entity:
                  t("determiners.definite.plural") +
                  " " +
                  t("entities.classrooms"),
              })}
              isActive={useMatch("/classrooms/manage") ? true : false}
              isHidden={!usePermission("view_classrooms")}
            />
          </Link>
        </Items>
      </div>
      <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>
      {/* configuration */}
      <Items
        itemId="item-8"
        path="/configuration"
        itemName={t("entities.configurations")}
        isHidden={!usePermission("configuration")}
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
            itemId="subitem-1"
            itemName={t("entities.data_management")}
            isActive={useMatch("/configuration/data-management") ? true : false}
            isHidden={!usePermission("data_export")}
          />
        </Link>
        <Link to="/configuration/settings/general" state={{ active: true }}>
          <Items
            itemId="subitem-2"
            itemName={t("entities.general_settings")}
            isActive={
              useMatch("/configuration/settings/general") ? true : false
            }
            isHidden={!usePermission("general_settings")}
          />
        </Link>
        <Link
          to="/configuration/settings/school-levels"
          state={{ active: true }}
        >
          <Items
            itemId="subitem-3"
            itemName={t("entities.school-levels")}
            isActive={
              useMatch("/configuration/settings/school-levels") ? true : false
            }
            isHidden={!usePermission("school_levels_config")}
          />
        </Link>
        <Link to="/configuration/settings/subjects" state={{ active: true }}>
          <Items
            itemId="subitem-4"
            itemName={t("form.fields.subjects")}
            isActive={
              useMatch("/configuration/settings/subjects") ? true : false
            }
            isHidden={!usePermission("subjects_config")}
          />
        </Link>
        <Link to="/configuration/settings/timetable" state={{ active: true }}>
          <Items
            itemId="subitem-5"
            itemName={t("entities.timetable")}
            isActive={
              useMatch("/configuration/settings/timetable") ? true : false
            }
            isHidden={!usePermission("timetable_config")}
          />
        </Link>
      </Items>
    </div>
  );
}
