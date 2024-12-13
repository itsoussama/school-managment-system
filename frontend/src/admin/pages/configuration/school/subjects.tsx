import { colors } from "@src/admin/utils/colors";
import {
  customBadge,
  customTable,
  customTooltip,
} from "@src/admin/utils/flowbite";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown";
import { Checkbox, Input, MultiSelect, RSelect } from "@src/components/input";
import { SkeletonTable } from "@src/components/skeleton";
import { getGrades, getSubjects } from "@src/features/api";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Breadcrumb,
  Modal,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "flowbite-react";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaHome, FaPen, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Modal {
  id?: number;
  type?: "view" | "addSubject" | "edit" | "delete";
  open: boolean;
}

interface Section {
  id: number;
  name: string;
}

interface Grades {
  id: string;
  label: string;
}

export default function Subjects() {
  const { t } = useTranslation();
  const [data, setData] = useState<FormData>();
  const [openModal, setOpenModal] = useState<Modal>();
  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const admin = useAppSelector((state) => state.userSlice.user);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const minSm = useBreakpoint("min", "sm");

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
    queryFn: getGrades,
  });

  const handleChange = (property: string, value: string | number[]) => {
    setData((prev) => ({ ...(prev as FormData), [property]: value }));
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
  };

  const onCloseModal = () => {
    // parentMutation.reset();
    setOpenModal(undefined);

    // setData({
    //   id: 0,
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   phone: "",
    //   password: "",
    //   confirm_password: "",
    // });

    // setFormError({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirm_password: "",
    //   phone: "",
    // });
  };

  return (
    <div className="flex w-full flex-col">
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

        <button
          className="btn-default m-0 w-auto"
          onClick={() => setOpenModal({ open: true, type: "addSubject" })}
        >
          {t("actions.add_entity", {
            entity:
              t("determiners.indefinite.feminine") +
              " " +
              t("form.fields.subject"),
          })}
        </button>
      </div>

      <Modal
        show={openModal?.type === "addSubject" ? openModal?.open : false}
        onClose={onCloseModal}
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
      >
        <form
        // onSubmit={onSubmitGradeLevel}
        >
          <Modal.Header>
            {t("actions.add_entity", {
              entity:
                t("determiners.indefinite.masculine") +
                " " +
                t("form.fields.grade_level"),
            })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8">
              <Input
                type="text"
                id="subject"
                name="subject"
                label={t("form.fields.subject")}
                placeholder={t("form.fields.subject")}
                // onChange={(e) => handleChange(e.target.id, e.target.value)}
              />
              <MultiSelect
                label={t("form.fields.grade_levels")}
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
                      label={grade.label}
                      id={grade.id}
                      name="grades"
                      value={grade.label}
                    />
                  ),
                )}
              </MultiSelect>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

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
                className="relative divide-y divide-gray-300 dark:divide-gray-600"
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
                <Table.Row>
                  <Table.Cell className="sticky left-0 p-2 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2">
                    {/* <div className="h-2 w-12 bg-red-600"></div> */}
                    {/* <Input
                      id="search"
                      type="text"
                      icon={
                        <>
                          <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.title !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  title: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      }
                      label=""
                      placeholder={fieldTrans("filter-all")}
                      value={filter?.title}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="status"
                      name="status"
                      icon={
                        <>
                          <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.status !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  status: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-4 -translate-x-full -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      }
                      custom-style={{
                        inputStyle: "px-9 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      value={filter.status ?? "default"}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          [e.target.id]:
                            e.target.options[e.target.selectedIndex].value,
                        }))
                      }
                    >
                      <option value="default" disabled={filter.status !== ""}>
                        {fieldTrans("filter-all")}
                      </option>
                      {Object.entries(statusOptions).map((status, key) => (
                        <option key={key} value={status[0]}>
                          {t(status[0])}
                        </option>
                      ))}
                    </RSelect> */}
                  </Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                </Table.Row>
                {getSubjectsQuery.isFetching &&
                !(getSubjectsQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={5} />
                ) : (
                  getSubjectsQuery.data?.data.map(
                    (section: Section, key: number) => (
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
                          {section.id}
                        </Table.Cell>
                        <Table.Cell>{section.name}</Table.Cell>

                        <Table.Cell>
                          <div className="flex w-max max-w-48 flex-wrap">
                            {new Array(7).fill(null).map(
                              (_, key) =>
                                key < 5 && (
                                  <Badge
                                    theme={customBadge}
                                    color={colors[key % colors.length]}
                                    className="mb-1 me-1 rounded-xs"
                                  >
                                    {/* {t(maintenanceReq.status)} */}
                                    Grade 1
                                  </Badge>
                                ),
                            )}

                            <Badge
                              theme={customBadge}
                              color={"gray"}
                              className="mb-1 me-1 rounded-xs bg-gray-300 dark:bg-gray-500"
                            >
                              +2
                            </Badge>

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
                          {/* <div
                            className="flex cursor-pointer items-center gap-x-2"
                            onClick={() =>
                              redirect("/resources/manage", {
                                state: {
                                  resource: {
                                    id: maintenanceReq.resources.id,
                                  },
                                },
                              })
                            }
                          >
                            <img
                              className="w-8 rounded-full"
                              src={`https://ui-avatars.com/api/?background=random&name=${maintenanceReq.resources.label}}`}
                              alt="profile"
                            />
                            <span>{maintenanceReq.resources.label}</span>
                          </div> */}
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
                                    id: 0,
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
                                  onOpenEditModal({
                                    id: 0,
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
                                    id: 0,
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
