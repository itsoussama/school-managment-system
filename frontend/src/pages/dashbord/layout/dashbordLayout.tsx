import { Breadcrumb } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { FaFileExport, FaHome } from "react-icons/fa";
import { TransitionAnimation } from "@src/components/animation";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@src/components/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Breadcrumb
          theme={{ list: "flex items-center overflow-x-auto px-5 py-3" }}
          className="fade-edge fade-edge-x my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800"
          aria-label="Breadcrumb"
        >
          <Breadcrumb.Item icon={FaHome} />

          <Breadcrumb.Item>{t("general.overview")}</Breadcrumb.Item>
        </Breadcrumb>
        <Link to={"/configuration/data-management"}>
          <Button className="btn-default m-0 mt-auto flex items-center gap-x-2">
            <FaFileExport />
            {t("form.buttons.export", {
              label:
                t("determiners.definite.plural") +
                " " +
                t("general.data_other"),
            })}
          </Button>
        </Link>
      </div>
      <TransitionAnimation>{children}</TransitionAnimation>
    </div>
  );
}

export default DashboardLayout;
