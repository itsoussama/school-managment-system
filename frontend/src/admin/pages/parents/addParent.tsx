import { Input, MultiSelect, Checkbox } from "@components/input";
import { addParent, getStudents } from "@api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Toast } from "flowbite-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaImage, FaLock, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { MdThumbUp } from "react-icons/md";
import ReactDOM from "react-dom";
import {
  Alert,
  AlertColor,
  alertColor,
  alertIntialState,
} from "@src/admin/utils/alert";

export interface FormData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: number;
  childrens: number[];
  roles: number[];
  image: File;
}

interface Childs {
  id: string;
  name: string;
  guardian_id: string;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

export default function AddParent() {
  const { t } = useTranslation();
  const { t: fieldsTrans } = useTranslation("form-fields");
  const [data, setData] = useState<FormData>();
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>("");
  const admin = useAppSelector((state) => state.user);
  const minSm = useBreakpoint("min", "sm");
  const [alert, toggleAlert] = useState<Alert>(alertIntialState);

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(1, -1),
    placeholderData: keepPreviousData,
  });

  const addParentQuery = useMutation({
    mutationFn: addParent,
    onSuccess: () => {
      toggleAlert({
        status: "success",
        message: {
          title: "Operation Successful",
          description: "Your changes have been saved successfully.",
        },
        state: true,
      });
    },
    onError: () => {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: "Something went wrong. Please try again.",
        },
        state: true,
      });
    },
  });

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  const handleSearch = (e: EventTarget) => {
    setSearchValue((e as HTMLInputElement).value);
    // console.log();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(data);

    if (img)
      addParentQuery.mutate({
        name: data?.firstName + " " + data?.lastName,
        email: data?.email as string,
        school_id: admin?.school_id,
        password: data?.password as string,
        password_confirmation: data?.password_confirmation as string,
        phone: data?.phone as string,
        childrens: data?.childrens as number[],
        roles: [4],
        image: img[0],
      });
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

  useEffect(() => {
    console.log(alertIntialState.duration);

    if (alertIntialState.duration) {
      setTimeout(() => {
        toggleAlert(alertIntialState);
      }, alertIntialState.duration);
    }
  }, [alert.state]);

  return (
    <div className="flex flex-col">
      {ReactDOM.createPortal(
        alert.state && (
          <Toast className="fixed right-0 top-0 z-50 m-5 overflow-hidden border border-gray-300 dark:border-gray-700">
            <div className="absolute left-0 top-0 h-0.5 w-full rounded-lg bg-gray-300 dark:bg-gray-600">
              <div
                className={`absolute left-0 top-0 h-full w-0 animate-[fill_${alertIntialState?.duration}ms_ease-in-out_forwards] bg-gray-400 dark:bg-white`}
              ></div>
            </div>
            <div className="flex items-start">
              <div
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alertColor[alert.status as AlertColor]}`}
              >
                <MdThumbUp className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {alert.message?.title}
                </span>
                <div className="mb-2 text-sm font-normal">
                  {alert.message?.description}
                </div>
                <div className="flex gap-2"></div>
              </div>
              <Toast.Toggle />
            </div>
          </Toast>
        ),
        document.body,
      )}
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
              {t("parents")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("new-parent")}</Breadcrumb.Item>
      </Breadcrumb>

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
              {t("parent-information")}
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
              label={fieldsTrans("childrens")}
              name="childrens"
              onSelectItem={(items) =>
                handleChange(
                  "childrens",
                  items.map((item) => parseInt(item.id)),
                )
              }
            >
              <div className="sticky -top-2 z-10 -m-2 h-full space-y-2 bg-white p-2 dark:bg-gray-700">
                <Input
                  id="search"
                  type="text"
                  icon={
                    <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  }
                  label=""
                  onKeyUp={(e) => handleSearch(e.target)}
                  placeholder={fieldsTrans("filter-all")}
                  name="search"
                  custom-style={{
                    inputStyle: "px-8 !py-1",
                    labelStyle: "mb-0 !inline",
                  }}
                />
                <Link
                  to={"/students/new"}
                  className="btn-default flex h-8 items-center justify-center"
                >
                  <FaPlus size={12} className="me-2" />
                  {t("add-new-child")}
                </Link>
              </div>
              {getChildrensQuery.data?.data.map(
                (child: Childs, key: number) =>
                  child.name.search(new RegExp(searchValue, "i")) !== -1 && (
                    <Checkbox
                      key={key}
                      htmlFor={child.name}
                      label={child.name}
                      id={child.id}
                      name="childrens"
                      value={child.name}
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
    </div>
  );
}
