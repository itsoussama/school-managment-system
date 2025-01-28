import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  RSelect,
} from "@components/input";
import { addStudent, getGrades } from "@api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { TransitionAnimation } from "@src/components/animation";
import roles from "@admin/roles.json";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useFormValidation } from "@src/hooks/useFormValidation";

export interface Data {
  guardian_id: number | null;
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: string;
  roles: number[];
  subjects: number[];
  grades: number[];
  image?: File;
}

interface FormData {
  guardian_id: number | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  subjects: number[];
  grades: number[];
  image?: File;
}

interface Grades {
  id: string;
  label: string;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

export default function AddStudent() {
  const { t } = useTranslation();
  const { formData, errors, setFormData, validateForm } =
    useFormValidation<FormData>({
      guardian_id: null,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      subjects: [1],
      grades: [],
    });
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const admin = useAppSelector((state) => state.userSlice.user);
  const minSm = useBreakpoint("min", "sm");
  const redirect = useNavigate();

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: getGrades,
  });

  const addStudentQuery = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      redirect("/students/manage", {
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const form: Data = {
        guardian_id: null,
        name: formData?.firstName + " " + formData?.lastName,
        email: formData?.email as string,
        school_id: admin?.school_id as string,
        password: formData?.password as string,
        password_confirmation: formData?.password_confirmation as string,
        phone: formData?.phone as string,
        roles: [roles.student],
        subjects: [1],
        grades: formData?.grades as number[],
      };

      addStudentQuery.mutate(form);

      if (img) {
        form["image"] = img[0];
      } else {
        throw new Error("image not found");
      }

      addStudentQuery.mutate(form);
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
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
              {t("entities.students")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.new_entity", { entity: t("entities.student") })}
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
                {t("form.buttons.upload", { label: t("general.photo") })}
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
                {t("information.personal_information")}
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

              <MultiSelect
                label={t("form.fields.grade_levels")}
                name="grades"
                onSelectItem={(items) =>
                  setFormData(
                    "grades",
                    items.map((item) => parseInt(item.id)),
                  )
                }
              >
                {getGradesQuery.data?.data.map((grade: Grades, key: number) => (
                  <Checkbox
                    key={key}
                    label={grade.label}
                    id={grade.id}
                    name="grades"
                    value={grade.label}
                  />
                ))}
              </MultiSelect>

              <RSelect
                id="payment_frequency"
                name="payment_frequency"
                label={t("form.fields.payment_frequency")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              >
                <option value={"1"}>
                  {t("form.fields.month_count", { count: 1 })}
                </option>
                <option value={"2"}>
                  {t("form.fields.month_count", { count: 3 })}
                </option>
                <option value={"3"}>
                  {t("form.fields.month_count", { count: 6 })}
                </option>
                <option value={"4"}>
                  {t("form.fields.year_count", { count: 1 })}
                </option>
              </RSelect>

              <RSelect
                id="payment_method"
                name="payment_method"
                label={t("form.fields.payment_method")}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              >
                <option value={"1"}>{t("form.fields.cash")}</option>
                <option value={"2"}>{t("form.fields.check")}</option>
              </RSelect>

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

              <Button className="btn-default m-0 mt-auto" type="submit">
                {t("form.buttons.create", { label: t("general.account") })}
              </Button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
