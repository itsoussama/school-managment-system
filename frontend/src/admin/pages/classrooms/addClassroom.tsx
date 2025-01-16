import { Button, Input, RSelect } from "@components/input";
import { addClassroom } from "@api";
import { useMutation } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import { useFormValidation } from "@src/hooks/useFormValidation";

export interface FormData {
  name: string;
  capacity: number;
  school_id: string;
}

export default function AddClassroom() {
  const { t } = useTranslation();
  const { formData, setFormData, validateForm } = useFormValidation({});
  // const [data, setData] = useState<FormData>();
  // const [formData, setFormData] = useState<FormData>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const redirect = useNavigate();

  const addClassroomQuery = useMutation({
    mutationFn: addClassroom,
    onSuccess: () => {
      redirect("/classrooms/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: t("notifications.saved_success"),
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      try {
        addClassroomQuery.mutate({
          name: formData?.name as string,
          capacity: formData?.capacity as number,
          school_id: admin.school_id,
        });
      } catch (e) {
        toggleAlert({
          id: new Date().getTime(),
          status: "fail",
          message: "Operation Failed",
          state: true,
        });
      }
    }
  };

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
              {t("entities.classrooms")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.add_entity", {
            entity:
              t("determiners.indefinite.feminine") +
              " " +
              t("entities.classroom"),
          })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-[3] flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("information.classrooms_information")}
              </h1>
            </div>
            <form
              action=""
              onSubmit={onSubmit}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] md:grid-cols-[repeat(2,_minmax(300px,_400px))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="name"
                name="name"
                label={t("form.fields.name")}
                placeholder={t("form.placeholders.name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <RSelect
                id="type"
                name="type"
                label={t("form.fields.type")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              >
                <option value="">{t("form.placeholders.types")}</option>
                <option value="lecture">
                  {t("form.fields.classroom_type_options.lecture")}
                </option>
                <option value="lab">
                  {t("form.fields.classroom_type_options.lab")}
                </option>
                <option value="computer_Lab">
                  {t("form.fields.classroom_type_options.computer_lab")}
                </option>
                <option value="gymnasium">
                  {t("form.fields.classroom_type_options.gymnasium")}
                </option>
                {/* //todo: add ability for admin to add more types if needed */}
              </RSelect>

              <Input
                type="number"
                id="capacity"
                name="capacity"
                label={t("form.fields.capacity")}
                placeholder={t("form.placeholders.capacity")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="location"
                name="location"
                label={t("form.fields.location")}
                placeholder={t("form.placeholders.location")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Button className="btn-default !m-0 !mt-auto" type="submit">
                {t("form.buttons.create", {
                  label:
                    t("determiners.indefinite.feminine") +
                    " " +
                    t("entities.classroom"),
                })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
