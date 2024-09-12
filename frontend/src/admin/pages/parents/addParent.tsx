import { Input, MultiSelect, Checkbox } from "@components/input";
import { addParent, getStudents } from "@api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaLock, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";

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
}

interface Childs {
  id: string;
  name: string;
  guardian_id: string;
}

export default function AddParent() {
  const { t } = useTranslation();
  const { t: fieldsTrans } = useTranslation("form-fields");
  const [data, setData] = useState<FormData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const admin = useAppSelector((state) => state.user);
  const minSm = useBreakpoint("min", "sm");

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(1, -1),
    placeholderData: keepPreviousData,
  });

  const addParentQuery = useMutation({
    mutationFn: addParent,
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

    addParentQuery.mutate({
      name: data?.firstName + " " + data?.lastName,
      email: data?.email as string,
      school_id: admin?.school_id,
      password: data?.password as string,
      password_confirmation: data?.password_confirmation as string,
      phone: data?.phone as string,
      childrens: data?.childrens as number[],
      roles: [4],
    });
  };

  return (
    <div className="flex flex-col">
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
            <img
              className="rounded-full"
              src="https://i.pravatar.cc/300?img=12"
              alt=""
            />
            <button className="btn-gray">{fieldsTrans("upload-photo")}</button>
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
            className="relative grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-11 gap-y-8 rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light"
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
