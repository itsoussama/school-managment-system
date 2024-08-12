import { Input, Select } from "@src/components/input";
import { Breadcrumb, Checkbox, Pagination, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaClock,
  FaEye,
  FaHome,
  FaPen,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface Check {
  id?: string;
  status?: boolean;
}

export function ViewTeachers() {
  const { t } = useTranslation();
  // const [selectedItem, setSelectedItem] = useState()
  const [checkAll, setCheckAll] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);

  const handleCheck = (id = "") => {
    const firstCheckbox = document.getElementById("0") as HTMLInputElement;

    if (id == "") {
      setCheckAll([]);
      document.getElementsByName("checkbox").forEach((elem) => {
        const checkbox = elem as HTMLInputElement;
        // console.log(firstCheckbox.ariaChecked);

        if (firstCheckbox.checked) {
          checkbox.checked = true;
          setCheckAll((prev) => [
            ...(prev as []),
            { id: checkbox.getAttribute("id") as string, status: true },
          ]);
        } else {
          checkbox.checked = false;
          setCheckAll((prev) => [
            ...(prev as []),
            { id: checkbox.getAttribute("id") as string, status: false },
          ]);
        }
      });
    } else {
      const getValue = checkAll.find((elem) => elem.id === id);
      const filteredArr = checkAll.filter((elem) => elem.id !== id);
      setCheckAll([
        ...(filteredArr as []),
        { id: id, status: !getValue?.status },
      ]);
      firstCheckbox.checked = false;
    }
  };

  useEffect(() => {
    const checkedVal = checkAll.filter((val) => val.status === true)
      .length as number;
    setNumChecked(checkedVal);
  }, [checkAll]);

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
            {t("teachers")}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("new-teacher")}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="overflow-x-auto rounded-m bg-light-primary dark:bg-dark-primary">
        <div className="flex justify-between px-5 py-4">
          <div className="flex items-center gap-x-4">
            <Select
              id="period"
              name="period"
              icon={
                <FaClock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              }
              handleChange={(ev) => console.log(ev)}
              custom-style={{ inputStyle: "px-10", labelStyle: "!m-0" }}
            >
              <option selected>Last 30 days</option>
            </Select>
            {checkAll.find((val) => val.status === true) && (
              <button className="btn-danger !m-0 flex w-max items-center">
                <FaTrash className="mr-2 text-white" />
                Delete
                <span className="ml-2 rounded-full bg-red-800 px-2 py-0.5">{`${numChecked}`}</span>
              </button>
            )}
          </div>

          <Input
            id="search"
            type="text"
            icon={
              <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            }
            label=""
            placeholder="Search"
            name="search"
            custom-style={{
              inputStyle: "px-10",
              labelStyle: "mb-0",
            }}
            handleChange={(ev) => console.log(ev)}
          />
        </div>

        <Table
          theme={{
            root: {
              shadow:
                "absolute left-0 top-0 -z-10 h-full w-full rounded-s bg-white drop-shadow-md dark:bg-black",
            },
          }}
          striped
        >
          <Table.Head>
            <Table.HeadCell className="w-0 p-4">
              <Checkbox id="0" onChange={() => handleCheck()} />
            </Table.HeadCell>
            <Table.HeadCell>Product name</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell className="w-0">
              <span className="sr-only w-full">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body ref={tableRef} className="divide-y">
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="1"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="2"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="3"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="4"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="5"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox
                  id="6"
                  name="checkbox"
                  onChange={(ev) => handleCheck(ev.currentTarget.id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell className="flex w-fit gap-x-2">
                <div className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20">
                  <FaEye className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20">
                  <FaPen className="text-green-600 dark:text-green-500" />
                </div>
                <div className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20">
                  <FaTrash className="text-red-600 dark:text-red-500" />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              1-10
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              100
            </span>
          </span>
          <div className="flex items-center gap-x-4">
            <Select
              id="row-num"
              name="row-num"
              handleChange={(ev) => console.log(ev)}
              custom-style={{ inputStyle: "!py-2" }}
            >
              <option selected value={10}>
                10
              </option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </Select>
            <Pagination
              currentPage={10}
              onPageChange={() => 1}
              totalPages={20}
              theme={{
                pages: {
                  next: {
                    base: "rounded-r-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                  },
                  previous: {
                    base: "ml-0 rounded-l-s border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
