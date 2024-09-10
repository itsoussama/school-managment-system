import { Input, MultiSelect, Checkbox } from "@components/input";
import { addParent, getStudents } from "@api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "flowbite-react";
import { ChangeEvent, FormEvent, KeyboardEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaLock, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "@src/hooks/useReduxEvent";

export interface FormData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: number;
  roles: number[];
}

interface Childs {
  id: string;
  name: string;
  guardian_id: string;
}

export default function AddParent() {
  const addStudentQuery = useMutation({
    mutationFn: addParent,
  });

  const { t } = useTranslation();
  const [data, setData] = useState<FormData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const admin = useAppSelector((state) => state.user);

  const getChildrensQuery = useQuery({
    queryKey: ["getChildrens"],
    queryFn: () => getStudents(),
    placeholderData: keepPreviousData,
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

    addStudentQuery.mutate({
      name: data?.firstName + " " + data?.lastName,
      email: data?.email as string,
      school_id: admin?.school_id,
      password: data?.password as string,
      password_confirmation: data?.password_confirmation as string,
      phone: data?.phone as string,
      roles: [4],
    });
  };

  return (
    <div className="flex flex-col">
      <Breadcrumb
        className="my-4 flex max-w-max cursor-default rounded-s border border-gray-200 bg-white px-5 py-3 text-gray-700 dark:border-gray-700 dark:bg-gray-800"
        aria-label="Breadcrumb"
      >
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {t("home")}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 dark:text-gray-300">
            {t("parents")}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("new-parent")}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex flex-wrap gap-5">
        <div className="item flex min-w-72 flex-1 flex-col gap-4">
          <div className="rounded-s bg-light-primary p-4 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile
            </h1>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-s bg-light-primary px-8 py-5 shadow-sharp-dark dark:bg-dark-primary dark:shadow-sharp-light">
            <img
              className="rounded-full"
              src="https://i.pravatar.cc/300?img=12"
              alt=""
            />
            <button className="btn-gray">Upload photo</button>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700 dark:text-gray-500">
                Accepted format:{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  jpg, jpeg, png
                </span>
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-500">
                Maximum size:{" "}
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
              Parent information
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
              label="First name"
              placeholder="First name"
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="lastName"
              name="lastName"
              label="Last name"
              placeholder="Last name"
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />

            <Input
              type="text"
              id="address"
              name="address"
              label="Address"
              placeholder="123 Rue Principale"
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              custom-style={{ containerStyle: "col-span-full" }}
            />

            <Input
              type="tel"
              id="phone"
              name="phone"
              label="Phone number"
              placeholder="06 00 00 00"
              pattern="(06|05)[0-9]{2}[0-9]{4}"
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />

            <Input
              type="email"
              id="email"
              name="email"
              label="Email"
              placeholder="Johndoe@example.com"
              onChange={(e) => handleChange(e.target.id, e.target.value)}
            />

            <MultiSelect
              label="Childs"
              name="childs"
              onSelectItem={(items) =>
                handleChange(
                  "childs",
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
                placeholder="All"
                name="search"
                custom-style={{
                  inputStyle: "px-8 !py-1",
                  labelStyle: "mb-0 !inline",
                }}
              />
              {getChildrensQuery.data?.data.data
                // .filter(
                //   (child: Childs) =>
                //     child.guardian_id &&
                //     child.name.toLowerCase().includes(searchValue), // Case-insensitive search match
                // )
                .map(
                  (child: Childs) =>
                    child.guardian_id &&
                    child.name.search(new RegExp(searchValue, "i")) !== -1 && (
                      <Checkbox
                        htmlFor={child.name}
                        label={child.name}
                        id={child.id}
                        name="childs"
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
              label="Password"
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
              label="Confirm password"
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
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
