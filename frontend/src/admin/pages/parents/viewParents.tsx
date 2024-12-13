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
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FaExclamationTriangle,
  FaHome,
  FaLock,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteUser,
  getUser,
  getParents,
  setParent,
  unblockUser,
  blockUser,
} from "@api";
import {
  SkeletonContent,
  SkeletonProfile,
  SkeletonTable,
} from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import Dropdown from "@src/components/dropdown";
import useBreakpoint from "@src/hooks/useBreakpoint";
import AddChildModal from "@src/admin/components/addChildModal";
import { Alert as AlertType, alertIntialState } from "@src/admin/utils/alert";
import Alert from "@src/components/alert";
import { FaEye, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import { customTable, customTooltip } from "@src/admin/utils/flowbite";

interface Check {
  id?: number;
  status?: boolean;
}

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ChildModal {
  id: number;
  school_id: number;
  open: boolean;
}

interface Parent {
  id: number;
  imagePath: string;
  name: string;
  email: string;
  phone: string;
  school_id: number;
  blocked?: boolean;
  role: [
    {
      id: string;
      name: string;
    },
  ];
  childrens: [
    {
      id: string;
      imagePath: string;
      name: string;
    },
  ];
}

export interface FormData {
  _method: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: File;
  password?: string;
  password_confirmation?: string;
}

interface Data {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  image?: File;
}

interface DataError {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

interface BlockSwitch {
  [key: string]: boolean;
}

interface File {
  lastModified: number;
  name: string;
  size: number;
  type: string;
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
  // queryClient.invalidateQueries({ queryKey: ["getTeacher"] });
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
  const [numChecked, setNumChecked] = useState<number>(0);
  const [checks, setChecks] = useState<Array<Check>>([]);
  const [openModal, setOpenModal] = useState<Modal>();
  const [openChildModal, setOpenChildModal] = useState<ChildModal>({
    id: 0,
    school_id: 0,
    open: false,
  });
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const [data, setData] = useState<Data>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [formError, setFormError] = useState<DataError>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });
  const [changePassword, toggleChangePassword] = useState<boolean>(false);
  // const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.userSlice.user);
  const { t } = useTranslation();
  const minSm = useBreakpoint("min", "sm");

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

  const getParentQuery = useQuery({
    queryKey: ["getParent", openModal?.id, "parent"],
    queryFn: () => getUser(openModal?.id as number, "parent"),
    enabled: !!openModal?.id,
  });

  const parentMutation = useMutation({
    mutationFn: setParent,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getParent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
      });

      setData({
        id: data?.id,
        firstName: getUserName(data?.name).firstName,
        lastName: getUserName(data?.name).lastName,
        email: data?.email,
        phone: data?.phone,
        password: "",
        confirm_password: "",
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });

      setOpenModal(undefined);
      setPage(1);

      setPreviewImg(undefined);
    },
    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const deleteUserQuery = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
      });

      setOpenModal(undefined);
      setPage(1);

      setData({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getParent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const unBlockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getParent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getParents"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllParents"],
      });

      toggleAlert({
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  // const [selectedItem, setSelectedItem] = useState()

  const onChange = (event: ChangeEvent) => {
    const inputElem = event.target as HTMLInputElement;
    const selectElem = event.target as HTMLSelectElement;
    // if (event?.target.nodeType)
    setData((prev) => ({
      ...(prev as Data),
      [event.target.id]:
        event?.target.nodeName == "SELECT"
          ? selectElem.options[selectElem.selectedIndex].value
          : inputElem.value,
    }));
  };

  const handleCheck = async (id?: number) => {
    const firstCheckbox = firstCheckboxRef.current as HTMLInputElement;
    // console.log(id);

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
      if (getAllParentsQuery.isFetched) {
        await getAllParentsQuery.data?.data.forEach((parent: Parent) => {
          setChecks((prev) => {
            const checkedData = prev.some((item) => item.id === parent.id);
            if (firstCheckbox.checked && !checkedData) {
              return [...prev, { id: parent.id as number, status: true }];
            }
            return [...prev, { id: parent.id as number, status: false }];
          });
        });
      }
    },
    [getAllParentsQuery.data?.data, getAllParentsQuery.isFetched],
  );

  const handleClientError = (field: HTMLFormElement) => {
    // const passwordValidation = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&()\-`.+,/"]).{8,}$/;
    const passwordValidation = /[0-9]{8}/;

    // Error messages for empty or invalid fields
    const messages = {
      password:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      confirm_password: "Passwords do not match. Please try again.",
    };

    const isEmpty = (value: string) => value.trim() === "";
    let error = false;

    // Function to set error messages and update the error flag
    const setError = (fieldName: string, message: string) => {
      setFormError((prev) => ({
        ...prev,
        [fieldName]: message,
      }));
      error = true;
    };

    // Clear error messages if validation is successful
    const clearError = (fieldName: string) => {
      setFormError((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    };

    // Validate password field
    if (changePassword) {
      if (isEmpty(field.password.value)) {
        setError("password", "Password field is required.");
      } else if (!passwordValidation.test(field.password.value)) {
        setError("password", messages.password);
      } else {
        clearError("password");
      }

      // Validate confirm password field
      if (isEmpty(field.confirm_password.value)) {
        setError("confirm_password", "Please confirm your password.");
      } else if (field.password.value !== field.confirm_password.value) {
        setError("confirm_password", messages.confirm_password);
      } else {
        clearError("confirm_password");
      }
    }

    return error;
  };

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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
    }
  };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.target as HTMLFormElement;

    if (!handleClientError(input)) {
      const form: FormData = {
        _method: "PUT",
        id: data?.id,
        name: data?.firstName + " " + data?.lastName,
        email: data?.email,
        phone: data?.phone,
      };

      if (img) {
        form["image"] = img[0];
      }

      if (data?.password) {
        form["password"] = data?.password;
        form["password_confirmation"] = data?.confirm_password;
      }

      parentMutation.mutate(form);
    } else {
      toggleAlert({
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    }
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (input.verfication.value !== getParentQuery.data?.data.name) {
      setIsVerficationMatch(false);
      return;
    }

    deleteUserQuery.mutate(openModal?.id as number);
  };

  const onSubmitBlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId: number = openModal?.id as number;

    if (!blockSwitch[userId]) {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [userId]: true,
      }));
      blockUserMutation.mutate({ user_id: userId });
    } else {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [userId]: false,
      }));
      unBlockUserMutation.mutate({ user_id: userId });
    }
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const { data: parentData } = await queryClient.ensureQueryData({
      queryKey: ["getParent", id],
      queryFn: () => getUser(id),
    });

    setData({
      id: parentData?.id,
      firstName: getUserName(parentData?.name).firstName,
      lastName: getUserName(parentData?.name).lastName,
      email: parentData?.email,
      phone: parentData?.phone,
      password: "",
      confirm_password: "",
    });
  };

  const onCloseModal = () => {
    parentMutation.reset();
    setOpenModal(undefined);

    toggleChangePassword(false);

    setData({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    });

    setFormError({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
    });
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

  const readAndPreview = (file: FileList) => {
    if (/\.(jpe?g|png|gif)$/i.test(file[0].name)) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (event) => {
        setPreviewImg(event.target?.result as string);
      });
      fileReader.readAsDataURL(file[0]);
    }
  };

  useEffect(() => {
    const alertState = location.state?.alert;
    toggleAlert({
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

  useEffect(() => {
    if (getParentsQuery.isFetched) {
      let data = {};
      getParentsQuery.data?.data.data.map((parent: Parent) => {
        data = { ...data, [parent.id]: !!parent.blocked };
      });
      setBlockSwitch(data);
    }
  }, [getParentsQuery.data, getParentsQuery.isFetched]);

  return (
    <div className="flex w-full flex-col">
      <Alert
        status={alert.status}
        state={alert.state}
        message={alert.message}
        close={(value) => toggleAlert(value)}
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

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        size={"3xl"}
        theme={{
          content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner:
              "relative box-border flex flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
          body: {
            base: "p-6 max-sm:h-screen max-sm:overflow-y-auto",
            popup: "pt-0",
          },
        }}
        onClose={onCloseModal}
      >
        <Modal.Header>
          {t("form.fields.id", { entity: t("entities.parent") })}:
          <b> {openModal?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getParentQuery.data?.data.imagePath
                    ? SERVER_STORAGE + getParentQuery.data?.data.imagePath
                    : `https://ui-avatars.com/api/?background=random&name=${getUserName(getParentQuery.data?.data.name).firstName}+${getUserName(getParentQuery.data?.data.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("status.active_deactivate")}
                </span>
                <ToggleSwitch
                  theme={{
                    toggle: {
                      base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                    },
                  }}
                  checked={blockSwitch[getParentQuery.data?.data.id] || false}
                  onChange={() =>
                    setOpenModal({
                      id: getParentQuery.data?.data.id,
                      type: "block",
                      open: true,
                    })
                  }
                />
              </div>
            </div>
            <div className="box-border flex max-h-[70vh] w-full flex-col gap-6 overflow-y-auto">
              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.personal_information")}
                </h1>
                <SkeletonContent isLoaded={getParentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(210px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.first_name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getParentQuery.data?.data.name).firstName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.last_name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getParentQuery.data?.data.name).lastName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.email")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getParentQuery.data?.data.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.phone_number")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getParentQuery.data?.data.phone}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.address")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        123 Rue Principale
                      </span>
                    </div>
                  </div>
                </SkeletonContent>
              </div>

              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("information.academic_information")}
                </h1>
                <div className="flex flex-col">
                  <span className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-400">
                    {t("form.fields.childrens")}:
                  </span>
                  <div className="flex w-max max-w-52 flex-wrap">
                    {getParentQuery.data?.data.childrens.length > 0 ? (
                      (getParentQuery.data?.data as Parent).childrens?.map(
                        (child, key) => (
                          <Badge
                            key={key}
                            color="dark"
                            className="mb-1 me-1 whitespace-nowrap rounded-xs"
                          >
                            <img
                              key={key}
                              className="me-2 inline-block h-5 w-5 rounded-full"
                              src={
                                child?.imagePath
                                  ? SERVER_STORAGE + child?.imagePath
                                  : `https://ui-avatars.com/api/?background=random&name=${getUserName(child?.name).firstName}+${getUserName(child?.name).lastName}`
                              }
                              alt="profile"
                            />
                            {child.name}
                          </Badge>
                        ),
                      )
                    ) : (
                      <div
                        className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                        onClick={() =>
                          setOpenChildModal({
                            id: getParentQuery.data?.data.id,
                            school_id: getParentQuery.data?.data.school_id,
                            open: true,
                          })
                        }
                      >
                        <FaUser className="me-2" />
                        {t("general.add_new_child")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModal?.type === "edit" ? openModal?.open : false}
        size={"4xl"}
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
            {t("form.fields.id", { entity: t("entities.parent") })}:
            <b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="flex min-w-fit flex-col items-center gap-y-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                <SkeletonProfile
                  imgSource={
                    previewImg
                      ? previewImg
                      : getParentQuery.data?.data.imagePath
                        ? SERVER_STORAGE + getParentQuery.data?.data.imagePath
                        : `https://ui-avatars.com/api/?background=random&name=${getUserName(getParentQuery.data?.data.name).firstName}+${getUserName(getParentQuery.data?.data.name).lastName}`
                  }
                  className="h-40 w-40"
                />
                <button className="btn-gray relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute left-0 top-0 cursor-pointer opacity-0"
                    onChange={handleImageUpload}
                  />
                  {t("form.buttons.upload", { label: t("general.photo") })}
                </button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("form.general.accepted_format")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      jpg, jpeg, png
                    </span>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("form.general.maximum_size")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      1024 mb
                    </span>
                  </span>
                </div>
              </div>
              <div className="box-border flex w-full flex-col gap-6 sm:max-h-[60vh] sm:overflow-y-auto">
                <div className="w-full space-y-3">
                  <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {t("information.personal_information")}
                  </h1>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      label={t("form.fields.first_name")}
                      placeholder={t("form.placeholders.first_name")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getParentQuery.isFetching && true}
                      value={data?.firstName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      label={t("form.fields.last_name")}
                      placeholder={t("form.placeholders.last_name")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getParentQuery.isFetching && true}
                      value={data?.lastName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="address"
                      name="address"
                      label={t("form.fields.address")}
                      placeholder={t("form.placeholders.address")}
                      value="123 Rue Principale"
                      onChange={(e) => console.log(e.target.value)}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      label={t("form.fields.phone_number")}
                      placeholder="06 00 00 00"
                      pattern="(06|05)[0-9]{6}"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getParentQuery.isFetching && true}
                      value={data?.phone}
                      onChange={onChange}
                    />

                    <Input
                      type="email"
                      id="email"
                      name="email"
                      label={t("form.fields.email")}
                      placeholder={t("form.placeholders.email")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getParentQuery.isFetching && true}
                      value={data?.email}
                      onChange={onChange}
                    />

                    <div className="col-span-full border-t border-gray-300 dark:border-gray-600"></div>

                    {changePassword ? (
                      <>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          label={t("form.fields.password")}
                          placeholder="●●●●●●●"
                          error={formError.password}
                          value={data?.password}
                          custom-style={{
                            inputStyle: "px-10",
                          }}
                          icon={
                            <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          }
                          onChange={onChange}
                        />

                        <Input
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          label={t("form.fields.confirm_password")}
                          placeholder="●●●●●●●"
                          error={formError.confirm_password}
                          value={data?.confirm_password}
                          custom-style={{
                            inputStyle: "px-10",
                          }}
                          icon={
                            <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                          }
                          onChange={onChange}
                        />
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleChangePassword(true)}
                          className="btn-default !w-auto"
                        >
                          {t("form.buttons.change", {
                            label:
                              t("determiners.definite.masculine") +
                              " " +
                              t("form.fields.password"),
                          })}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
            {t("actions.delete_entity", { entity: t("entities.parent") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.delete.title")}
                <b>{getParentQuery.data?.data.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("modals.delete.label", {
                  item: getParentQuery.data?.data.name,
                })}
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
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.delete.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* block / unblock user */}
      <Modal
        show={openModal?.type === "block" ? openModal?.open : false}
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
        <form onSubmit={onSubmitBlock}>
          <Modal.Header>
            {t("actions.block_entity", { entity: t("general.user") })}
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("modals.block.title")}{" "}
                <b>{getParentQuery.data?.data.name}</b>
              </p>
              {/* <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.block.message")}</p>
              </div> */}
              {/* <p className="text-gray-900 dark:text-white">
                {t("modals.block.label")}{" "}
                <b>{getParentQuery.data?.data.name}</b>
              </p> */}
              {/* <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={
                  !isVerficationMatch ? fieldTrans("delete-modal-error") : null
                }
                required
              /> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {getParentQuery.data?.data.blocked == 0
                ? t("modals.block.block_button")
                : t("modals.block.unblock_button")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.block.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

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
                className="relative divide-y divide-gray-300 dark:divide-gray-600"
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
                      icon={
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
                      }
                      label=""
                      placeholder={t("general.all")}
                      value={filter.name}
                      name="search"
                      custom-style={{
                        inputStyle: "px-8 !py-1 min-w-36",
                        labelStyle: "mb-0 !inline",
                      }}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="p-2">
                    <Input
                      id="search"
                      type="text"
                      icon={
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
                      }
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
                  <SkeletonTable cols={8} />
                ) : (
                  getParentsQuery.data?.data.data.map(
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
                            checked={
                              checks.find((check) => check.id == parent.id)
                                ?.status == true
                                ? true
                                : false
                            }
                            onChange={() => handleCheck(parent.id)}
                          />
                        </Table.Cell>
                        <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                          {parent.id}
                        </Table.Cell>
                        <Table.Cell>{parent.name}</Table.Cell>
                        <Table.Cell
                          className="font-medium text-gray-900 dark:text-gray-300"
                          // onMouseOver={(e) => setDropDownPos(e.currentTarget)}
                          // data-id={key}
                        >
                          <Dropdown
                            triggerEvent="hover"
                            additionalStyle={{ containerStyle: "!w-auto" }}
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
                                >
                                  {child.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.List>
                            <Dropdown.Button>
                              <p
                                onClick={() => (
                                  console.log("click"),
                                  setOpenChildModal({
                                    id: parent.id,
                                    school_id: parent.school_id,
                                    open: true,
                                  })
                                )}
                              >
                                {t("general.add_new_child")}
                              </p>
                            </Dropdown.Button>
                          </Dropdown>
                          {parent.childrens?.length < 1 && (
                            <div
                              className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
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
                            theme={{
                              toggle: {
                                base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                              },
                            }}
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
                                  onOpenEditModal({
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
                {getParentsQuery.data?.data.from}-
                {getParentsQuery.data?.data.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getParentsQuery.data?.data.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getParentsQuery.data?.data.per_page}
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
                totalPages={getParentsQuery.data?.data.last_page ?? 1}
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
