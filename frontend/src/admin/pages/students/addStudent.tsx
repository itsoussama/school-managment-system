import { Checkbox, Input, MultiSelect } from "@components/input";
import { addStudent, getGrades } from "@api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/admin/utils/alert";
import { TransitionAnimation } from "@src/components/animation";

export interface FormData {
  guardian_id: number | null;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: number;
  roles: number[];
  subjects: number[];
  grades: number[];
  image: File;
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
  const { t: fieldsTrans } = useTranslation("form-fields");
  const [data, setData] = useState<FormData>();
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
      toggleAlert({
        status: "success",
        message: {
          title: "Operation Successful",
          description: " Your changes have been saved successfully.",
        },
        state: true,
      });

      redirect("/students/manage");
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: "Something went wrong. Please try again later.",
        },
        state: true,
      });
    },
  });

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (img) {
        addStudentQuery.mutate({
          guardian_id: null,
          name: data?.firstName + " " + data?.lastName,
          email: data?.email as string,
          school_id: admin?.school_id,
          password: data?.password as string,
          password_confirmation: data?.password_confirmation as string,
          phone: data?.phone as string,
          roles: [3],
          subjects: [1],
          grades: data?.grades as number[],
          image: img[0],
        });
      } else {
        throw new Error("image not found");
      }
    } catch (e) {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: (e as Error).message,
        },
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

  return (
    <div className="flex flex-col">
      <Alert
        status={alert.status}
        state={alert.state}
        title={alert.message.title}
        description={alert.message.description}
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
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("students")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("new-student")}</Breadcrumb.Item>
      </Breadcrumb>
      <TransitionAnimation>
        <div className="flex flex-wrap gap-5">
          <div className="item flex min-w-72 flex-1 flex-col gap-4">
            <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("profile")}
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
                {fieldsTrans("upload-photo")}
              </button>

              <div className="flex flex-col">
                <span className="text-sm text-gray-700 dark:text-gray-500">
                  {t("accepted-format")}:{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    jpg, jpeg, png
                  </span>
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-500">
                  {t("maximum-size")}:{" "}
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
                {t("student-information")}
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
                label={fieldsTrans("first-name")}
                placeholder={fieldsTrans("first-name-placeholder")}
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="lastName"
                name="lastName"
                label={fieldsTrans("last-name")}
                placeholder={fieldsTrans("last-name-placeholder")}
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="text"
                id="address"
                name="address"
                label={fieldsTrans("address")}
                placeholder={fieldsTrans("address-placeholder")}
                onChange={(e) => handleChange(e.target.id, e.target.value)}
                custom-style={{ containerStyle: "col-span-full" }}
              />

              <Input
                type="tel"
                id="phone"
                name="phone"
                label={fieldsTrans("phone-number")}
                placeholder="06 00 00 00"
                pattern="(06|05)[0-9]{2}[0-9]{4}"
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="email"
                id="email"
                name="email"
                label={fieldsTrans("email")}
                placeholder="Johndoe@example.com"
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <MultiSelect
                label={fieldsTrans("grade-levels")}
                name="grades"
                onSelectItem={(items) =>
                  handleChange(
                    "grades",
                    items.map((item) => parseInt(item.id)),
                  )
                }
              >
                {getGradesQuery.data?.data.data.map(
                  (grade: Grades, key: number) => (
                    <Checkbox
                      key={key}
                      htmlFor={grade.id}
                      label={grade.label}
                      id={grade.id}
                      name="grades"
                      value={grade.label}
                    />
                  ),
                )}
              </MultiSelect>

              <div className="col-span-full my-2 border-t border-gray-300 dark:border-gray-700"></div>

              <Input
                type="password"
                id="password"
                name="password"
                label={fieldsTrans("password")}
                placeholder="●●●●●●●"
                custom-style={{
                  inputStyle: "px-10",
                }}
                icon={
                  <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                }
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <Input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                label={fieldsTrans("confirm-password")}
                placeholder="●●●●●●●"
                custom-style={{
                  inputStyle: "px-10",
                }}
                icon={
                  <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                }
                onChange={(e) => handleChange(e.target.id, e.target.value)}
              />

              <button className="btn-default m-0 mt-auto" type="submit">
                {fieldsTrans("create-account-btn")}
              </button>
            </form>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  );
}
