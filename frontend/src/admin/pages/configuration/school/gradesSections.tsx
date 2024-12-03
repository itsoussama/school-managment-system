import { alertIntialState } from "@src/admin/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import { Alert as AlertType } from "@admin/utils/alert";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Breadcrumb } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Alert from "@src/components/alert";
import Accordion from "@src/components/accordion";
import InfoCard from "@src/admin/components/infoCard";

export default function GradesSections() {
  const { t } = useTranslation();
  const { t: fieldsTrans } = useTranslation("form-fields");
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);

  return (
    <div className="flex flex-col">
      <Alert
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={(value) => toggleAlert(value)}
      />

      <Breadcrumb
        theme={{ list: "flex items-center overflow-x-auto px-5 py-3" }}
        className="fade-edge fade-edge-x my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb"
      >
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {minSm ? t("home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("configuration")}
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-gray-600 dark:text-gray-300">
                {t("school")}
              </span>
            </Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("grades-sections")}</Breadcrumb.Item>
      </Breadcrumb>

      <TransitionAnimation>
        <Accordion title="section-1">
          <Accordion.section
            addtional-style={{ containerStyle: "overflow-x-auto" }}
          >
            <div className="flex flex-row gap-x-2 p-2">
              <InfoCard />
              <InfoCard />
              <div className="flex w-80 min-w-60 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-xs border border-dashed border-gray-400 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-500 dark:bg-gray-750 dark:text-gray-500 dark:hover:bg-gray-700">
                <FaPlus className="pointer-events-none" />
                <span className="pointer-events-none">Add Grade Level</span>
              </div>
            </div>
          </Accordion.section>
        </Accordion>
      </TransitionAnimation>
    </div>
  );
}
