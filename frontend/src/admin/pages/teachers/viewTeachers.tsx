import { Input, Select } from "@src/components/input";

import { Breadcrumb, Checkbox, Modal, Pagination, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaHome,
  FaLock,
  FaPen,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface Check {
  id?: string;
  status?: boolean;
}

interface ViewModal {
  id: string;
  open: boolean;
}

const teachers = [
  {
    uid: "T001",
    fullName: "Leanne Graham",
    subject: "Math",
    gradeLevel: "9th, 10th",
    email: "test@example.com",
    phone: "+212 600 0000",
  },
  {
    uid: "T002",
    fullName: "Leanne Graham",
    subject: "Math",
    gradeLevel: "9th, 10th",
    email: "test@example.com",
    phone: "+212 600 0000",
  },
  {
    uid: "T003",
    fullName: "Leanne Graham",
    subject: "Math",
    gradeLevel: "9th, 10th",
    email: "test@example.com",
    phone: "+212 600 0000",
  },
];

export function ViewTeachers() {
  const { t } = useTranslation();
  // const [selectedItem, setSelectedItem] = useState()
  const [checkAll, setCheckAll] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openViewModal, setViewOpenModal] = useState<ViewModal>();
  const [openEditModal, setEditOpenModal] = useState<ViewModal>();
  const [openDeleteModal, setDeleteOpenModal] = useState<ViewModal>();
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
    <div className="flex w-full flex-col">
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
        <Breadcrumb.Item>{t("view-teacher")}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openViewModal?.open}
        // size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
        onClose={() =>
          setViewOpenModal((prev) => ({
            id: prev?.id as string,
            open: false,
          }))
        }
      >
        {/* {`${console.log(theme)}`} */}
        <Modal.Header>{openViewModal?.id}</Modal.Header>
        <Modal.Body>
          <div className="flex gap-x-8">
            <div className="flex flex-col items-start rounded-s bg-gray-800 p-4">
              <img
                className="max-w-40 rounded-full"
                src="https://i.pravatar.cc/300"
                alt=""
              />
            </div>
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-800 px-4 py-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h1>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      First name:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Leanne
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Last name:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Graham
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      test@example.com
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      +212 600 0000
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Address:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      123 Rue Principale
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-800 px-4 py-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Academic Information
                </h1>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      First name:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Leanne
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Last name:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      Graham
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      test@example.com
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      +212 600 0000
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      Address:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      123 Rue Principale
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <button
            className="btn-default !w-auto"
            onClick={() =>
              setViewOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            I accept
          </button>
          <button
            className="btn-danger !w-auto"
            onClick={() =>
              setViewOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            Decline
          </button>
        </Modal.Footer> */}
      </Modal>

      <Modal
        show={openEditModal?.open}
        size={"4xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
        onClose={() =>
          setEditOpenModal((prev) => ({
            id: prev?.id as string,
            open: false,
          }))
        }
      >
        {/* {`${console.log(theme)}`} */}
        <Modal.Header>{openEditModal?.id}</Modal.Header>
        <Modal.Body>
          <div className="flex gap-x-8">
            <div className="flex flex-col items-start rounded-s bg-gray-800 p-4">
              <img
                className="max-w-40 rounded-full"
                src="https://i.pravatar.cc/300"
                alt=""
              />
            </div>
            <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-800 px-4 py-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h1>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <Input
                    type="text"
                    id="firstname"
                    name="firstname"
                    label="First name"
                    placeholder="First name"
                    handleChange={() => null}
                  />

                  <Input
                    type="text"
                    id="lastname"
                    name="lastname"
                    label="Last name"
                    placeholder="Last name"
                    handleChange={() => null}
                  />

                  <Input
                    type="text"
                    id="address"
                    name="address"
                    label="Address"
                    placeholder="123 Rue Principale"
                    handleChange={() => null}
                    custom-style={{ containerStyle: "col-span-full" }}
                  />

                  <Input
                    type="tel"
                    id="tel"
                    name="tel"
                    label="Phone number"
                    placeholder="06 00 00 00"
                    handleChange={() => null}
                    attribute={{ pattern: "(06 | 05)[0-9]{2}[0-9]{4}" }}
                  />

                  <Input
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Johndoe@example.com"
                    handleChange={() => null}
                  />

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
                    handleChange={() => null}
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
                    handleChange={() => null}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-default !w-auto"
            onClick={() =>
              setEditOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            I accept
          </button>
          <button
            className="btn-danger !w-auto"
            onClick={() =>
              setEditOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            Decline
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={openDeleteModal?.open}
        size={"md"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6",
            popup: "pt-0",
          },
        }}
        onClose={() =>
          setDeleteOpenModal((prev) => ({
            id: prev?.id as string,
            open: false,
          }))
        }
      >
        {/* {`${console.log(theme)}`} */}
        <Modal.Header>Delete User</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-x-8">
            <p className="mb-3 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <b>Leanne Graham?</b>
            </p>
            <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
              <FaExclamationTriangle className="text-white" size={53} />
              <p className="text-white">
                This will delete the user completely, and you can not undo this
                action
              </p>
            </div>
            <p className="text-gray-900 dark:text-white">
              Please retype user id <b>A2400001</b>
            </p>
            <Input
              type="text"
              id="verfication"
              name="verfication"
              placeholder="XXXXXX"
              handleChange={() => null}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-danger !w-auto"
            onClick={() =>
              setDeleteOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            Delete
          </button>
          <button
            className="btn-outline !w-auto"
            onClick={() =>
              setDeleteOpenModal((prev) => ({
                id: prev?.id as string,
                open: false,
              }))
            }
          >
            No, cancel
          </button>
        </Modal.Footer>
      </Modal>

      <div className="flex w-full flex-col rounded-m bg-light-primary dark:bg-dark-primary">
        <div className="flex w-full justify-between px-5 py-4">
          <div className="flex items-center gap-x-4">
            <Select
              id="period"
              name="period"
              icon={
                <FaClock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              }
              handleChange={(ev) => console.log(ev)}
              custom-style={{ inputStyle: "px-10", labelStyle: "!m-0" }}
              attribute={{ defaultValue: 0 }}
            >
              <option>Last 30 days</option>
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

        <div className="w-full overflow-x-auto">
          <Table
            theme={{
              root: {
                base: "w-full whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400",
                shadow:
                  "absolute left-0 top-0 -z-10 h-full w-full rounded-s bg-white drop-shadow-md dark:bg-black",
                wrapper: "relative",
              },
            }}
            striped
          >
            <Table.Head>
              <Table.HeadCell className="w-0 p-4">
                <Checkbox id="0" onChange={() => handleCheck()} />
              </Table.HeadCell>
              <Table.HeadCell>UID</Table.HeadCell>
              <Table.HeadCell>FULLNAME</Table.HeadCell>
              <Table.HeadCell>SUBJECT</Table.HeadCell>
              <Table.HeadCell>GRADE LEVEL</Table.HeadCell>
              <Table.HeadCell>EMAIL</Table.HeadCell>
              <Table.HeadCell>PHONE</Table.HeadCell>
              <Table.HeadCell className="w-0">
                <span className="sr-only w-full">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body ref={tableRef} className="divide-y">
              {teachers.map((teacher, key) => (
                <Table.Row
                  key={key}
                  className="w-max !border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="p-4">
                    <Checkbox
                      id={(key + 1).toString()}
                      name="checkbox"
                      onChange={(ev) => handleCheck(ev.currentTarget.id)}
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                    {teacher.uid}
                  </Table.Cell>
                  <Table.Cell>{teacher.fullName}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                    {teacher.subject}
                  </Table.Cell>
                  <Table.Cell>{teacher.gradeLevel}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                    {teacher.email}
                  </Table.Cell>
                  <Table.Cell>{teacher.phone}</Table.Cell>
                  <Table.Cell className="flex w-fit gap-x-2">
                    <div
                      onClick={() =>
                        setViewOpenModal({ id: teacher.uid, open: true })
                      }
                      className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20"
                    >
                      <FaEye className="text-blue-600 dark:text-blue-500" />
                    </div>
                    <div
                      className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20"
                      onClick={() =>
                        setEditOpenModal({ id: teacher.uid, open: true })
                      }
                    >
                      <FaPen className="text-green-600 dark:text-green-500" />
                    </div>
                    <div
                      className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20"
                      onClick={() =>
                        setDeleteOpenModal({ id: teacher.uid, open: true })
                      }
                    >
                      <FaTrash className="text-red-600 dark:text-red-500" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex w-full items-center justify-between px-5 py-4">
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
              attribute={{ defaultValue: 10 }}
            >
              <option value={10}>10</option>
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
