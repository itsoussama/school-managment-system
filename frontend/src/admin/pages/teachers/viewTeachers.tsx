import { Button, Input, RSelect } from "@src/components/input";

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
  FaExclamationTriangle,
  FaHome,
  FaLock,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
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
  getTeachers,
  setTeacher,
  getSubjects,
  getGrades,
  blockUser,
  unblockUser,
} from "@api";
import {
  SkeletonContent,
  SkeletonProfile,
  SkeletonTable,
} from "@src/components/skeleton";
import { useAppSelector } from "@src/hooks/useReduxEvent";
import useBreakpoint from "@src/hooks/useBreakpoint";
import { alertIntialState, Alert as AlertType } from "@src/utils/alert";
import Alert from "@src/components/alert";
import { FaEye, FaEyeSlash, FaRegCircleXmark } from "react-icons/fa6";
import { TransitionAnimation } from "@src/components/animation";
import {
  customTable,
  customToggleSwitch,
  customTooltip,
} from "@src/utils/flowbite";
import React from "react";

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
  email: string;
  phone: string;
  blocked?: boolean;
  role: [
    {
      id: string;
      name: string;
    },
  ];
  subjects: [
    {
      id: string;
      name: string;
    },
  ];
  grades: [
    {
      id: string;
      label: string;
    },
  ];
}
interface Grade {
  id: number;
  label: string;
}
interface Subject {
  id: number;
  name: string;
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

interface Sort {
  column: string;
  direction: "asc" | "desc";
}
interface Filter {
  name: string;
  subject: string;
  gradelevel: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function ViewTeachers() {
  const brandState = useAppSelector((state) => state.preferenceSlice.brand);
  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["getTeacher"] });

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
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
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
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.userSlice.user);
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
        admin.school_id,
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
      admin.school_id,
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
        admin.school_id,
        filter?.name,
        filter?.subject,
        filter?.gradelevel,
      ),
    placeholderData: keepPreviousData,
  });

  const getTeacherQuery = useQuery({
    queryKey: ["getTeacher", openModal?.id],
    queryFn: () => getUser(openModal?.id as number),
    enabled: !!openModal?.id,
  });

  const getAllSubjectsQuery = useQuery({
    queryKey: [
      "getAllSubjects",
      // filter?.name,
      // filter?.subject,
      // filter?.gradelevel,
    ],
    queryFn: () => getSubjects(1, -1, undefined, undefined, admin.school_id),
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: getGrades,
  });

  const teacherMutation = useMutation({
    mutationFn: setTeacher,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTeacher"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
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
        id: new Date().getTime(),
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
        id: new Date().getTime(),
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
        queryKey: ["getTeachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });
      // setOpenDeleteModal(undefined);
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
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTeacher"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: true,
      }));
      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: (_, { user_id }) => {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: false,
      }));
      toggleAlert({
        id: new Date().getTime(),
        status: "fail",
        message: "Operation Failed",
        state: true,
      });
    },
  });

  const unBlockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTeacher"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getAllTeachers"],
      });
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: true,
      }));
      toggleAlert({
        id: new Date().getTime(),
        status: "success",
        message: "Operation Successful",
        state: true,
      });
    },

    onError: (_, { user_id }) => {
      setBlockSwitch((prev) => ({
        ...prev,
        // [userId]: !prev?.[userId],
        [user_id]: false,
      }));
      toggleAlert({
        id: new Date().getTime(),
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
    // console.log((event.target as HTMLInputElement).value);
  };

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
        await getAllTeachersQuery.data?.data.forEach((teacher: Teacher) => {
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
    [getAllTeachersQuery.data?.data, getAllTeachersQuery.isFetched],
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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
    }
  };

  const onSubmitBlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId: number = openModal?.id as number;

    if (!blockSwitch[userId]) {
      blockUserMutation.mutate({ user_id: userId });
    } else {
      unBlockUserMutation.mutate({ user_id: userId });
    }

    setOpenModal(undefined);
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

      teacherMutation.mutate(form);
    } else {
      toggleAlert({
        id: new Date().getTime(),
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

    if (
      (input.verfication.value as string).toLowerCase() ===
      getTeacherQuery.data?.data.name
    ) {
      setIsVerficationMatch(false);
      return;
    }

    deleteUserQuery.mutate(openModal?.id as number);
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const { data: teacherData } = await queryClient.ensureQueryData({
      queryKey: ["getTeacher", id],
      queryFn: () => getUser(id),
    });

    setData({
      id: teacherData?.id,
      firstName: getUserName(teacherData?.name).firstName,
      lastName: getUserName(teacherData?.name).lastName,
      email: teacherData?.email,
      phone: teacherData?.phone,
      password: "",
      confirm_password: "",
    });
  };

  const onCloseModal = () => {
    teacherMutation.reset();
    setOpenModal(undefined);

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
      phone: "",
      password: "",
      confirm_password: "",
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

  useEffect(() => {
    if (getTeachersQuery.isFetched) {
      let data = {};
      getTeachersQuery.data?.data.data.map((teacher: Teacher) => {
        data = { ...data, [teacher.id]: !!teacher.blocked };
      });
      setBlockSwitch(data);
    }
  }, [getTeachersQuery.data, getTeachersQuery.isFetched]);

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

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        size={"4xl"}
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
                  getTeacherQuery.data?.data.imagePath
                    ? SERVER_STORAGE + getTeacherQuery.data?.data.imagePath
                    : `https://avatar.iran.liara.run/username?username=${getUserName(getTeacherQuery.data?.data.name).firstName}+${getUserName(getTeacherQuery.data?.data.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("status.active_deactivate")}
                </span>
                <ToggleSwitch
                  theme={customToggleSwitch}
                  checked={blockSwitch[getTeacherQuery.data?.data.id] || false}
                  color={brandState}
                  onChange={() =>
                    setOpenModal({
                      id: getTeacherQuery.data?.data.id,
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
                <SkeletonContent isLoaded={getTeacherQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.first_name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getTeacherQuery.data?.data.name).firstName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.last_name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getTeacherQuery.data?.data.name).lastName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.email")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getTeacherQuery.data?.data.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("form.fields.phone_number")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getTeacherQuery.data?.data.phone}
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
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.subjects")}:
                    </span>
                    <div className="flex w-max max-w-48 flex-wrap">
                      {getTeacherQuery.data?.data.subjects.map(
                        (subject: Subject, index: number) => (
                          <Badge
                            key={index}
                            color={badgeColor[index % badgeColor.length]}
                            className="mb-1 me-1 rounded-xs"
                          >
                            {subject.name}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.grade_levels")}:
                    </span>
                    <div className="flex w-max max-w-48 flex-wrap">
                      {getTeacherQuery.data?.data.grades.map(
                        (grade: Grade, index: number) => (
                          <Badge
                            key={index}
                            color={badgeColor[index % badgeColor.length]}
                            className="mb-1 me-1 rounded-xs"
                          >
                            {grade.label}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {t("form.fields.start_date")}:
                    </span>
                    <span className="text-base text-gray-900 dark:text-white">
                      2024/01/01
                    </span>
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
                      : getTeacherQuery.data?.data.imagePath
                        ? SERVER_STORAGE + getTeacherQuery.data?.data.imagePath
                        : `https://avatar.iran.liara.run/username?username=${getUserName(getTeacherQuery.data?.data.name).firstName}+${getUserName(getTeacherQuery.data?.data.name).lastName}`
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
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
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
                      disabled={getTeacherQuery.isFetching && true}
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
                      disabled={getTeacherQuery.isFetching && true}
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
                      disabled={getTeacherQuery.isFetching && true}
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
                      disabled={getTeacherQuery.isFetching && true}
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
                          leftIcon={FaLock}
                          rightIcon={(isPasswordVisible) =>
                            isPasswordVisible ? FaEyeSlash : FaEye
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
                          leftIcon={FaLock}
                          rightIcon={(isPasswordVisible) =>
                            isPasswordVisible ? FaEyeSlash : FaEye
                          }
                          onChange={onChange}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => toggleChangePassword(true)}
                          className="btn-default !w-auto"
                        >
                          {t("form.buttons.change", {
                            label:
                              t("determiners.definite.masculine") +
                              " " +
                              t("form.fields.password"),
                          })}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="btn-default !w-auto">
              {t("general.accept")}
            </Button>
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
                {t("modals.delete.title")}{" "}
                <b>{getTeacherQuery.data?.data.name} ?</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("modals.delete.message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("modals.delete.label", {
                  item: getTeacherQuery.data?.data.name,
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
            <button
              className="btn-outline !ml-0 !w-auto"
              onClick={onCloseModal}
            >
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
                <b>{getTeacherQuery.data?.data.name} ?</b>
              </p>
              {/* <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("delete-modal-message")}</p>
              </div> */}
              {/* <p className="text-gray-900 dark:text-white">
                {t("delete-modal-label")}{" "}
                <b>{getParentQuery.data?.data.name}</b>
              </p> */}
              {/* <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={
                  !isVerficationMatch ? t("delete-modal-error") : null
                }
                required
              /> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {getTeacherQuery.data?.data.blocked == 0
                ? t("modals.block.block_button")
                : t("modals.block.unblock_button")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("modals.block.cancel_button")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
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
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
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
                      {getGradesQuery.data?.data.data.map(
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
                  <SkeletonTable cols={9} />
                ) : (
                  getTeachersQuery.data?.data.data.map(
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
                          T00{teacher.id}
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
                            checked={blockSwitch[teacher.id] || false}
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
                                  onOpenEditModal({
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
                {getTeachersQuery.data?.data.from}-
                {getTeachersQuery.data?.data.to}
              </span>{" "}
              {t("pagination.total_records")}{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getTeachersQuery.data?.data.total}
              </span>
            </span>
            <div className="flex items-center gap-x-4">
              <RSelect
                id="row-num"
                name="row-num"
                onChange={handlePerPage}
                custom-style={{ inputStyle: "!py-2" }}
                defaultValue={getTeachersQuery.data?.data.per_page}
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
                totalPages={getTeachersQuery.data?.data.last_page ?? 1}
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
