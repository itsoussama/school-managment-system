import { Button, Input, RSelect } from "@components/input";
import { addAdministrator } from "@api";
import { useMutation } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import roles from "@admin/roles.json";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useFormValidation } from "@src/hooks/useFormValidation";

export interface FormData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: string;
  roles: number[];
  image: File;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

// const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function AddAdministrators() {
  const { t } = useTranslation();
  const { formData, errors, setFormData, validateForm } = useFormValidation({
    email: "",
    password: "",
    password_confirmation: "",
  });
  // const [data, setData] = useState<FormData>();
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  // const [formData, setFormData] = useState<FormData>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const redirect = useNavigate();

  const addAdministratorQuery = useMutation({
    mutationFn: addAdministrator,
    onSuccess: () => {
      redirect("/administrators/manage", {
        state: {
          alert: {
            id: new Date().getTime(),
            status: "success",
            message: "Operation Successful",
            state: true,
          },
        },
      });
    },
    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateForm();
    if (validationResult.isValid) {
      try {
        if (img) {
          addAdministratorQuery.mutate({
            name: formData?.firstName + " " + formData?.lastName,
            email: formData?.email as string,
            school_id: admin?.school_id,
            password: formData?.password as string,
            password_confirmation: formData?.password_confirmation as string,
            phone: formData?.phone as string,
            roles: [roles.administration_staff],
            image: img[0],
          });
        } else {
          throw new Error("image not found");
        }
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

  const readAndPreview = (file: FileList) => {
    if (/\.(jpe?g|png|gif)$/i.test(file[0].name)) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (event) => {
        setPreviewImg(event.target?.result as string);
      });
      fileReader.readAsDataURL(file[0]);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
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
        <div className="flex flex-wrap gap-5">
          <div className="item flex min-w-72 flex-1 flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("general.profile")}
              </h1>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-s bg-light-primary px-8 py-5 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              {previewImg ? (
                <img
                  className="h-44 w-44 rounded-full object-cover"
                  src={previewImg}
                  alt="profile"
                />
              ) : (
                <div
                  className={`flex h-44 w-44 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700`}
                >
                  <FaImage className="h-10 w-10 text-gray-200 dark:text-gray-600" />
                </div>
              )}
              <button className="btn-gray relative overflow-hidden">
                <input
                  type="file"
                  className="absolute left-0 top-0 cursor-pointer opacity-0"
                  onChange={handleImageUpload}
                />
                {t("form.buttons.upload", {
                  label: t("general.photo"),
                })}
              </button>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 dark:text-gray-500">
                  {t("form.general.accepted_format")}:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    jpg, jpeg, png
                  </span>
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-500">
                  {t("form.general.maximum_size")}:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    1024 mb
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-[3] flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("information.administrator_information")}
              </h1>
            </div>
            <form
              action=""
              onSubmit={onSubmit}
              className="relative grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] dark:bg-dark-primary dark:shadow-sharp-light"
            >
              <Input
                type="text"
                id="firstName"
                name="firstName"
                label={t("form.fields.first_name")}
                placeholder={t("form.placeholders.first_name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="lastName"
                name="lastName"
                label={t("form.fields.last_name")}
                placeholder={t("form.placeholders.last_name")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="address"
                name="address"
                label={t("form.fields.address")}
                placeholder={t("form.placeholders.address")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                custom-style={{ containerStyle: "col-span-full" }}
              />

              <Input
                type="tel"
                id="phone"
                name="phone"
                label={t("form.fields.phone_number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={t("form.fields.email")}
                placeholder="Johndoe@example.com"
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                error={errors?.email}
              />

              <RSelect
                id="payroll_frequency"
                name="payroll_frequency"
                label={t("form.fields.payroll_frequency")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              >
                <option value={"1"}>{t("form.fields.weekly")}</option>
                <option value={"2"}>{t("form.fields.bi_weekly")}</option>
                <option value={"3"}>{t("form.fields.semi_monthly")}</option>
                <option value={"4"}>{t("form.fields.monthly")}</option>
              </RSelect>

              {formData.payroll_frequency !== "4" ? (
                <Input
                  type="text"
                  inputMode="decimal"
                  step={0.01}
                  placeholder="30.55"
                  id="hourly_rate"
                  name="hourly_rate"
                  addon="hr"
                  label={t("form.fields.hourly_rate")}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                />
              ) : (
                <Input
                  type="text"
                  inputMode="decimal"
                  step={0.01}
                  placeholder="2500.55"
                  id="salary"
                  name="salary"
                  label={t("form.fields.salary")}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                />
              )}

              <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

              <Input
                type="password"
                id="password"
                name="password"
                label={t("form.fields.password")}
                placeholder="●●●●●●●"
                leftIcon={FaLock}
                rightIcon={(isPasswordVisible) =>
                  isPasswordVisible ? FaEyeSlash : FaEye
                }
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                error={errors?.password}
              />

              <Input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                label={t("form.fields.confirm_password")}
                placeholder="●●●●●●●"
                leftIcon={FaLock}
                rightIcon={(isPasswordVisible) =>
                  isPasswordVisible ? FaEyeSlash : FaEye
                }
                onChange={(e) => setFormData(e.target.id, e.target.value)}
                onBlur={() => validateForm()}
                error={errors?.password_confirmation}
              />

              <Button className="btn-default" type="submit">
                {t("form.buttons.create", { label: t("general.account") })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
