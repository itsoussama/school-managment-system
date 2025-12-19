import { addAdministrator } from "@src/pages/shared/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import AdministratorsForm, { FormData } from "./components/administratorsForm";

const ADMINISTRATOR_INITIALDATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phone: "",
  password: "",
  password_confirmation: "",
  payroll_frequency: "monthly",
  hourly_rate: 0,
  net_salary: 0,
};

// const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function AddAdministrators() {
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const formRef = useRef<HTMLFormElement>(null);
  const redirect = useNavigate();

  const addAdministratorQuery = useMutation({
    mutationFn: addAdministrator,
    onSuccess: () => {
      redirect("/administrators/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: t("notifications.created_success"),
            state: true,
          },
        },
      });
    },
    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
  });

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  return (
    <div className="flex flex-col">
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
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
            {minSm ? t("general.home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.administrators")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.add_entity", { entity: t("entities.administrator") })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <TransitionAnimation>
        <AdministratorsForm
          action="Create"
          initialData={ADMINISTRATOR_INITIALDATA}
          onFormData={(data) => addAdministratorQuery.mutate(data)}
          formSubmitRef={formRef}
          additionalStyle="grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]"
        />
      </TransitionAnimation>
    </div>
  );
}
