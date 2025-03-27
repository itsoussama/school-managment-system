import { Input, RSelect } from "@src/components/input";

import {
  Badge,
  Breadcrumb,
  Checkbox,
  Modal,
  Pagination,
  Spinner,
  Table,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTeachers,
  getSubjects,
  getGrades,
} from "@src/pages/shared/utils/api";
import { SkeletonTable } from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { FaEye, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import {
  customTable,
  customToggleSwitch,
  customTooltip,
} from "@src/utils/flowbite";
import React from "react";
import ViewTeacherModal from "./components/viewTeacherModal";
import FormTeacherModal from "./components/formTeacherModal";
import DeleteTeacherModal from "./components/deleteTeacherModal";
import BlockTeacherModal from "./components/blockTeacherModal";

interface Check {
  id?: number;
  status?: boolean;
}

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

export interface Teacher {
  id: number;
  name: string;
  imagePath: string;
  email: string;
  phone: string;
  blocked?: boolean;
  teacher: {
    ref: string;
    address: string;
  };
  payroll: {
    payroll_frequency: "daily" | "weekly" | "bi-weekly" | "monthly";
    net_salary?: number;
    hourly_rate?: number;
  };
  role: [
    {
      id: number;
      name: string;
    },
  ];
  subjects: [
    {
      id: number;
      name: string;
    },
  ];
  grades: [
    {
      id: number;
      label: string;
    },
  ];
}
export interface Grade {
  id: number;
  label: string;
}
export interface Subject {
  id: number;
  name: string;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}
interface Filter {
  name: string;
  subject: string;
  gradelevel: string;
}

export function ViewTeachers() {
  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    name: "",
    subject: "",
    gradelevel: "",
  });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const user = useAppSelector((state) => state.userSlice.user);
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const { t } = useTranslation();
  const badgeColor = ["blue", "green", "pink", "purple", "red", "yellow"];
  const minSm = useBreakpoint("min", "sm");
  const location = useLocation();
  // const userId = useRef<string>(null)

  const getAllTeachersQuery = useQuery({
    queryKey: [
      "getAllTeachers",
      filter?.name,
      filter?.subject,
      filter?.gradelevel,
    ],
    queryFn: () =>
      getTeachers(
        1,
        -1,
        undefined,
        undefined,
        user.school_id,
        filter?.name,
        filter?.subject,
        filter?.gradelevel,
      ),
    placeholderData: keepPreviousData,
  });

  const getTeachersQuery = useQuery({
    queryKey: [
      "getTeachers",
      page,
      perPage,
      sort.column,
      sort.direction,
      user.school_id,
      filter?.name,
      filter?.subject,
      filter?.gradelevel,
    ],
    queryFn: () =>
      getTeachers(
        page,
        perPage,
        sort.column,
        sort.direction,
        user.school_id,
        filter?.name,
        filter?.subject,
        filter?.gradelevel,
      ),
    placeholderData: keepPreviousData,
  });

  const getAllSubjectsQuery = useQuery({
    queryKey: ["getAllSubjects"],
    queryFn: () => getSubjects(1, -1, undefined, undefined, user.school_id),
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: () => getGrades(1, -1, undefined, undefined, user.school_id),
  });

  // const [selectedItem, setSelectedItem] = useState()

  const handleCheck = async (id?: number) => {
    const firstCheckbox = firstCheckboxRef.current as HTMLInputElement;

    if (!id) {
      setChecks([]);
      await handleChecks(firstCheckbox);
    } else {
      const getValue = checks.find((elem) => elem.id === id);
      const filteredArr = checks.filter((elem) => elem.id !== id);
      setChecks([
        ...(filteredArr as []),
        { id: id, status: !getValue?.status },
      ]);
      firstCheckbox.checked = false;
    }
  };

  const handleChecks = useCallback(
    async (firstCheckbox: HTMLInputElement) => {
      if (getAllTeachersQuery.isFetched) {
        await getAllTeachersQuery.data?.forEach((teacher: Teacher) => {
          setChecks((prev) => {
            const checkedData = prev.some((item) => item.id === teacher.id);
            if (firstCheckbox.checked && !checkedData) {
              return [...prev, { id: teacher.id as number, status: true }];
            }
            return [...prev, { id: teacher.id as number, status: false }];
          });
        });
      }
    },
    [getAllTeachersQuery.data, getAllTeachersQuery.isFetched],
  );

  const handleSort = (column: string) => {
    setSortPosition((prev) => prev + 1);
    switch (sortPosition) {
      case 0:
        setSort({ column: column, direction: "asc" });
        console.log("ascending");
        return;
      case 1:
        setSort({ column: column, direction: "desc" });
        console.log("descending");
        return;
      default:
        setSort({ column: "id", direction: "asc" });
        console.log("normal");
        setSortPosition(0);
        return;
    }
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  useEffect(() => {
    const alertState = location.state?.alert;
    toggleAlert({
      id: alertState?.id,
      status: alertState?.status,
      message: alertState?.message,
      state: alertState?.state,
    });
    window.history.replaceState({}, "");
  }, [location]);

  useEffect(() => {
    const checkedVal = checks.filter((val) => val.status === true)
      .length as number;
    setNumChecked(checkedVal);
  }, [checks]);

  useEffect(() => {
    if (isCheckBoxAll) {
      handleChecks(firstCheckboxRef.current as HTMLInputElement);
    }
  }, [page, handleChecks]);

  const closeAlert = useCallback((value: AlertType) => {
    toggleAlert(value);
  }, []);

  return (
    <div className="flex w-full flex-col">
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
        <Link
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          to="/"
        >
          <Breadcrumb.Item icon={FaHome}>
            {minSm ? t("general.home") : ""}
          </Breadcrumb.Item>
        </Link>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.teachers")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.view_entity", { entity: t("entities.teacher") })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <ViewTeacherModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <FormTeacherModal
        action="Edit"
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <DeleteTeacherModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <BlockTeacherModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
          {checks.find((val) => val.status === true) ? (
            <div className="flex w-full justify-between px-5 py-4">
              <div className="flex items-center gap-x-4">
                {/* <CheckboxDropdown /> */}

                <button className="btn-danger !m-0 flex w-max items-center">
                  <FaTrash className="mr-2 text-white" />
                  {t("actions.delete_entity")}
                  <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${numChecked}`}</span>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="w-full overflow-x-auto rounded-lg">
            <Table theme={customTable} striped>
              <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                <Table.HeadCell className="sticky left-0 w-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                  <Checkbox
                    className="rounded-xs"
                    id="0"
                    ref={firstCheckboxRef}
                    onChange={() => handleCheck()}
                  />
                </Table.HeadCell>
                <Table.HeadCell>
                  {t("form.fields.id", { entity: t("entities.parent") })}
                </Table.HeadCell>
                <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {t("form.fields.full_name")}
                    </span>
                    <div
                      className="flex flex-col"
                      onClick={() => handleSort("name")}
                    >
                      <FaSortUp
                        className={`h-2.5 ${sortPosition === 2 ? "text-gray-600" : "text-gray-400"}`}
                        viewBox="0 -140 320 412"
                      />
                      <FaSortDown
                        className={`h-2.5 ${sortPosition === 1 ? "text-gray-600" : "text-gray-400"}`}
                        viewBox="0 240 320 412"
                      />
                    </div>
                  </div>
                </Table.HeadCell>
                <Table.HeadCell>{t("form.fields.subjects")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.grade_levels")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.email")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.phone_number")}</Table.HeadCell>
                <Table.HeadCell>{t("general.active_time")}</Table.HeadCell>
                <Table.HeadCell>{t("status.active_deactivate")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">{t("general.actions")}</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body
                ref={tableRef}
                className="relative border-b border-b-gray-300 dark:border-b-gray-600"
              >
                {getTeachersQuery.isFetching &&
                  (getTeachersQuery.isRefetching || perPage) && (
                    <Table.Row>
                      <Table.Cell className="p-0">
                        <div
                          className={`table-loader fixed left-0 top-0 z-[1] grid h-full w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-60`}
                        >
                          <Spinner />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                <Table.Row>
                  <Table.Cell className="sticky left-0 p-2 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2">
                    <Input
                      id="search"
                      type="text"
                      leftIcon={() => (
                        <>
                          <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.name !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({ ...prev, name: "" }))
                              }
                              className="absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      )}
                      label=""
                      placeholder={t("general.all")}
                      value={filter.name}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) => (
                        setPage(1),
                        setFilter((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="subject"
                      name="subject"
                      leftIcon={() => (
                        <>
                          <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.subject !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({ ...prev, subject: "" }))
                              }
                              className="absolute right-0 top-1/2 mr-4 -translate-x-full -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      )}
                      custom-style={{
                        inputStyle: "px-9 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      defaultValue={""}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          [e.target.id]:
                            e.target.options[e.target.selectedIndex].value,
                        }))
                      }
                    >
                      <option
                        value=""
                        selected={filter.subject == "" ? true : false}
                        disabled
                      >
                        {t("general.all")}
                      </option>
                      {getAllSubjectsQuery.data?.map(
                        (subject: Subject, index: number) => (
                          <option key={index} value={subject.id}>
                            {subject.name}
                          </option>
                        ),
                      )}
                    </RSelect>
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="gradelevel"
                      name="gradelevel"
                      leftIcon={() => (
                        <>
                          <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.gradelevel !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  gradelevel: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-4 -translate-x-full -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      )}
                      custom-style={{
                        inputStyle: "px-9 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      defaultValue=""
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          [e.target.id]:
                            e.target.options[e.target.selectedIndex].value,
                        }))
                      }
                    >
                      <option
                        value=""
                        selected={filter.gradelevel == "" ? true : false}
                        disabled
                      >
                        {t("general.all")}
                      </option>
                      {getGradesQuery.data?.map(
                        (grade: Grade, index: number) => (
                          <option key={index} value={grade.id}>
                            {grade.label}
                          </option>
                        ),
                      )}
                    </RSelect>
                  </Table.Cell>

                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                </Table.Row>
                {getTeachersQuery.isFetching &&
                !(getTeachersQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={10} />
                ) : (
                  getTeachersQuery.data?.data.map(
                    (teacher: Teacher, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max !border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          <Checkbox
                            className="rounded-xs"
                            id={teacher.id.toString()}
                            name="checkbox"
                            checked={
                              checks.find((check) => check.id == teacher.id)
                                ?.status == true
                                ? true
                                : false
                            }
                            onChange={() => handleCheck(teacher.id)}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {teacher.teacher?.ref}
                        </Table.Cell>
                        <Table.Cell>{teacher.name}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          <div className="flex w-max max-w-36 flex-wrap">
                            {teacher.subjects.map((subject, index) => (
                              <Badge
                                key={index}
                                color={badgeColor[index % badgeColor.length]}
                                className="mb-1 me-1 rounded-xs"
                              >
                                {subject.name}
                              </Badge>
                            ))}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex w-max max-w-36 flex-wrap">
                            {teacher.grades.map((grade, index) => (
                              <Badge
                                key={index}
                                color={badgeColor[index % badgeColor.length]}
                                className="mb-1 me-1 rounded-xs"
                              >
                                {grade.label}
                              </Badge>
                            ))}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {teacher.email}
                        </Table.Cell>
                        <Table.Cell>{teacher.phone}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {/* <span>
                      {formatDuration(teacher.time_spent).hour}
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        h{" "}
                      </span>
                      {formatDuration(teacher.time_spent).minute > 0
                        ? formatDuration(teacher.time_spent).minute
                        : ""}
                      <span
                        className="text-gray-500 dark:text-gray-400"
                        hidden={formatDuration(teacher.time_spent).minute <= 0}
                      >
                        {" "}
                        min
                      </span>
                    </span> */}
                          -
                        </Table.Cell>
                        <Table.Cell>
                          <ToggleSwitch
                            theme={customToggleSwitch}
                            color={brandState}
                            checked={Boolean(teacher.blocked)}
                            onChange={() =>
                              setOpenModal({
                                id: teacher.id,
                                type: "block",
                                open: true,
                              })
                            }
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex h-full w-fit gap-x-2">
                            <Tooltip
                              content="View"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: teacher.id,
                                    type: "view",
                                    open: true,
                                  })
                                }
                                className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20"
                              >
                                <FaEye className="text-blue-600 dark:text-blue-500" />
                              </div>
                            </Tooltip>
                            <Tooltip
                              content="Edit"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20"
                                onClick={() =>
                                  setOpenModal({
                                    id: teacher.id,
                                    type: "edit",
                                    open: true,
                                  })
                                }
                              >
                                <FaPen className="text-green-600 dark:text-green-500" />
                              </div>
                            </Tooltip>
                            <Tooltip
                              content="Delete"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20"
                                onClick={() =>
                                  setOpenModal({
                                    id: teacher.id,
                                    type: "delete",
                                    open: true,
                                  })
                                }
                              >
                                <FaTrash className="text-red-600 dark:text-red-500" />
                              </div>
                            </Tooltip>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ),
                  )
                )}
              </Table.Body>
            </Table>
          </div>
          {/* <p>`${getTeachers}`</p> */}

          <div className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-gray-500 dark:text-gray-400">
              {t("pagination.records_shown")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getTeachersQuery.data?.from}-{getTeachersQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getTeachersQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getTeachersQuery.data?.per_page}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </RSelect>
              <Pagination
                layout={minSm ? "pagination" : "navigation"}
                showIcons
                currentPage={page}
                onPageChange={(page) =>
                  !getTeachersQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getTeachersQuery.data?.last_page ?? 1}
                nextLabel={minSm ? t("pagination.next") : ""}
                previousLabel={minSm ? t("pagination.previous") : ""}
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
      </TransitionAnimation>
    </div>
  );
}
