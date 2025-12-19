import { addTeacher } from "@src/pages/shared/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import TeacherForm, { FormData } from "./components/teacherForm";

const TEACHER_INITIALDATA: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  password_confirmation: "",
  payroll_frequency: "monthly",
  hourly_rate: 0,
  net_salary: 0,
  subjects: [],
  grades: [],
};

export default function AddTeacher() {
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");
  const redirect = useNavigate();

  const addTeacherQuery = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      redirect("/teachers/manage", {
        state: {
          alert: {
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
        <Link
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          to="/"
        >
          <Breadcrumb.Item icon={FaHome}>
            {minSm ? t("general.home") : ""}
          </Breadcrumb.Item>
        </Link>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.teachers")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.new_entity", { entity: t("entities.teacher") })}
        </Breadcrumb.Item>
      </Breadcrumb>
      <TransitionAnimation>
        <TeacherForm
          action="Create"
          initialData={TEACHER_INITIALDATA}
          onFormData={(data) => addTeacherQuery.mutate(data)}
          additionalStyle="grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]"
        />
      </TransitionAnimation>
    </div>
  );
}
