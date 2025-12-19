import { BrandColor, colorPalette, colors } from "@src/utils/colors";
import { customBadge, customTable, customTooltip } from "@src/utils/flowbite";
import { TransitionAnimation } from "@src/components/animation";
import { Button, RSelect } from "@src/components/input";
import { SkeletonTable } from "@src/components/skeleton";
import {
  getGrades,
  getSubjects,
  getTeachers,
} from "@src/pages/shared/utils/api";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Breadcrumb,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "flowbite-react";
import { ChangeEvent, CSSProperties, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaHome, FaPen, FaTrash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
// import { useFormValidation } from "@src/hooks/useFormValidation";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import Dropdown from "@src/components/dropdown";
import { Teacher } from "@pages/teacher/viewTeachers";
import EditSubjectModal from "../components/editSubjectModal";
import ViewSubjectModal from "../components/viewSubjectModal";
import DeleteSubjectModal from "../components/deleteSubjectModal";
import AddSubjectModal from "../components/addSubjectModal";
import { formatUserName } from "@src/pages/shared/utils/formatters";

export interface ModalProps {
  id?: number;
  type?: "view" | "addSubject" | "edit" | "delete";
  open: boolean;
}
export interface Subject {
  id: number;
  name: string;
  grades: Grades[];
  teachers: Teacher[];
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export interface Grades {
  id: number;
  label: string;
}

export default function Subjects() {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<ModalProps>();
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const minSm = useBreakpoint("min", "sm");
  const navigate = useNavigate();

  const getSubjectsQuery = useQuery({
    queryKey: [
      "getSubjects",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
    ],
    queryFn: () =>
      getSubjects(page, perPage, sort.column, sort.direction, admin.school_id),
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: () => getGrades(1, -1, undefined, undefined, admin.school_id),
  });

  const getTeachersQuery = useQuery({
    queryKey: ["getAllTeachers"],
    queryFn: () => getTeachers(1, -1, undefined, undefined, admin.school_id),
  });

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

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

      <div className="flex items-center justify-between">
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
            <>
              <Breadcrumb.Item>
                <span className="text-gray-600 dark:text-gray-300">
                  {t("entities.configurations")}
                </span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span className="text-gray-600 dark:text-gray-300">
                  {t("entities.school")}
                </span>
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>...</Breadcrumb.Item>
          )}
          <Breadcrumb.Item className="whitespace-nowrap">
            {t("form.fields.subjects")}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Button
          className="btn-default m-0 w-auto"
          onClick={() => setOpenModal({ open: true, type: "addSubject" })}
        >
          {t("actions.add_entity", {
            entity:
              t("determiners.indefinite.feminine") +
              " " +
              t("form.fields.subject"),
          })}
        </Button>
      </div>

      <ViewSubjectModal
        modal={openModal as ModalProps}
        onClose={() => setOpenModal(undefined)}
      />

      <AddSubjectModal
        modal={openModal as ModalProps}
        onClose={() => setOpenModal(undefined)}
        grades={getGradesQuery.data}
        teachers={getTeachersQuery.data}
      />

      <EditSubjectModal
        modal={openModal as ModalProps}
        onClose={() => setOpenModal(undefined)}
        grades={getGradesQuery.data}
        teachers={getTeachersQuery.data}
      />

      <DeleteSubjectModal
        modal={openModal as ModalProps}
        onClose={() => setOpenModal(undefined)}
      />

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
          <div className="w-full overflow-x-auto rounded-lg">
            <Table theme={customTable} striped>
              <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
                <Table.HeadCell className="sticky left-0 w-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                  {/* <Checkbox
                    className="rounded-xs"
                    id="0"
                    ref={firstCheckboxRef}
                    onChange={() => handleCheck()}
                  /> */}
                </Table.HeadCell>
                <Table.HeadCell>
                  {t("form.fields.id", { entity: t("form.fields.subjects") })}
                </Table.HeadCell>
                {/* <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {t("subject")}
                    </span>
                    <div
                      className="flex flex-col"
                    //   onClick={() => handleSort("title")}
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
                </Table.HeadCell>*/}
                <Table.HeadCell>{t("form.fields.label")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.grade_levels")}</Table.HeadCell>
                <Table.HeadCell>{t("entities.teachers")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">{t("general.actions")}</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="relative border-b border-b-gray-300 dark:border-b-gray-600"
              >
                {getSubjectsQuery.isFetching &&
                  (getSubjectsQuery.isRefetching || perPage) && (
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

                {getSubjectsQuery.isFetching &&
                !(getSubjectsQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={6} />
                ) : (
                  getSubjectsQuery.data?.data.map(
                    (subject: Subject, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          {/* <Checkbox
                            className="rounded-xs"
                            id={maintenanceReq.id.toString()}
                            name="checkbox"
                            checked={
                              checks.find(
                                (check) => check.id == maintenanceReq.id,
                              )?.status == true
                                ? true
                                : false
                            }
                            onChange={() => handleCheck(maintenanceReq.id)}
                          /> */}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {subject.id}
                        </Table.Cell>
                        <Table.Cell>{subject.name}</Table.Cell>

                        <Table.Cell>
                          <div className="flex w-max max-w-48 flex-wrap">
                            {subject.grades?.map(
                              (grade, key) =>
                                key <= 5 && (
                                  <Badge
                                    key={key}
                                    theme={customBadge}
                                    color={colors[key % colors.length]}
                                    className="mb-1 me-1 rounded-xs"
                                  >
                                    {/* {t(maintenanceReq.status)} */}
                                    {grade.label}
                                  </Badge>
                                ),
                            )}

                            {subject.grades?.length > 5 && (
                              <Badge
                                theme={customBadge}
                                color={"gray"}
                                className="mb-1 me-1 rounded-xs bg-gray-300 dark:bg-gray-500"
                              >
                                +{subject.grades?.length - 5}
                              </Badge>
                            )}

                            {/* <Dropdown
                              element={
                                // <div className=""></div>
                              }
                              width="max-content"
                              additionalStyle={{
                                containerStyle: "rounded-s px-1 py-0",
                              }}
                            //   onClose={(state) =>
                            //     setCloseDropDown(state as boolean)
                            //   }
                            //   close={closeDropDown}
                            >
                              <Dropdown.List
                                additionalStyle={{ containerStyle: " py-1" }}
                              >
                                {Object.entries(statusOptions).map(
                                  (status, key) => (
                                    <div
                                      key={key}
                                      className="cursor-pointer rounded-s py-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                      onClick={() =>
                                        handleStatusChange(
                                          maintenanceReq.id,
                                          status[0] as Status,
                                        )
                                      }
                                    >
                                      <Badge
                                        theme={customBadge}
                                        data-status={status[0]}
                                        className="w-max rounded-xs"
                                        color={status[1]}
                                        key={key}
                                      >
                                        {t(status[0])}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </Dropdown.List>
                            </Dropdown> */}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          <Dropdown
                            triggerEvent="hover"
                            additionalStyle={{ containerStyle: "!w-auto" }}
                            width="auto"
                            element={
                              <div className="flex items-center gap-x-2">
                                {subject.teachers.length > 2 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {subject.teachers?.map(
                                      (teacher, key) =>
                                        key < 2 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                            src={
                                              teacher?.imagePath
                                                ? SERVER_STORAGE +
                                                  teacher?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher?.name).firstName}+${formatUserName(teacher?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                    <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 group-odd:border-white group-even:border-gray-50 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500 dark:group-odd:border-gray-800 dark:group-even:border-gray-700">
                                      {`+${subject.teachers.length - 2}`}
                                    </div>
                                  </div>
                                ) : subject.teachers.length > 1 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {subject.teachers?.map(
                                      (teacher, key) =>
                                        key < 2 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                            src={
                                              teacher?.imagePath
                                                ? SERVER_STORAGE +
                                                  teacher?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher?.name).firstName}+${formatUserName(teacher?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                  </div>
                                ) : (
                                  subject.teachers?.length == 1 && (
                                    <>
                                      <img
                                        className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                        src={
                                          subject.teachers[0]?.imagePath
                                            ? SERVER_STORAGE +
                                              subject.teachers[0]?.imagePath
                                            : `https://ui-avatars.com/api/?background=random&name=${formatUserName(subject.teachers[0]?.name).firstName}+${formatUserName(subject.teachers[0]?.name).lastName}`
                                        }
                                        alt="profile"
                                      />
                                      <span className="pointer-events-none">
                                        {subject.teachers[0]?.name}
                                      </span>
                                    </>
                                  )
                                )}
                              </div>
                            }
                          >
                            <Dropdown.List>
                              {subject.teachers.map((teacher, key) => (
                                <Dropdown.Item
                                  key={key}
                                  img={
                                    teacher.imagePath
                                      ? SERVER_STORAGE + teacher.imagePath
                                      : `https://ui-avatars.com/api/?background=random&name=${formatUserName(teacher.name).firstName}+${formatUserName(teacher.name).lastName}`
                                  }
                                >
                                  {teacher.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.List>
                            <Dropdown.Button>
                              <p onClick={() => navigate("/teachers/new")}>
                                {t("actions.add_entity", {
                                  entity: t("entities.teacher"),
                                })}
                              </p>
                            </Dropdown.Button>
                          </Dropdown>
                          {subject.teachers?.length < 1 && (
                            <div
                              className="flex cursor-pointer items-center text-sm font-medium text-[var(--brand-color-600)] hover:underline dark:text-[var(--brand-color-500)]"
                              style={
                                {
                                  "--brand-color-500":
                                    colorPalette[brandState as BrandColor][500],
                                  "--brand-color-600":
                                    colorPalette[brandState as BrandColor][600],
                                } as CSSProperties
                              }
                              onClick={() => navigate("/teachers/new")}
                            >
                              <FaUser className="me-2" />
                              {t("actions.add_entity", {
                                entity: t("entities.teacher"),
                              })}
                            </div>
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          <div className="flex w-fit gap-x-2">
                            <Tooltip
                              content="View"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: subject.id,
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
                                    id: subject.id,
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
                                    id: subject.id,
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

          <div className="flex w-full items-center justify-between px-5 py-4">
            <span className="text-gray-500 dark:text-gray-400">
              {t("pagination.records_shown")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getSubjectsQuery.data?.from}-{getSubjectsQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getSubjectsQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getSubjectsQuery.data?.per_page}
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
                  !getSubjectsQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getSubjectsQuery.data?.last_page ?? 1}
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
