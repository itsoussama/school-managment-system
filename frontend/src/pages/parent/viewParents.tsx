import { Button, Input, RSelect } from "@src/components/input";

import {
  Breadcrumb,
  Checkbox,
  Modal,
  Pagination,
  Spinner,
  Table,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import React, {
  ChangeEvent,
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteUsers, getParents } from "@pages/shared/utils/api";
import { SkeletonTable } from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import Dropdown from "@src/components/dropdown";
import useBreakpoint from "@src/hooks/useBreakpoint";
import AddChildModal from "@pages/shared/components/addChildModal";
import { Alert as AlertType, alertIntialState } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { FaEye, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import {
  customTable,
  customToggleSwitch,
  customTooltip,
} from "@src/utils/flowbite";
import { BrandColor, colorPalette } from "@src/utils/colors";
import FormParentModal from "./components/formParentModal";
import ViewParentModal from "./components/viewParentModal";
import DeleteParentModal from "./components/deleteParentModal";
import BlockParentModal from "./components/blockParentModal";

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ChildModal {
  id: number;
  school_id: string;
  open: boolean;
}

export interface Childrens {
  id: number;
  imagePath: string;
  name: string;
}

export interface Parent {
  id: number;
  imagePath: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  school_id: string;
  blocked?: boolean;
  role: [
    {
      id: string;
      name: string;
    },
  ];
  parent: {
    ref: string;
  };
  childrens: Childrens[];
}

interface BlockSwitch {
  [key: string]: boolean;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}

interface Filter {
  name: string;
  childName: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function ViewParents() {
  const queryClient = useQueryClient();
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const location = useLocation();

  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    name: "",
    childName: "",
  });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<number | string>>([]);
  const [openModal, setOpenModal] = useState<Modal>();
  const [openChildModal, setOpenChildModal] = useState<ChildModal>({
    id: 0,
    school_id: "",
    open: false,
  });
  // const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");
  const navigate = useNavigate();

  const getAllParentsQuery = useQuery({
    queryKey: ["getAllParents", filter?.name, filter?.childName],
    queryFn: () =>
      getParents(
        1,
        -1,
        undefined,
        undefined,
        admin.school_id,
        filter?.name,
        filter?.childName,
      ),
    placeholderData: keepPreviousData,
  });

  const getParentsQuery = useQuery({
    queryKey: [
      "getParents",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
      filter?.name,
      filter?.childName,
    ],
    queryFn: () =>
      getParents(
        page,
        perPage,
        sort.column,
        sort.direction,
        admin.school_id,
        filter?.name,
        filter?.childName,
      ),
    placeholderData: keepPreviousData,
  });

  const deleteUsersMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
      });

      setChecks([]);

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.deleted_success"),
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    },
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
      if (getAllParentsQuery.isFetched) {
        await getAllParentsQuery.data?.forEach((parent: Parent) => {
          setChecks((prev) => {
            const checkedData = prev.includes(parent.id);
            const newIdsCollection =
              firstCheckbox.checked && !checkedData
                ? [...prev, parent.id]
                : [...prev];
            return newIdsCollection;
          });
        });
      }
    },
    [getAllParentsQuery.data, getAllParentsQuery.isFetched],
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

  const onDeleteUsers = () => {
    const form: { user_ids: number[] } = {
      user_ids: checks as number[],
    };
    deleteUsersMutation.mutate(form);
  };

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

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
    if (isCheckBoxAll) {
      toggleChecks(firstCheckboxRef.current as HTMLInputElement);
    }
  }, [page, toggleChecks]);

  useEffect(() => {
    if (getParentsQuery.isFetched) {
      let data = {};
      getParentsQuery.data?.data.map((parent: Parent) => {
        data = { ...data, [parent.id]: !!parent.blocked };
      });
      setBlockSwitch(data);
    }
  }, [getParentsQuery.data, getParentsQuery.isFetched]);

  useEffect(() => {
    const parentState = location.state?.parent?.id;
    if (parentState) {
      setOpenModal({
        id: parentState,
        type: "view",
        open: true,
      });
      window.history.replaceState({}, "");
    }
  }, [location]);

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
              {t("entities.parents")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          {t("actions.view_entity", { entity: t("entities.parent") })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <ViewParentModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <FormParentModal
        action="Edit"
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <DeleteParentModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      {/* block / unblock user */}
      <BlockParentModal
        modal={openModal as Modal}
        onClose={() => setOpenModal(undefined)}
      />

      <AddChildModal
        open={openChildModal?.open as boolean}
        toggleOpen={(isOpen: boolean) =>
          setOpenChildModal((prev: ChildModal) => ({
            id: openChildModal?.id as number,
            school_id: prev?.school_id,
            open: isOpen,
          }))
        }
        guardian_id={openChildModal.id}
        school_id={openChildModal?.school_id}
      />

      <TransitionAnimation>
        <div className="flex w-full flex-col rounded-m border border-gray-200 bg-light-primary dark:border-gray-700 dark:bg-dark-primary">
          {checks.length ? (
            <div className="flex w-full justify-between px-5 py-4">
              <div className="flex items-center gap-x-4">
                {/* <CheckboxDropdown /> */}

                <Button
                  className="btn-danger !m-0 flex w-max items-center"
                  onClick={() => onDeleteUsers()}
                >
                  <FaTrash className="mr-2 text-white" />
                  {t("actions.delete_entity")}
                  <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${checks.length}`}</span>
                </Button>
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
                <Table.HeadCell>{t("form.fields.childrens")}</Table.HeadCell>
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
                {getParentsQuery.isFetching &&
                  (getParentsQuery.isRefetching || perPage) && (
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
                    <Input
                      id="search"
                      type="text"
                      leftIcon={() => (
                        <>
                          <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          {filter.childName !== "" && (
                            <FaRegCircleXmark
                              onClick={() =>
                                setFilter((prev) => ({
                                  ...prev,
                                  childName: "",
                                }))
                              }
                              className="absolute right-0 top-1/2 mr-3 -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </>
                      )}
                      label=""
                      placeholder={t("general.all")}
                      value={filter.childName}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          childName: e.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                </Table.Row>

                {getParentsQuery.isFetching &&
                !(getParentsQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={9} />
                ) : (
                  getParentsQuery.data.data?.map(
                    (parent: Parent, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 z-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          <Checkbox
                            className="rounded-xs"
                            id={parent.id.toString()}
                            name="checkbox"
                            checked={checks.includes(parent.id)}
                            onChange={() => toggleCheck(parent.id)}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {parent.parent?.ref}
                        </Table.Cell>
                        <Table.Cell>{parent.name}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          <Dropdown
                            triggerEvent="hover"
                            additionalStyle={{ containerStyle: "!w-auto" }}
                            width="auto"
                            element={
                              <div className="flex items-center gap-x-2">
                                {parent.childrens.length > 2 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {parent.childrens?.map(
                                      (child, key) =>
                                        key < 1 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                            src={
                                              child?.imagePath
                                                ? SERVER_STORAGE +
                                                  child?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${getUserName(child?.name).firstName}+${getUserName(child?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                    <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 group-odd:border-white group-even:border-gray-50 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500 dark:group-odd:border-gray-800 dark:group-even:border-gray-700">
                                      {`+${parent.childrens.length - 1}`}
                                    </div>
                                  </div>
                                ) : parent.childrens.length > 1 ? (
                                  <div className="pointer-events-none flex -space-x-4 rtl:space-x-reverse">
                                    {parent.childrens?.map(
                                      (child, key) =>
                                        key < 1 && (
                                          <img
                                            key={key}
                                            className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                            src={
                                              child?.imagePath
                                                ? SERVER_STORAGE +
                                                  child?.imagePath
                                                : `https://ui-avatars.com/api/?background=random&name=${getUserName(child?.name).firstName}+${getUserName(child?.name).lastName}`
                                            }
                                            alt="profile"
                                          />
                                        ),
                                    )}
                                    <div className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-gray-500 text-xs font-semibold text-white hover:bg-gray-600 group-odd:border-white group-even:border-gray-50 dark:bg-gray-400 dark:text-gray-900 dark:hover:bg-gray-500 dark:group-odd:border-gray-800 dark:group-even:border-gray-700">
                                      {`+${parent.childrens.length - 1}`}
                                    </div>
                                  </div>
                                ) : (
                                  parent.childrens?.length == 1 && (
                                    <>
                                      <img
                                        className="h-10 w-10 rounded-full border-2 group-odd:border-white group-even:border-gray-50 dark:group-odd:border-gray-800 dark:group-even:border-gray-700"
                                        src={
                                          parent.childrens[0]?.imagePath
                                            ? SERVER_STORAGE +
                                              parent.childrens[0]?.imagePath
                                            : `https://ui-avatars.com/api/?background=random&name=${getUserName(parent.childrens[0]?.name).firstName}+${getUserName(parent.childrens[0]?.name).lastName}`
                                        }
                                        alt="profile"
                                      />
                                      <span className="pointer-events-none">
                                        {parent.childrens[0]?.name}
                                      </span>
                                    </>
                                  )
                                )}
                              </div>
                            }
                          >
                            <Dropdown.List>
                              {parent.childrens.map((child, key) => (
                                <Dropdown.Item
                                  key={key}
                                  img={
                                    child.imagePath
                                      ? SERVER_STORAGE + child.imagePath
                                      : `https://ui-avatars.com/api/?background=random&name=${getUserName(child.name).firstName}+${getUserName(child.name).lastName}`
                                  }
                                  onClick={() =>
                                    navigate("/parents/manage", {
                                      state: {
                                        child: {
                                          id: child.id,
                                        },
                                      },
                                    })
                                  }
                                >
                                  {child.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.List>
                            <Dropdown.Button>
                              <p
                                onClick={() =>
                                  setOpenChildModal({
                                    id: parent.id,
                                    school_id: parent.school_id,
                                    open: true,
                                  })
                                }
                              >
                                {t("general.add_new_child")}
                              </p>
                            </Dropdown.Button>
                          </Dropdown>
                          {parent.childrens?.length < 1 && (
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
                              onClick={() =>
                                setOpenChildModal({
                                  id: parent.id,
                                  school_id: parent.school_id,
                                  open: true,
                                })
                              }
                            >
                              <FaUser className="me-2" />
                              {t("general.add_new_child")}
                            </div>
                          )}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {parent.email}
                        </Table.Cell>
                        <Table.Cell>{parent.phone}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {/* <span>
                      {formatDuration(parent.time_spent).hour}
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        h{" "}
                      </span>
                      {formatDuration(parent.time_spent).minute > 0
                        ? formatDuration(parent.time_spent).minute
                        : ""}
                      <span
                        className="text-gray-500 dark:text-gray-400"
                        hidden={formatDuration(parent.time_spent).minute <= 0}
                      >
                        {" "}
                        min
                      </span>
                    </span> */}
                        </Table.Cell>
                        <Table.Cell>
                          <ToggleSwitch
                            theme={customToggleSwitch}
                            color={brandState}
                            checked={blockSwitch[parent.id] || false}
                            onChange={() =>
                              setOpenModal({
                                id: parent.id,
                                type: "block",
                                open: true,
                              })
                            }
                          />
                        </Table.Cell>
                        <Table.Cell className="flex w-fit gap-x-2">
                          <div className="flex w-fit gap-x-2">
                            <Tooltip
                              content="View"
                              style="auto"
                              theme={customTooltip}
                            >
                              <div
                                onClick={() =>
                                  setOpenModal({
                                    id: parent.id,
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
                                    id: parent.id,
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
                                    id: parent.id,
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
                {getParentsQuery.data?.from}-{getParentsQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getParentsQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getParentsQuery.data?.per_page}
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
                  !getParentsQuery.isPlaceholderData && setPage(page)
                }
                totalPages={getParentsQuery.data?.last_page ?? 1}
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
