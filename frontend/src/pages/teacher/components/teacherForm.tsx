import { Button, Input, MultiSelect, RSelect } from "@src/components/input";
import { SkeletonProfile } from "@src/components/skeleton";
import { useFormValidation } from "@src/hooks/useFormValidation";
import {
  ChangeEvent,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaImage, FaLock } from "react-icons/fa6";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { formatUserName } from "@src/pages/shared/utils/formatters";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { getGrades, getSubjects } from "@src/pages/shared/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Grade, Subject, Teacher } from "../viewTeachers";
import { pluck } from "@src/utils/arrayMethod";

export interface FormData {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
  password_confirmation?: string;
  payroll_frequency: "daily" | "weekly" | "bi-weekly" | "monthly";
  net_salary?: number;
  hourly_rate?: number;
  subjects: number[];
  grades: number[];
  image?: File;
}

export interface Data {
  _method?: string;
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  payroll_frequency: "daily" | "weekly" | "bi-weekly" | "monthly";
  net_salary?: number;
  hourly_rate?: number;
  subjects: number[];
  grades: number[];
  image?: File;
  password?: string;
  password_confirmation?: string;
  roles?: number[];
  school_id?: string;
}

interface TeacherFormProps {
  action: "Create" | "Edit";
  initialData: FormData;
  oldData?: Teacher;
  formSubmitRef?: RefObject<HTMLFormElement>;
  additionalStyle?: string;
  onFormData: (data: Data) => void;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function TeacherForm({
  action,
  initialData,
  oldData,
  formSubmitRef,
  onFormData,
  additionalStyle = "grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]",
}: TeacherFormProps) {
  const { t } = useTranslation();
  const { formData, errors, setFormData, setData, validateForm } =
    useFormValidation<FormData>(initialData);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const [changePassword, toggleChangePassword] = useState<boolean>(false);
  const user = useAppSelector((state) => state.userSlice.user);

  const getAllSubjectsQuery = useQuery({
    queryKey: ["getAllSubjects"],
    queryFn: () => getSubjects(1, -1, undefined, undefined, user.school_id),
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: () => getGrades(1, -1, undefined, undefined, user.school_id),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validationResult = validateForm();
      if (validationResult.isValid) {
        const form: Data = {
          name: formData?.firstName + " " + formData?.lastName,
          email: formData?.email as string,
          phone: formData?.phone as string,
          address: formData?.address as string,
          payroll_frequency: formData?.payroll_frequency,
          hourly_rate: formData?.hourly_rate,
          net_salary: formData?.net_salary,
          subjects: formData?.subjects,
          grades: formData?.grades,
        };

        if (action === "Edit") {
          form["_method"] = "PUT";
          form["id"] = formData?.id as number;
        } else {
          form["school_id"] = user.school_id;
          form["roles"] = [3];
          form["password"] = formData?.password as string;
          form["password_confirmation"] =
            formData?.password_confirmation as string;
        }

        if (img) {
          form["image"] = img[0];
        }

        if (form?.password) {
          form["password"] = formData?.password as string;
          form["password_confirmation"] =
            formData?.password_confirmation as string;
        }

        onFormData(form);
      }
    } catch (error) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    }
  };

