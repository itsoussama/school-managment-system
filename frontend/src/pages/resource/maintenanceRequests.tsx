import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import { customBadge, customTable, customTooltip } from "@src/utils/flowbite";
import Alert from "@src/components/alert";
import { TransitionAnimation } from "@src/components/animation";
import Dropdown from "@src/components/dropdown";
import {
  Button,
  Dropzone,
  Input,
  RSelect,
  RTextArea,
} from "@src/components/input";
import { SkeletonContent, SkeletonTable } from "@src/components/skeleton";
import {
  addMaintenanceRequest,
  deleteMaintenanceRequest,
  getMaintenanceRequest,
  getMaintenanceRequests,
  getResources,
  getSchoolStaff,
  setMaintenanceRequest,
  setMaintenanceRequestStatus,
} from "@src/pages/shared/utils/api";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { BsThreeDotsVertical, BsTriangleFill } from "react-icons/bs";
import {
  FaChevronDown,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaEye,
  FaHome,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import {
  FaCircle,
  FaDiamond,
  FaDownload,
  FaFileLines,
  FaPlus,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Resource } from "./viewResources";
import UserListModal from "@src/components/userListModal";
import { useFormValidation } from "@src/hooks/useFormValidation";

interface Check {
  id?: number;
  status?: boolean;
}
interface Modal {
  id?: number;
  type?: "view" | "add" | "edit" | "delete";
  open: boolean;
}

export type Status = "completed" | "in_progress" | "pending";
type Priority = "low" | "medium" | "high";

interface MaintenanceRequests {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  file_path: string;
  resolved_date: string;
  created_at: string;
  school_id: string;
  resources: {
    id: string;
    label: string;
  };
}

// interface Data {
//   id?: number;
//   title: string;
//   description: string;
//   status: Status;
//   priority: string;
//   file_path?: File;
//   resolved_date?: string;
//   created_at: string;
//   school_id: string;
//   users: number[];
//   userData?: Array<Record<string, string>>;
//   resource_id: number;
// }
export interface Data {
  _method?: string;
  id?: number;
  title: string;
  description: string;
  status: Status;
  priority: string;
  file_path?: File;
  created_at?: string;
  resolved_date?: string;
  users?: Array<number>;
  school_id?: string;
  resource_id?: number;
}

interface FormData {
  id?: number;
  title: string;
  description: string;
  status: Status;
  priority: string;
  file_path?: File;
  resolved_date?: string;
  created_at?: string;
  users?: Array<number>;
  userData?: Array<Record<string, string>>;
  resource_id?: number;
}

interface Sort {
  column: string;
  direction: "asc" | "desc";
}
interface Filter {
  title: string;
  status: string | undefined;
  category_id: number | undefined;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export default function MaintenanceRequests() {
  const queryClient = useQueryClient();
  const { formData, setData } = useFormValidation<FormData>({
    id: 0,
    title: "",
    description: "",
    status: "pending",
    priority: "",
    resolved_date: "",
    created_at: "",
    users: [],
    resource_id: 0,
  });

  // const location = useLocation();
  const redirect = useNavigate();
  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    title: "",
    status: "",
    category_id: undefined,
  });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  const [closeDropDown, setCloseDropDown] = useState<boolean>(false);
  const [openUserListModal, setOpenUserListModal] = useState<boolean>(false);
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  //   const [img, setImg] = useState<FileList>();
  //   const [previewImg, setPreviewImg] = useState<string>();
  //   const [formError, setFormError] = useState<DataError>({
  //     label: "",
  //     qty: 0,
  //   });
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.userSlice.user);
  const statusOptions = {
    completed: "green",
    in_progress: "blue",
    pending: "orange",
  };

  const priorityOptions = {
    low: { color: "blue", icon: FaCircle },
    medium: { color: "yellow", icon: BsTriangleFill },
    high: { color: "red", icon: FaDiamond },
  };

  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");

  const getAllMaintenanceRequestsQuery = useQuery({
    queryKey: ["getAllMaintenanceRequests", filter?.title, filter?.status],
    queryFn: () =>
      getMaintenanceRequests(
        1,
        -1,
        undefined,
        undefined,
        admin?.school_id,
        filter?.title,
        filter?.status,
      ),
    placeholderData: keepPreviousData,
  });

  const getMaintenanceRequestsQuery = useQuery({
    queryKey: [
      "getMaintenanceRequests",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
      filter?.title,
      filter?.status,
      // filter?.minQty,
      // filter?.category_id,
    ],
    queryFn: () =>
      getMaintenanceRequests(
        page,
        perPage,
        sort.column,
        sort.direction,
        admin.school_id,
        filter?.title,
        filter?.status,
        // filter?.minQty,
        // filter?.category_id,
      ),
    placeholderData: keepPreviousData,
  });

  const getMaintenanceRequestQuery = useQuery({
    queryKey: ["getMaintenanceRequest", openModal?.id],
    queryFn: () => getMaintenanceRequest(openModal?.id as number),
    enabled: !!openModal?.id,
  });

  const addMaintenanceRequestQuery = useMutation({
    mutationFn: addMaintenanceRequest,
    onSuccess: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.created_success"),
        state: true,
      });

      setData({
        id: 0,
        title: "",
        description: "",
        status: "pending",
        priority: "",
        resolved_date: "",
        created_at: "",
        users: [],
        resource_id: 0,
      });

      setOpenModal(undefined);
      setPage(1);
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

  const maintenanceRequestMutation = useMutation({
    mutationFn: setMaintenanceRequest,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["getMaintenanceRequest"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getMaintenanceRequests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllMaintenanceRequests"],
      });

      setData({
        id: data?.id as number,
        title: data?.title as string,
        description: data?.description as string,
        status: data?.status,
        priority: data?.priority,
        users: data?.users,
        created_at: data?.created_at,
        resource_id: data?.resource_id as number,
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);

      // setPreviewImg(undefined);
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

  const deleteMaintenanceRequestQuery = useMutation({
    mutationFn: deleteMaintenanceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getMaintenanceRequests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllMaintenanceRequests"],
      });

      setOpenModal(undefined);
      setPage(1);

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

  const getAllResourcesQuery = useQuery({
    queryKey: ["getAllResources"],
    queryFn: () => getResources(1, -1, undefined, undefined, admin?.school_id),
    placeholderData: keepPreviousData,
  });

  const getSchoolStaffQuery = useQuery({
    queryKey: ["getSchoolStaff"],
    queryFn: () => getSchoolStaff(admin?.school_id),
    placeholderData: keepPreviousData,
  });

  const maintenanceRequestStatusMutation = useMutation({
    mutationFn: setMaintenanceRequestStatus,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["getMaintenanceRequest"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getMaintenanceRequests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["getAllMaintenanceRequests"],
      });

      setData({
        id: data?.id as number,
        title: data?.title as string,
        description: data?.description as string,
        status: data?.status,
        priority: data?.priority,
        users: data?.users,
        created_at: data?.created_at,
        resource_id: data?.resource_id as number,
      });

      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: t("notifications.saved_success"),
        state: true,
      });

      // setPreviewImg(undefined);
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

  const handleDateTime = (
    options: Intl.DateTimeFormatOptions,
    date: number | Date,
  ): string => {
    return new Intl.DateTimeFormat(t("general.locales"), options).format(date);
  };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

  const handleStatusChange = (id: number, status: Status) => {
    // todo: Make an api call to handle status change
    maintenanceRequestStatusMutation.mutate({
      _method: "patch",
      id: id,
      status: status,
    });

    setCloseDropDown(true);
  };

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
      if (getAllMaintenanceRequestsQuery.isFetched) {
        await getAllMaintenanceRequestsQuery.data?.forEach(
          (maintenanceReq: MaintenanceRequests) => {
            setChecks((prev) => {
              const checkedData = prev.some(
                (item) => item.id === maintenanceReq.id,
              );

              if (firstCheckbox.checked && !checkedData) {
                return [
                  ...prev,
                  { id: maintenanceReq.id as number, status: true },
                ];
              }
              return [
                ...prev,
                { id: maintenanceReq.id as number, status: false },
              ];
            });
          },
        );
      }
    },
    [
      getAllMaintenanceRequestsQuery.data,
      getAllMaintenanceRequestsQuery.isFetched,
    ],
  );

  const dateTimeFormatter = (date: string | null) => {
    if (date !== null) {
      if (!isNaN(new Date(date).valueOf())) {
        const dateLocal: Date = new Date(date);
        const offsetDate = new Date(
          dateLocal.getTime() - dateLocal.getTimezoneOffset() * 60000,
        ); // Adjust for local timezone
        return offsetDate.toISOString().slice(0, 16);
      }
    }
    return "";
  };

  const onChange = (event: ChangeEvent) => {
    const inputElem = event.target as HTMLInputElement;
    const selectElem = event.target as HTMLSelectElement;
    // if (event?.target.nodeType)
    setData((prev) => ({
      ...prev,
      [event.target.id]:
        event?.target.nodeName == "SELECT"
          ? selectElem.options[selectElem.selectedIndex].value
          : inputElem.type == "file"
            ? (inputElem.files as FileList)[0]
            : inputElem.value,
    }));
    // console.log((event.target as HTMLInputElement).value);
  };

  const onSelectUser = (
    key: string,
    value: number[],
    name?: Array<Record<string, string>>,
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
      userData: name,
    }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const form: Data = {
        id: formData?.id as number,
        title: formData?.title as string,
        description: formData?.description as string,
        status: "pending",
        priority: formData?.priority as string,
        users: formData?.users as number[],
        resource_id: formData?.resource_id as number,
        school_id: admin?.school_id,
      };
      addMaintenanceRequestQuery.mutate(form);
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    }
  };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form: Data = {
        _method: "PUT",
        id: formData.id as number,
        title: formData?.title as string,
        description: formData?.description as string,
        status: formData?.status as Status,
        created_at: formData?.created_at,
        resolved_date: formData?.resolved_date,
        priority: formData?.priority as string,
        // users: data?.users,
      };

      maintenanceRequestMutation.mutate(form);
    } catch (e) {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: t("notifications.submission_failed"),
        state: true,
      });
    }
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (
      (input.verfication.value as string).toLowerCase() !==
      getMaintenanceRequestQuery.data?.title.toLowerCase()
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteMaintenanceRequestQuery.mutate(openModal?.id as number);
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const maintenanceReqData: Data = await queryClient.ensureQueryData({
      queryKey: ["getMaintenanceRequest", id],
      queryFn: () => getMaintenanceRequest(id as number),
    });

    console.log(maintenanceReqData);

    setData({
      id: maintenanceReqData?.id as number,
      title: maintenanceReqData?.title as string,
      description: maintenanceReqData?.description as string,
      status: maintenanceReqData?.status,
      created_at: maintenanceReqData?.created_at as string,
      resolved_date: maintenanceReqData?.resolved_date,
      priority: maintenanceReqData?.priority,
      users: maintenanceReqData?.users,
      resource_id: maintenanceReqData?.resource_id as number,
    });
  };

  const onCloseModal = () => {
    setOpenModal(undefined);

    setData({
      id: 0,
      title: "",
      description: "",
      status: "pending",
      priority: "",
      resolved_date: "",
      created_at: "",
      users: [],
      resource_id: 0,
    });

    // maintenanceRequestMutation.reset();

    // setFormError({
    //   label: "",
    //   qty: 0,
    // });
  };

  const getUserName = (fullName: string) => {
    const nameParts = fullName?.trim().split(/\s+/);
    const firstName = nameParts?.slice(0, -1).join(" ");
    const lastName = nameParts?.slice(-1).join(" ");

    return { firstName, lastName };
  };

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

        <Button
          className="btn-default m-0 flex w-auto items-center gap-x-2"
          onClick={() => setOpenModal({ open: true, type: "add" })}
        >
          <FaPlus />
          {t("actions.create_entity", {
            entity:
              t("determiners.indefinite.masculine") + " " + t("general.ticket"),
          })}
        </Button>
      </div>

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        // size={"2xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {t("form.fields.id", { entity: t("entities.resource") })}:
          <b> {openModal?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            {/* <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                // imgSource={
                //   getResourceQuery.data?.imagePath
                //     ? SERVER_STORAGE + getResourceQuery.data?.imagePath
                //     : `https://ui-avatars.com/api/?background=random&name=${getResourceQuery.data?.label}`
                // }
                imgSource={`https://ui-avatars.com/api/?background=random&name=chair`}
                className="h-40 w-40"
              />
            </div> */}
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <SkeletonContent isLoaded={true}>
                  <div className="grid grid-flow-col grid-rows-3 gap-x-5 gap-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("general.title")}:
                      </span>
                      <span className="whitespace-break-spaces text-base text-gray-900 dark:text-white">
                        {getMaintenanceRequestQuery.data?.title}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("entities.item")}:
                      </span>
                      <span className="w-max flex-1 break-words text-base text-gray-900 dark:text-white">
                        <p
                          className="group flex cursor-pointer flex-row items-center gap-x-2 hover:underline"
                          onClick={() =>
                            redirect("/resources/manage", {
                              state: {
                                resource: {
                                  id: getMaintenanceRequestQuery.data
                                    ?.resource_id,
                                },
                              },
                            })
                          }
                        >
                          {getMaintenanceRequestQuery.data?.resources.label}
                          <FaExternalLinkAlt
                            size={12}
                            className="hidden text-gray-400 group-hover:block"
                          />
                        </p>
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("general.assign_to")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        <div className="flex w-max cursor-pointer items-center gap-x-2 rounded-s py-2 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <img
                            className="w-6 rounded-full"
                            src={
                              getMaintenanceRequestQuery.data?.users[0]
                                .imagePath
                                ? SERVER_STORAGE +
                                  getMaintenanceRequestQuery.data?.users[0]
                                    .imagePath
                                : `https://ui-avatars.com/api/?background=random&name=${getUserName(getMaintenanceRequestQuery.data?.users[0].name).firstName}+${getUserName(getMaintenanceRequestQuery.data?.users[0].name).lastName}`
                            }
                            alt="profile"
                          />
                          <span>
                            {getMaintenanceRequestQuery.data?.users[0]?.name}
                          </span>
                        </div>
                      </span>
                    </div>
                    <div className="row-span-full flex flex-col gap-2 rounded-s bg-gray-50 p-4 dark:bg-gray-750">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                          {t("form.fields.issued_date")}:
                        </span>
                        <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                          {getMaintenanceRequestQuery.data?.created_at ? (
                            <>
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(
                                  getMaintenanceRequestQuery.data?.created_at,
                                ),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(
                                    getMaintenanceRequestQuery.data?.created_at,
                                  ),
                                )}
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                          {t("form.fields.resolved_date")}:
                        </span>
                        <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                          {getMaintenanceRequestQuery.data?.resolved_date ? (
                            <>
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(
                                  getMaintenanceRequestQuery.data?.resolved_date,
                                ),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(
                                    getMaintenanceRequestQuery.data?.resolved_date,
                                  ),
                                )}
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                          {t("form.fields.priority")}:
                        </span>
                        <span className="text-base text-gray-900 dark:text-white">
                          <Badge
                            // size={"xs"}
                            theme={customBadge}
                            color={
                              priorityOptions[
                                getMaintenanceRequestQuery.data
                                  ?.priority as Priority
                              ]?.color
                            }
                            icon={
                              priorityOptions[
                                getMaintenanceRequestQuery.data
                                  ?.priority as Priority
                              ]?.icon
                            }
                            className="w-max rounded-s px-2 py-0.5"
                          >
                            {t("priority.base", {
                              options:
                                getMaintenanceRequestQuery.data?.priority,
                            })}
                          </Badge>
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                          {t("form.fields.status")}:
                        </span>
                        <span className="text-base text-gray-900 dark:text-white">
                          <Badge
                            // size={"xs"}
                            theme={customBadge}
                            color={
                              statusOptions[
                                getMaintenanceRequestQuery.data
                                  ?.status as Status
                              ]
                            }
                          >
                            {t("status.base", {
                              options: getMaintenanceRequestQuery.data?.status,
                            })}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <div className="col-span-full flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.note")}:
                      </span>
                      <span className="whitespace-break-spaces text-base text-gray-900 dark:text-white">
                        {getMaintenanceRequestQuery.data?.description}
                      </span>
                    </div>
                    <div className="col-span-full flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.attachment")}:
                      </span>
                      <div className="flex flex-row items-center justify-between rounded-s bg-gray-100 px-4 py-2 text-gray-600 shadow-sharp-dark dark:bg-gray-600 dark:text-white dark:shadow-sharp-light">
                        <div className="relative flex w-full max-w-[90%] items-center justify-start gap-3 overflow-x-auto">
                          {/* <div className="sticky left-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-r to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
                          <FaFileLines className="shrink-0" size={32} />
                          <div className="text-start text-gray-900 dark:text-white">
                            File.mp4{" "}
                            <div className="mt-0 text-gray-500 dark:text-gray-400">
                              20.15MB
                            </div>
                          </div>
                          {/* <div className="sticky right-0 top-0 h-10 w-5 shrink-0 bg-gradient-to-l to-transparent dark:from-gray-700 dark:group-hover:from-slate-600"></div> */}
                        </div>
                        <FaEye
                          className="cursor-pointer rounded-full p-1.5 dark:hover:bg-gray-500"
                          size={28}
                        />
                        <FaDownload
                          className="cursor-pointer rounded-full p-1.5 dark:hover:bg-gray-500"
                          size={28}
                        />
                      </div>
                    </div>
                  </div>
                </SkeletonContent>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModal?.type === "add" ? openModal?.open : false}
        size={"2xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-[75vh] max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <form onSubmit={onSubmit}>
          <Modal.Header>
            {t("actions.new_entity", { entity: t("entities.resource") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      label={t("general.title")}
                      placeholder={t("form.placeholders.title")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                        containerStyle: "col-span-full",
                      }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.title as string) || ""}
                      onChange={onChange}
                    />

                    <RSelect
                      id="resource_id"
                      name="item"
                      label={t("entities.item")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.resource_id as number) || ""}
                      onChange={onChange}
                    >
                      <option value="default">Choose Item</option>
                      {getAllResourcesQuery.data?.map(
                        (resource: Resource, index: number) => (
                          <option key={index} value={resource.id}>
                            {resource.label}
                          </option>
                        ),
                      )}
                    </RSelect>

                    <RSelect
                      id="priority"
                      name="priority"
                      label={t("form.fields.priority")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.priority as string) || ""}
                      onChange={onChange}
                    >
                      <option value="default">Choose Priority</option>
                      {Object.entries(priorityOptions).map((priority, key) => (
                        <option key={key} value={priority[0]}>
                          {t("priority.base", {
                            options: priority[0],
                          })}
                        </option>
                      ))}
                    </RSelect>

                    {/* <RSelect
                      id="users"
                      name="userAssigned"
                      label={fieldTrans("assigned-to")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      defaultValue="default"
                      onChange={onChange}
                    >
                      <option value="default">Choose Priority</option>
                      {Object.entries(priorityOptions).map((priority, key) => (
                        <option key={key} value={priority[0]}>
                          {priority[0]}
                        </option>
                      ))}
                    </RSelect> */}

                    <Input
                      type="text"
                      readOnly
                      label={t("general.assign_to")}
                      rightIcon={() => FaChevronDown}
                      custom-style={{
                        inputStyle: "cursor-default",
                      }}
                      placeholder="Assign To"
                      onClick={() => setOpenUserListModal(true)}
                      value={
                        (formData.userData as [])?.length
                          ? (formData.userData as Array<{ label: string }>)[0]
                              ?.label
                          : ""
                      }
                    />

                    <RTextArea
                      id="description"
                      name="description"
                      label={t("form.fields.note")}
                      placeholder={t("form.placeholders.note")}
                      custom-style={{ containerStyle: "col-span-full" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.description as string) || ""}
                      onChange={onChange}
                    />

                    <Dropzone
                      id="attachment"
                      label={t("form.fields.attachment")}
                      onChange={onChange}
                      custom-style={{ containerStyle: "col-span-full h-auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button
              type="reset"
              className="btn-danger !w-auto"
              onClick={onCloseModal}
            >
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "edit" ? openModal?.open : false}
        size={"2xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-[75vh] max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <form onSubmit={onSubmitUpdate}>
          <Modal.Header>
            {t("form.fields.id", { entity: t("entities.resource") })}:
            <b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      label={t("general.title")}
                      placeholder={t("form.placeholders.title")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                        containerStyle: "col-span-full",
                      }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.title as string) || ""}
                      onChange={onChange}
                    />

                    {/* <RSelect
                      id="item"
                      name="item"
                      label={fieldTrans("item")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      defaultValue={data?.resource_id}
                      onChange={onChange}
                    >
                      <option></option>
                    </RSelect> */}

                    <RSelect
                      id="status"
                      name="status"
                      label={t("form.fields.status")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData.status as Status) || ""}
                      onChange={onChange}
                    >
                      {Object.entries(statusOptions).map((status, key) => (
                        <option key={key} value={status[0]}>
                          {t("status.base", {
                            options: status[0],
                          })}
                        </option>
                      ))}
                    </RSelect>

                    <RSelect
                      id="priority"
                      name="priority"
                      label={t("form.fields.priority")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData?.priority as Priority) || ""}
                      onChange={onChange}
                    >
                      {Object.entries(priorityOptions).map((priority, key) => (
                        <option key={key} value={priority[0]}>
                          {t("priority.base", {
                            options: priority[0],
                          })}
                        </option>
                      ))}
                    </RSelect>

                    <RTextArea
                      id="note"
                      name="note"
                      label={t("form.fields.note")}
                      placeholder={t("form.placeholders.note")}
                      custom-style={{ containerStyle: "col-span-full" }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={(formData?.description as Priority) || ""}
                      onChange={onChange}
                    />

                    <Input
                      type="datetime-local"
                      id="created_at"
                      name="issuedDate"
                      label={t("form.fields.issued_date")}
                      placeholder={t("form.fields.issued_date")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                      }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={
                        dateTimeFormatter(formData?.created_at as string) || ""
                      }
                      onChange={onChange}
                    />

                    <Input
                      type="datetime-local"
                      id="resolved_date"
                      name="resolvedDate"
                      label={t("form.fields.resolved_date")}
                      placeholder={t("form.placeholders.resolved_date")}
                      custom-style={{
                        inputStyle: "disabled:opacity-50",
                      }}
                      disabled={getMaintenanceRequestQuery.isFetching && true}
                      value={
                        dateTimeFormatter(formData?.resolved_date as string) ||
                        ""
                      }
                      onChange={onChange}
                    />

                    <Dropzone
                      id="attachment"
                      label={t("form.fields.attachment")}
                      onChange={(e) => console.log(e.target)}
                      custom-style={{ containerStyle: "col-span-full h-auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
            <button
              type="reset"
              className="btn-danger !w-auto"
              onClick={onCloseModal}
            >
              {t("general.decline")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={openModal?.type === "delete" ? openModal?.open : false}
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
        <form onSubmit={onSubmitDelete}>
          <Modal.Header>
            {t("actions.delete_entity", { entity: t("entities.resource") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.delete.title")}
                <b>{getMaintenanceRequestQuery.data?.title}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                <Trans
                  i18nKey="modals.delete.label"
                  values={{ item: getMaintenanceRequestQuery.data?.title }}
                  components={{ bold: <strong /> }}
                />
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("modals.delete.error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {t("modals.delete.delete_button")}
            </button>
            <button
              type="reset"
              className="btn-outline !w-auto"
              onClick={onCloseModal}
            >
              {t("modals.delete.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <UserListModal
        modalHeader={
          t("actions.designate_user", {
            entity: `${t("determiners.indefinite.masculine")} ${t("entities.staff_member")}`,
          }) as string
        }
        modalSize="md"
        name="users"
        open={openUserListModal}
        onChange={(key, value, name) => onSelectUser(key, value, name)}
        onClose={(status) => setOpenUserListModal(status)}
        selectedUsersList={formData.users as number[]}
        userList={getSchoolStaffQuery.data?.map(
          (user: Record<string, string>) => ({
            id: user.id,
            name: user.name,
            imagePath: user.imagePath,
          }),
        )}
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
                  {t("form.fields.id", { entity: t("entities.item") })}
                </Table.HeadCell>
                <Table.HeadCell>
                  <div className="flex items-center gap-x-3">
                    <span className="inline-block">
                      {t("form.fields.subject")}
                    </span>
                    <div
                      className="flex flex-col"
                      onClick={() => handleSort("title")}
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
                <Table.HeadCell>{t("entities.item")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.status")}</Table.HeadCell>
                <Table.HeadCell>{t("form.fields.issued_date")}</Table.HeadCell>
                <Table.HeadCell>
                  {t("form.fields.resolved_date")}
                </Table.HeadCell>
                <Table.HeadCell className="w-0">
                  <span className="w-full">{t("general.actions")}</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body
                ref={tableRef}
                className="relative border-b border-b-gray-300 dark:border-b-gray-600"
              >
                {getMaintenanceRequestsQuery.isFetching &&
                  (getMaintenanceRequestsQuery.isRefetching || perPage) && (
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
                      )}
                      label=""
                      placeholder={t("general.all")}
                      value={filter?.title}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) => (
                        setPage(1),
                        setFilter((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      )}
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2">
                    <RSelect
                      id="status"
                      name="status"
                      leftIcon={() => (
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
                      )}
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
                        {t("general.all")}
                      </option>
                      {Object.entries(statusOptions).map((status, key) => (
                        <option key={key} value={status[0]}>
                          {t("status.base", {
                            options: status[0],
                          })}
                        </option>
                      ))}
                    </RSelect>
                  </Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                  <Table.Cell className="p-2"></Table.Cell>
                </Table.Row>
                {getMaintenanceRequestsQuery.isFetching &&
                !(getMaintenanceRequestsQuery.isRefetching || perPage) ? (
                  <SkeletonTable cols={8} />
                ) : (
                  getMaintenanceRequestsQuery?.data.data.map(
                    (maintenanceReq: MaintenanceRequests, key: number) => (
                      <Table.Row
                        key={key}
                        className="w-max bg-white dark:bg-gray-800"
                      >
                        <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                          <Checkbox
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
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {maintenanceReq.id}
                        </Table.Cell>
                        <Table.Cell>{maintenanceReq.title}</Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          <div
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
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-x-2">
                            <Badge
                              theme={customBadge}
                              color={
                                statusOptions[maintenanceReq.status as Status]
                              }
                              className="w-max rounded-s"
                            >
                              {t("status.base", {
                                options: maintenanceReq.status,
                              })}
                            </Badge>
                            <Dropdown
                              element={
                                <BsThreeDotsVertical className="cursor-pointer" />
                              }
                              width="auto"
                              additionalStyle={{
                                dropdownStyle: "px-2 rounded-xs",
                              }}
                              onClose={(state) =>
                                setCloseDropDown(state as boolean)
                              }
                              close={closeDropDown}
                            >
                              <Dropdown.List>
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
                                        {t("status.base", {
                                          options: status[0],
                                        })}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </Dropdown.List>
                            </Dropdown>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {maintenanceReq.created_at ? (
                            <>
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(maintenanceReq.created_at),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(maintenanceReq.created_at),
                                )}
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {maintenanceReq.resolved_date ? (
                            <>
                              {handleDateTime(
                                { dateStyle: "short" },
                                new Date(maintenanceReq.resolved_date),
                              )}
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {handleDateTime(
                                  { timeStyle: "short" },
                                  new Date(maintenanceReq.resolved_date),
                                )}
                              </span>
                            </>
                          ) : (
                            "-"
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
                                    id: maintenanceReq.id,
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
                                    id: maintenanceReq.id,
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
                                    id: maintenanceReq.id,
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
                {getMaintenanceRequestsQuery.data?.from}-
                {getMaintenanceRequestsQuery.data?.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getMaintenanceRequestsQuery.data?.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getMaintenanceRequestsQuery.data?.per_page}
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
                  !getMaintenanceRequestsQuery.isPlaceholderData &&
                  setPage(page)
                }
                totalPages={getMaintenanceRequestsQuery.data?.last_page ?? 1}
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
