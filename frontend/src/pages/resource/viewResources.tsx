import { Button, Input, RSelect } from "@src/components/input";

import {
  Badge,
  Breadcrumb,
  Checkbox,
  Modal,
  Pagination,
  Spinner,
  Table,
  Tooltip,
} from "flowbite-react";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FaEye,
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
import { getResources, getCategories } from "@pages/shared/utils/api";
import { SkeletonTable } from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import Alert from "@src/components/alert";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { FaChevronDown, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown"; // DropdownListButton, // DropdownList,
import { customTable, customTooltip } from "@src/utils/flowbite";
import ViewResourceModal from "./components/viewResourceModal";
import FormResourceModal from "./components/formResourceModal";
import DeleteResourceModal from "./components/deleteResourceModal";
import { badgeColor } from "@src/utils/colors";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete";
  open: boolean;
}

export interface Resource {
  id: number;
  label: string;
  qty: string;
  school_id: number;
  categories: {
    id: string;
    label: string;
  };
}

interface Category {
  id: number;
  label: string;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}
interface Filter {
  label: string;
  minQty: number | undefined;
  maxQty: number | undefined;
  category_id: number | undefined;
}

export function ViewResources() {
  const location = useLocation();
  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    label: "",
    minQty: undefined,
    maxQty: undefined,
    category_id: undefined,
  });
  const [closeDropDown, setCloseDropDown] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<number | string>>([]);
  const [openModal, setOpenModal] = useState<Modal>();
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const user = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");

  // const userId = useRef<string>(null)
  const getAllResourcesQuery = useQuery({
    queryKey: [
      "getAllResources",
      filter?.label,
      filter?.maxQty,
      filter?.minQty,
      filter?.category_id,
    ],
    queryFn: () =>
      getResources(
        1,
        -1,
        undefined,
        undefined,
        user?.school_id,
        filter?.label,
        filter?.maxQty,
        filter?.minQty,
        filter?.category_id,
      ),
    placeholderData: keepPreviousData,
  });

  const getResourcesQuery = useQuery({
    queryKey: [
      "getResources",
      page,
      perPage,
      sort.column,
      sort.direction,
      user.school_id,
      filter?.label,
      filter?.maxQty,
      filter?.minQty,
      filter?.category_id,
    ],
    queryFn: () =>
      getResources(
        page,
        perPage,
        sort.column,
        sort.direction,
        user.school_id,
        filter?.label,
        filter?.maxQty,
        filter?.minQty,
        filter?.category_id,
      ),
    placeholderData: keepPreviousData,
  });

  const getCategoriesQuery = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => getCategories(1, -1, undefined, undefined, user.school_id),
  });

  const toggleCheck = async (id?: number) => {
    const firstCheckbox = firstCheckboxRef.current as HTMLInputElement;

    if (!id) {
      setChecks([]);
      await toggleChecks(firstCheckbox);
    } else {
      setChecks((prev) => {
        const newIdsCollection = prev.includes(id)
          ? prev.filter((i) => i != id)
          : [...prev, id];
        return newIdsCollection;
      });
      firstCheckbox.checked = false;
    }
  };

  const toggleChecks = useCallback(
    async (firstCheckbox: HTMLInputElement) => {
      if (getAllResourcesQuery.isFetched) {
        await getAllResourcesQuery.data?.forEach((resource: Resource) => {
          setChecks((prev) => {
            const checkedData = prev.includes(resource.id);
            const newIdsCollection =
              firstCheckbox.checked && !checkedData
                ? [...prev, resource.id]
                : [...prev];
            return newIdsCollection;
          });
        });
      }
    },
    [getAllResourcesQuery.data, getAllResourcesQuery.isFetched],
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

  const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    target.minQty;
    setFilter((prev) => ({
      ...prev,
      minQty:
        target.minQty.value !== "" ? Number(target.minQty.value) : undefined,
      maxQty:
        target.maxQty.value !== "" ? Number(target.maxQty.value) : undefined,
    }));

    setCloseDropDown(true);
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const onCloseModal = () => {
    setOpenModal(undefined);
  };

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  // const getUserName = (fullName: string) => {
  //   const nameParts = fullName?.trim().split(/\s+/);
  //   const firstName = nameParts?.slice(0, -1).join(" ");
  //   const lastName = nameParts?.slice(-1).join(" ");

  //   return { firstName, lastName };
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
    const resourceState = location.state?.resource?.id;
    if (resourceState) {
      setOpenModal({
        id: resourceState,
        type: "view",
        open: true,
      });
      window.history.replaceState({}, "");
    }
  }, [location]);

  useEffect(() => {
    if (isCheckBoxAll) {
      toggleChecks(firstCheckboxRef.current as HTMLInputElement);
    }
  }, [page, toggleChecks]);

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
        <Breadcrumb.Item icon={FaHome}>
          <Link
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            to="/"
          >
            {minSm ? t("general.home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("entities.resources")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item className="whitespace-nowrap">
          {t("actions.view_entity", { entity: t("entities.resource") })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <ViewResourceModal modal={openModal as Modal} onClose={onCloseModal} />

      <FormResourceModal
        action="Edit"
        modal={openModal as Modal}
        onClose={onCloseModal}
      />

      <DeleteResourceModal modal={openModal as Modal} onClose={onCloseModal} />

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
          {checks.length ? (
            <div className="flex w-full justify-between px-5 py-4">
              <div className="flex items-center gap-x-4">
                {/* <CheckboxDropdown /> */}

                <button className="btn-danger !m-0 flex w-max items-center">
                  <FaTrash className="mr-2 text-white" />
                  {t("general.delete")}
                  <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${checks.length}`}</span>
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
                    onChange={() => toggleCheck()}
                  />
                </Table.HeadCell>
                <Table.HeadCell>
                  {t("form.fields.id", { entity: t("entities.resource") })}
                </Table.HeadCell>
                <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {t("form.fields.label")}
                    </span>
                    <div
                      className="flex flex-col"
                      onClick={() => handleSort("label")}
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
                <Table.HeadCell>{t("form.fields.quantity")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.category")}</Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">Actions</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="relative border-b border-b-gray-300 dark:border-b-gray-600"
              >
                {getResourcesQuery.isFetching &&
                  (getResourcesQuery.isRefetching || perPage) && (
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
                    <Input
                      id="search"
                      type="text"
                      leftIcon={() => (
                        <>
                          <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.label !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  label: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      )}
                      label=""
                      placeholder={t("general.all")}
                      value={filter?.label}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) => (
                        setPage(1),
                        setFilter((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <div>
                      <Dropdown
                        onClose={(state) => setCloseDropDown(state as boolean)}
                        close={closeDropDown}
                        additionalStyle={{
                          dropdownStyle: "px-2 rounded-xs",
                        }}
                        element={
                          <div className="relative">
                            <Input
                              type="text"
                              readOnly
                              leftIcon={() => (
                                <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                              )}
                              custom-style={{
                                inputStyle:
                                  "cursor-default min-w-36 px-8 !py-1",
                                labelStyle: "mb-0 !inline",
                              }}
                              placeholder={t("general.all")}
                              value={
                                filter.minQty && filter.maxQty
                                  ? filter.minQty + " ⇆ " + filter.maxQty
                                  : filter.minQty
                                    ? "≥ " + filter.minQty
                                    : filter.maxQty
                                      ? "≤ " + filter.maxQty
                                      : ""
                              }
                            />

                            <FaChevronDown className="absolute right-0 top-1/2 mr-2 -translate-y-1/2 text-[11px] text-[#7f868e36] dark:text-gray-400" />
                            {(filter.maxQty !== undefined ||
                              filter.minQty !== undefined) && (
                              <FaRegCircleXmark
                                onClick={() => (
                                  console.log("clicked"),
                                  setCloseDropDown(true),
                                  setFilter((prev) => ({
                                    ...prev,
                                    maxQty: undefined,
                                    minQty: undefined,
                                  }))
                                )}
                                // onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-1/2 mr-6 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                              />
                            )}
                          </div>
                        }
                      >
                        <form onSubmit={handleFilter}>
                          <Dropdown.List>
                            <div className="flex gap-2">
                              <Input
                                id="minQty"
                                type="number"
                                custom-style={{
                                  containerStyle: "w-auto",
                                  inputStyle: "py-1",
                                }}
                                placeholder="min"
                                name="minQty"
                              />
                              <Input
                                id="maxQty"
                                type="number"
                                custom-style={{
                                  containerStyle: "w-auto",
                                  inputStyle: "py-1",
                                }}
                                placeholder="max"
                                name="maxQty"
                              />
                            </div>
                          </Dropdown.List>
                          <Button type="submit" className="btn-default h-8">
                            Save
                          </Button>
                        </form>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="category_id"
                      name="categories"
                      leftIcon={() => (
                        <>
                          <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.category_id !== undefined && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  category_id: undefined,
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
                      value={filter.category_id ?? "default"}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          [e.target.id]:
                            e.target.options[e.target.selectedIndex].value,
                        }))
                      }
                    >
                      <option
                        value="default"
                        disabled={filter.category_id !== undefined}
                      >
                        {t("general.all")}
                      </option>
                      {getCategoriesQuery.data?.map(
                        (category: Category, index: number) => (
                          <option key={index} value={category.id}>
                            {category.label}
                          </option>
                        ),
                      )}
                    </RSelect>
                  </Table.Cell>
                </Table.Row>
                {getResourcesQuery.isFetching &&
                !(getResourcesQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={6} />
                ) : (
                  getResourcesQuery?.data.data.map(
                    (resource: Resource, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          <Checkbox
                            className="rounded-xs"
                            id={resource.id.toString()}
                            name="checkbox"
                            checked={checks.includes(resource.id)}
                            onChange={() => toggleCheck(resource.id)}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {resource.id}
                        </Table.Cell>
                        <Table.Cell>{resource.label}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {resource.qty}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex w-max max-w-36 flex-wrap">
                            <Badge
                              color={
                                badgeColor[
                                  Math.floor(Math.random() * 5) %
                                    badgeColor.length
                                ]
                              }
                              className="mb-1 me-1 rounded-xs"
                            >
                              {resource.categories?.label}
                            </Badge>
                          </div>
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
                                    id: resource.id,
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
                                    id: resource.id,
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
                                    id: resource.id,
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
                {getResourcesQuery.data?.from}-{getResourcesQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getResourcesQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getResourcesQuery.data?.per_page}
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
                  !getResourcesQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getResourcesQuery.data?.last_page ?? 1}
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