  const handleChangePassword = (isVisible: boolean) => {
    toggleChangePassword(isVisible);
    setData({ ...formData, password: "", password_confirmation: "" });
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

  useEffect(() => {
    if (oldData) {
      setData({
        id: oldData.id,
        firstName: formatUserName(oldData.name).firstName,
        lastName: formatUserName(oldData.name).lastName,
        address: oldData.teacher.address,
        email: oldData.email,
        phone: oldData.phone,
        payroll_frequency: oldData.payroll.payroll_frequency,
        hourly_rate: oldData.payroll.hourly_rate,
        net_salary: oldData.payroll.net_salary,
        subjects: oldData.subjects.map(pluck("id")),
        grades: oldData.grades.map(pluck("id")),
      });

      const imagePath = oldData?.imagePath
        ? SERVER_STORAGE + oldData?.imagePath
        : `https://ui-avatars.com/api/?background=random&name=${formatUserName(oldData.name).firstName}+${formatUserName(oldData.name).lastName}`;

      setPreviewImg(imagePath);
    }
  }, [oldData, setData]);

  return (
    <>
      <Alert
        id={alert.id}
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={closeAlert}
      />
      <div className="flex flex-wrap gap-5">
        <div className="item flex min-w-72 flex-1 flex-col gap-4">
          <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("general.profile")}
            </h1>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-s bg-light-primary px-8 py-5 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            {previewImg ? (
              <SkeletonProfile imgSource={previewImg} className="h-44 w-44" />
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
              {t("information.teacher_information")}
            </h1>
          </div>
          <form
            onSubmit={onSubmit}
            ref={formSubmitRef}
            className={
              "relative grid gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light " +
              additionalStyle
            }
          >
            <Input
              type="text"
              id="firstName"
              name="firstName"
              label={t("form.fields.first_name")}
              placeholder={t("form.placeholders.first_name")}
              value={(formData.firstName as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="lastName"
              name="lastName"
              label={t("form.fields.last_name")}
              placeholder={t("form.placeholders.last_name")}
              value={(formData.lastName as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="address"
              name="address"
              custom-style={{ containerStyle: "col-span-full" }}
              label={t("form.fields.address")}
              placeholder={t("form.placeholders.address")}
              value={(formData.address as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="tel"
              id="phone"
              name="phone"
              label={t("form.fields.phone_number")}
              placeholder="06 00 00 00"
              pattern="(06|05)[0-9]{2}[0-9]{4}"
              value={(formData.phone as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            />

            <Input
              type="email"
              id="email"
              name="email"
              label={t("form.fields.email")}
              placeholder="Johndoe@example.com"
              value={(formData.email as string) || ""}
              error={errors?.email}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
              onBlur={() => validateForm()}
            />

            <MultiSelect
              name="subjects"
              label={t("form.fields.subjects")}
              onSelect={(items) => setFormData("subjects", items)}
              selectedValue={formData?.subjects}
            >
              <MultiSelect.List>
                {getAllSubjectsQuery.data?.map(
                  (subject: Subject, key: number) => (
                    <MultiSelect.Option
                      key={key}
                      value={subject.id}
                      label={subject.name}
                    />
                  ),
                )}
              </MultiSelect.List>
            </MultiSelect>

            <MultiSelect
              name="grades"
              label={t("form.fields.grade_levels")}
              onSelect={(items) => setFormData("grades", items)}
              selectedValue={formData?.grades}
            >
              <MultiSelect.List>
                {getGradesQuery.data?.map((grade: Grade, key: number) => (
                  <MultiSelect.Option
                    key={key}
                    value={grade.id}
                    label={grade.label}
                  />
                ))}
              </MultiSelect.List>
            </MultiSelect>

            <RSelect
              id="payroll_frequency"
              name="payroll_frequency"
              label={t("form.fields.payroll_frequency")}
              value={(formData.payroll_frequency as string) || ""}
              onChange={(e) => setFormData(e.target.id, e.target.value)}
            >
              <option value={"daily"}>{t("form.fields.daily")}</option>
              <option value={"weekly"}>{t("form.fields.weekly")}</option>
              <option value={"bi_weekly"}>{t("form.fields.bi_weekly")}</option>
              <option value={"monthly"}>{t("form.fields.monthly")}</option>
            </RSelect>

            {formData.payroll_frequency !== "monthly" ? (
              <Input
                type="number"
                inputMode="decimal"
                step={0.01}
                placeholder="30.55"
                id="hourly_rate"
                name="hourly_rate"
                addon="Hr"
                label={t("form.fields.hourly_rate")}
                value={(formData.hourly_rate as number) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />
            ) : (
              <Input
                type="number"
                inputMode="decimal"
                step={0.01}
                placeholder="2500"
                id="net_salary"
                name="net_salary"
                label={t("form.fields.salary")}
                addon={"Dh"}
                value={(formData.net_salary as number) || ""}
                onChange={(e) => setFormData(e.target.id, e.target.value)}
              />
            )}

            <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

            {changePassword || action === "Create" ? (
              <>
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
                  value={(formData.password as string) || ""}
                  error={errors?.password}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                  onBlur={() => validateForm()}
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
                  value={(formData.password_confirmation as string) || ""}
                  error={errors?.password_confirmation}
                  onChange={(e) => setFormData(e.target.id, e.target.value)}
                  onBlur={() => validateForm()}
                />
              </>
            ) : (
              <>
                <Button
                  onClick={() => handleChangePassword(true)}
                  className="btn-default !w-auto"
                >
                  {t("form.buttons.change", {
                    label:
                      t("determiners.definite.masculine") +
                      " " +
                      t("form.fields.password"),
                  })}
                </Button>
              </>
            )}

            {action === "Create" && (
              <Button className="btn-default" type="submit">
                {t("form.buttons.create", { label: t("general.account") })}
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
