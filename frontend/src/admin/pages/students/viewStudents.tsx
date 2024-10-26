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
  FaEye,
  FaHome,
  FaLock,
  FaPen,
  FaSearch,
  FaSortDown,
  FaSortUp,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { Link } from "react-router-dom";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteUser,
  getUser,
  getStudents,
  setStudent,
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
import AddParentModal from "@src/admin/components/addParentModal";
import Alert from "@src/components/alert";
import {
  alertDuration,
  alertIntialState,
  Alert as AlertType,
} from "@src/admin/utils/alert";
import { FaRegCircleXmark } from "react-icons/fa6";

interface Check {
  id?: number;
  status?: boolean;
}

interface Modal {
  id: number;
  type?: "view" | "edit" | "delete" | "block";
  open: boolean;
}

interface ParentModal {
  id: number;
  school_id: number;
  open: boolean;
}

interface Student {
  id: number;
  name: string;
  imagePath: string;
  email: string;
  phone: string;
  school_id: number;
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
  blocked?: boolean;
  guardian: {
    id: number;
    guardian_id: number;
    imagePath: string;
    name: string;
    email: string;
    school_id: number;
    phone: string;
  };
}

interface Grade {
  id: number;
  label: string;
}

export interface FormData {
  _method: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: File;
}

interface Data {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: File;
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
  gradelevel: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function ViewStudents() {
  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["getTeacher"] });

  const [sortPosition, setSortPosition] = useState<number>(0);
  const [sort, setSort] = useState<Sort>({ column: "id", direction: "asc" });
  const [filter, setFilter] = useState<Filter>({
    name: "",
    gradelevel: "",
  });
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>();
  const firstCheckboxRef = useRef<HTMLInputElement>(null);
  const isCheckBoxAll = useRef(false);
  const [checks, setChecks] = useState<Array<Check>>([]);
  const [numChecked, setNumChecked] = useState<number>(0);
  const [openModal, setOpenModal] = useState<Modal>();
  const [openParentModal, setOpenParentModal] = useState<ParentModal>({
    id: 0,
    school_id: 0,
    open: false,
  });
  const [isVerficationMatch, setIsVerficationMatch] = useState<boolean>(true);
  const [img, setImg] = useState<FileList>();
  const [previewImg, setPreviewImg] = useState<string>();
  const [data, setdata] = useState<Data>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [blockSwitch, setBlockSwitch] = useState<BlockSwitch>({});
  const [alert, toggleAlert] = useState<AlertType>(alertIntialState);
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const admin = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  const { t: fieldTrans } = useTranslation("form-fields");
  const badgeColor = ["blue", "green", "pink", "purple", "red", "yellow"];
  const minSm = useBreakpoint("min", "sm");

  // const userId = useRef<string>(null)
  const getAllStudentsQuery = useQuery({
    queryKey: ["getAllStudents"],
    queryFn: () => getStudents(1, -1, undefined, undefined, 1),
    placeholderData: keepPreviousData,
  });

  const getStudentsQuery = useQuery({
    queryKey: [
      "getStudents",
      page,
      perPage,
      sort.column,
      sort.direction,
      admin.school_id,
      filter?.name,
      filter?.gradelevel,
    ],
    queryFn: () =>
      getStudents(
        page,
        perPage,
        sort.column,
        sort.direction,
        admin.school_id,
        filter?.name,
        filter?.gradelevel,
      ),
    placeholderData: keepPreviousData,
  });

  const getStudentQuery = useQuery({
    queryKey: ["getStudent", openModal?.id, "student"],
    queryFn: () => getUser(openModal?.id as number, "student"),
    enabled: !!openModal?.id,
  });

  const getGradesQuery = useQuery({
    queryKey: ["getGrades"],
    queryFn: getGrades,
  });

  const studentMutation = useMutation({
    mutationFn: setStudent,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getStudent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      setdata({
        id: data?.id,
        firstName: getUserName(data?.name).firstName,
        lastName: getUserName(data?.name).lastName,
        email: data?.email,
        phone: data?.phone,
      });

      toggleAlert({
        status: "success",
        message: {
          title: "Operation Successful",
          description: " Your changes have been saved successfully.",
        },
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: "Something went wrong. Please try again later.",
        },
        state: true,
      });
    },
  });

  const deleteUserQuery = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStudents"] });
      // setOpenDeleteModal(undefined);
      setdata({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });

      toggleAlert({
        status: "success",
        message: {
          title: "Operation Successful",
          description: " Your changes have been saved successfully.",
        },
        state: true,
      });
    },

    onError: () => {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: "Something went wrong. Please try again later.",
        },
        state: true,
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getParents"] });
    },
  });

  const unBlockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getParents"] });
    },
  });
  // const [selectedItem, setSelectedItem] = useState()

  const handleChecks = useCallback(
    async (firstCheckbox: HTMLInputElement) => {
      if (getAllStudentsQuery.isFetched) {
        await getAllStudentsQuery.data?.data.forEach((student: Student) => {
          setChecks((prev) => {
            const checkedData = prev.some((item) => item.id === student.id);
            if (firstCheckbox.checked && !checkedData) {
              return [...prev, { id: student.id as number, status: true }];
            }
            return [...prev, { id: student.id as number, status: false }];
          });
        });
      }
    },
    [getAllStudentsQuery.data?.data, getAllStudentsQuery.isFetched],
  );

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

  const onChange = (event: ChangeEvent) => {
    setdata((prev) => ({
      ...(prev as Data),
      [event.target.id]: (event.target as HTMLInputElement).value,
    }));
    // console.log((event.target as HTMLInputElement).value);
  };

  const onOpenEditModal = async ({ id, type, open: isOpen }: Modal) => {
    setOpenModal({ id: id, type: type, open: isOpen });
    const { data: StudentData } = await queryClient.ensureQueryData({
      queryKey: ["getStudent", id],
      queryFn: () => getUser(id),
    });

    setdata({
      id: StudentData?.id,
      firstName: getUserName(StudentData?.name).firstName,
      lastName: getUserName(StudentData?.name).lastName,
      email: StudentData?.email,
      phone: StudentData?.phone,
    });
  };

  const onSubmitUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form: FormData = {
      _method: "PUT",
      id: data?.id,
      name: data?.firstName + " " + data?.lastName,
      email: data?.email,
      phone: data?.phone,
    };

    try {
      if (img) {
        form["image"] = img[0];
      } else {
        throw new Error("image not found");
      }
    } catch (e) {
      toggleAlert({
        status: "fail",
        message: {
          title: "Operation Failed",
          description: (e as Error).message,
        },
        state: true,
      });
    }

    studentMutation.mutate(form);

    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));

    setPreviewImg(undefined);
  };

  const onCloseModal = () => {
    studentMutation.reset();
    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));

    setdata({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  const onSubmitDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerficationMatch(true);
    const input = event.target as HTMLFormElement;

    if (input.verfication.value !== getStudentQuery.data?.data.name) {
      setIsVerficationMatch(false);
      return;
    }

    deleteUserQuery.mutate(openModal?.id as number);
    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));
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

    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));
  };

  // const formatDuration = (duration: number) => {
  //   const convertToHour = Math.floor(duration / (1000 * 60 * 60));
  //   const remainingMilliseconds = duration % (1000 * 60 * 60);
  //   const convertToMinute = Math.floor(remainingMilliseconds / (1000 * 60));

  //   return { hour: convertToHour, minute: convertToMinute };
  // };

  const handlePerPage = (ev: ChangeEvent) => {
    const target = ev.target as HTMLSelectElement;
    setPage(1);
    setPerPage(parseInt(target.value));
  };

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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;

      setImg(file);
      readAndPreview(file as FileList);
    }
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

  useEffect(() => {
    if (getStudentsQuery.isFetched) {
      let data = {};
      getStudentsQuery.data?.data.data.map((student: Student) => {
        data = { ...data, [student.id]: !!student.blocked };
      });
      setBlockSwitch(data);
    }
  }, [getStudentsQuery.data, getStudentsQuery.isFetched]);

  return (
    <div className="flex w-full flex-col">
      <Alert
        status={alert.status}
        state={alert.state}
        duration={alertDuration}
        title={alert.message.title}
        description={alert.message.description}
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
            {minSm ? t("home") : ""}
          </Link>
        </Breadcrumb.Item>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("students")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item className="whitespace-nowrap">
          {t("view-students")}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        // size={"xl"}
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
          {t("student-id")}:<b> {openModal?.id}</b>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-4 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
              <SkeletonProfile
                imgSource={
                  getStudentQuery.data?.data.imagePath
                    ? SERVER_STORAGE + getStudentQuery.data?.data.imagePath
                    : `https://avatar.iran.liara.run/username?username=${getUserName(getStudentQuery.data?.data.name).firstName}+${getUserName(getStudentQuery.data?.data.name).lastName}`
                }
                className="h-40 w-40"
              />
              <div className="flex flex-col gap-2 rounded-s bg-white px-4 py-2 dark:bg-gray-700">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                  {t("active-deactivate")}
                </span>
                <ToggleSwitch
                  theme={{
                    toggle: {
                      base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                    },
                  }}
                  checked={blockSwitch[getStudentQuery.data?.data.id] || false}
                  onChange={() =>
                    setOpenModal({
                      id: getStudentQuery.data?.data.id,
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
                  {t("personal-information")}
                </h1>
                <SkeletonContent isLoaded={getStudentQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("first-name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getStudentQuery.data?.data.name).firstName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("last-name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getStudentQuery.data?.data.name).lastName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("email")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getStudentQuery.data?.data.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("email")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getStudentQuery.data?.data.phone}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("address")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        123 Rue Principale
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("date-birth")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        2024/01/01
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {t("parent-guardian")}:
                      </span>
                      {getStudentQuery.data?.data.guardian ? (
                        <div className="flex items-center gap-x-2">
                          <img
                            className="w-7 rounded-full"
                            src={
                              getStudentQuery.data?.data.guardian.imagePath
                                ? SERVER_STORAGE +
                                  getStudentQuery.data?.data.guardian.imagePath
                                : `https://avatar.iran.liara.run/username?username=${getUserName(getStudentQuery.data?.data.guardian.name).firstName}+${getUserName(getStudentQuery.data?.data.guardian.name).lastName}`
                            }
                            alt="profile"
                          />
                          <span className="text-sm text-dark-primary dark:text-white">
                            {getStudentQuery.data?.data.guardian?.name}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                          onClick={() =>
                            setOpenParentModal({
                              id: getStudentQuery.data?.data.id,
                              school_id: getStudentQuery.data?.data.school_id,
                              open: true,
                            })
                          }
                        >
                          <FaUser className="me-2" />
                          Assign to a parent
                        </div>
                      )}
                    </div>
                  </div>
                </SkeletonContent>
              </div>

              <div className="w-full space-y-3">
                <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                  {t("academic-information")}
                </h1>
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="mb-1 text-sm font-semibold text-gray-800 dark:text-gray-400">
                      {fieldTrans("grade-levels")}:
                    </span>
                    <div className="flex w-max max-w-36 flex-wrap">
                      {getStudentQuery.data?.data.grades.map(
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
                      {t("enrollement-date")}:
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
            {t("student-id")}:<b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="flex min-w-fit flex-col items-center gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
                <SkeletonProfile
                  imgSource={
                    previewImg
                      ? previewImg
                      : getStudentQuery.data?.data.imagePath
                        ? SERVER_STORAGE + getStudentQuery.data?.data.imagePath
                        : `https://avatar.iran.liara.run/username?username=${getUserName(getStudentQuery.data?.data.name).firstName}+${getUserName(getStudentQuery.data?.data.name).lastName}`
                  }
                  className="h-40 w-40"
                />

                <button className="btn-gray relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute left-0 top-0 cursor-pointer opacity-0"
                    onChange={handleImageUpload}
                  />
                  {fieldTrans("upload-photo")}
                </button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("accepted-format")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      jpg, jpeg, png
                    </span>
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-500">
                    {t("maximum-size")}:{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      1024 mb
                    </span>
                  </span>
                </div>
              </div>
              <div className="box-border flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto">
                <div className="w-full space-y-3">
                  <h1 className="rounded-s bg-gray-200 px-4 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {t("personal-information")}
                  </h1>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-x-11 gap-y-8 whitespace-nowrap">
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      label={fieldTrans("first-name")}
                      placeholder={fieldTrans("first-name-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={data?.firstName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      label={fieldTrans("last-name")}
                      placeholder={fieldTrans("last-name-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={data?.lastName}
                      onChange={onChange}
                    />

                    <Input
                      type="text"
                      id="address"
                      name="address"
                      label={fieldTrans("address")}
                      placeholder={fieldTrans("address-placeholder")}
                      value="123 Rue Principale"
                      onChange={(e) => console.log(e.target.value)}
                      custom-style={{ containerStyle: "col-span-full" }}
                    />

                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      label={fieldTrans("phone-number")}
                      placeholder="06 00 00 00"
                      pattern="(06|05)[0-9]{6}"
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={data?.phone}
                      onChange={onChange}
                    />

                    <Input
                      type="email"
                      id="email"
                      name="email"
                      label={fieldTrans("email")}
                      placeholder={fieldTrans("email-placeholer")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getStudentQuery.isFetching && true}
                      value={data?.email}
                      onChange={onChange}
                    />

                    <Input
                      type="password"
                      id="password"
                      name="password"
                      label={fieldTrans("password")}
                      placeholder="●●●●●●●"
                      custom-style={{
                        inputStyle: "px-10",
                      }}
                      icon={
                        <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      }
                      onChange={(e) => console.log(e.target.value)}
                    />

                    <Input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      label={fieldTrans("confirm-password")}
                      placeholder="●●●●●●●"
                      custom-style={{
                        inputStyle: "px-10",
                      }}
                      icon={
                        <FaLock className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                      }
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-default !w-auto">
              {fieldTrans("accept")}
            </button>
            <button className="btn-danger !w-auto" onClick={onCloseModal}>
              {fieldTrans("decline")}
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
          <Modal.Header>{t("delete-modal")}</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("delete-modal-title")}{" "}
                <b>{getStudentQuery.data?.data.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("delete-modal-message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("delete-modal-label")}{" "}
                <b>{getStudentQuery.data?.data.name}</b>
              </p>
              <Input
                type="text"
                id="verfication"
                name="verfication"
                placeholder="John doe"
                error={!isVerficationMatch ? t("delete-modal-error") : null}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {t("delete-modal-delete-btn")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("delete-modal-cancel-btn")}
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
          <Modal.Header>{t("block-modal")}</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-x-8">
              <p className="mb-3 text-gray-600 dark:text-gray-300">
                {t("block-modal-title")}{" "}
                <b>{getStudentQuery.data?.data.name}</b>
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
                  !isVerficationMatch ? fieldTrans("delete-modal-error") : null
                }
                required
              /> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn-danger !w-auto">
              {getStudentQuery.data?.data.blocked == 0
                ? t("block-modal-block-btn")
                : t("block-modal-unblock-btn")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("block-modal-cancel-btn")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <AddParentModal
        open={openParentModal?.open as boolean}
        toggleOpen={(isOpen: boolean) =>
          setOpenParentModal((prev: ParentModal) => ({
            id: openParentModal?.id as number,
            school_id: prev?.school_id,
            open: isOpen,
          }))
        }
        child_id={openParentModal.id}
        school_id={openParentModal?.school_id}
      />

      <div className="flex w-full flex-col rounded-m bg-light-primary dark:bg-dark-primary">
        {checks.find((val) => val.status === true) ? (
          <div className="flex w-full justify-between px-5 py-4">
            <div className="flex items-center gap-x-4">
              {/* <CheckboxDropdown /> */}

              <button className="btn-danger !m-0 flex w-max items-center">
                <FaTrash className="mr-2 text-white" />
                {t("delete-records")}
                <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${numChecked}`}</span>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="w-full overflow-x-auto rounded-lg">
          <Table
            theme={{
              root: {
                base: "w-full whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400",
                shadow:
                  "absolute left-0 top-0 -z-10 h-full w-full rounded-s bg-white drop-shadow-md dark:bg-black",
                wrapper: "relative",
              },
              body: {
                cell: {
                  base: "px-6 py-4",
                },
              },
              head: {
                cell: {
                  base: "bg-gray-50 px-6 py-3 dark:bg-gray-700",
                },
              },
              row: {
                base: "group/row group",
                hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
                striped:
                  "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
              },
            }}
            striped
          >
            <Table.Head className="border-b border-b-gray-300 uppercase dark:border-b-gray-600">
              <Table.HeadCell className="sticky left-0 w-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                <Checkbox
                  id="0"
                  ref={firstCheckboxRef}
                  onChange={() => handleCheck()}
                />
              </Table.HeadCell>
              <Table.HeadCell>{t("student-id")}</Table.HeadCell>
              <Table.HeadCell>
                <div className="flex items-center justify-center gap-x-3">
                  <span className="inline-block">{t("full-name")}</span>
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
              <Table.HeadCell>{fieldTrans("grade-levels")}</Table.HeadCell>
              <Table.HeadCell>{t("date-birth")}</Table.HeadCell>
              <Table.HeadCell>{t("parent-guardian")}</Table.HeadCell>
              <Table.HeadCell>{t("relationship")}</Table.HeadCell>
              <Table.HeadCell>{t("enrollement-date")}</Table.HeadCell>
              <Table.HeadCell>{fieldTrans("email")}</Table.HeadCell>
              <Table.HeadCell>{fieldTrans("phone-number")}</Table.HeadCell>
              <Table.HeadCell>{t("active-time")}</Table.HeadCell>
              <Table.HeadCell>{t("active-deactivate")}</Table.HeadCell>
              <Table.HeadCell className="w-0">
                <span className="sr-only w-full">Actions</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body
              ref={tableRef}
              className="divide-y divide-gray-300 dark:divide-gray-600"
            >
              {getStudentsQuery.isFetching &&
                (getStudentsQuery.isRefetching || perPage) && (
                  <Table.Row>
                    <Table.Cell className="p-0">
                      <div
                        className={`table-loader absolute left-0 top-0 z-auto grid h-full min-h-72 w-full place-items-center overflow-hidden bg-gray-100 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50`}
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
                    placeholder={fieldTrans("filter-all")}
                    value={filter?.name}
                    name="search"
                    custom-style={{
                      inputStyle: "px-8 !py-1",
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
                  {" "}
                  <RSelect
                    id="gradelevel"
                    name="gradelevel"
                    icon={
                      <>
                        <IoFilter className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        {filter.gradelevel !== "" && (
                          <FaRegCircleXmark
                            onClick={() =>
                              setFilter((prev) => ({ ...prev, gradelevel: "" }))
                            }
                            className="absolute right-0 top-1/2 mr-4 -translate-x-full -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400"
                          />
                        )}
                      </>
                    }
                    custom-style={{
                      inputStyle: "px-9 !py-1",
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
                      selected={filter.gradelevel == "" ? true : false}
                      disabled
                    >
                      {fieldTrans("filter-all")}
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
                <Table.Cell className="p-2">
                  {/* <div className="h-2 w-12 bg-red-600"></div> */}
                  <Input
                    id="search"
                    type="text"
                    icon={
                      <FaSearch className="absolute top-1/2 mx-3 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    }
                    label=""
                    placeholder={fieldTrans("filter-all")}
                    name="search"
                    custom-style={{
                      inputStyle: "px-8 !py-1",
                      labelStyle: "mb-0 !inline",
                    }}
                  />
                </Table.Cell>
              </Table.Row>
              {getStudentsQuery.isFetching &&
              !(getStudentsQuery.isRefetching || perPage) ? (
                <SkeletonTable cols={11} />
              ) : (
                getStudentsQuery.data?.data.data.map(
                  (student: Student, key: number) => (
                    <Table.Row
                      key={key}
                      className="w-max bg-white dark:bg-gray-800"
                    >
                      <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                        <Checkbox
                          id={student.id.toString()}
                          name="checkbox"
                          checked={
                            checks.find((check) => check.id == student.id)
                              ?.status == true
                              ? true
                              : false
                          }
                          onChange={() => handleCheck(student.id)}
                        />
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        {student.id}
                      </Table.Cell>
                      <Table.Cell>{student.name}</Table.Cell>

                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        <div className="flex w-max max-w-36 flex-wrap">
                          {student.grades?.map((grade, index) => (
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
                      <Table.Cell>{/* {student.date_birth} */}-</Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        {student.guardian ? (
                          <div className="flex items-center gap-x-2">
                            <img
                              className="w-8 rounded-full"
                              src={
                                student.guardian.imagePath
                                  ? SERVER_STORAGE + student.guardian.imagePath
                                  : `https://avatar.iran.liara.run/username?username=${getUserName(student.guardian.name).firstName}+${getUserName(student.guardian.name).lastName}`
                              }
                              alt="profile"
                            />
                            <span>{student.guardian?.name}</span>
                          </div>
                        ) : (
                          <div
                            className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                            onClick={() =>
                              setOpenParentModal({
                                id: student.id,
                                school_id: student.school_id,
                                open: true,
                              })
                            }
                          >
                            <FaUser className="me-2" />
                            Assign to a parent
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        -
                      </Table.Cell>
                      <Table.Cell>
                        {/* {student.enrollment_date} */}-
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        {student.email}
                      </Table.Cell>
                      <Table.Cell>{student.phone}</Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
                        {/* <span>
                      {formatDuration(student.time_spent).hour}
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        h{" "}
                      </span>
                      {formatDuration(student.time_spent).minute > 0
                        ? formatDuration(student.time_spent).minute
                        : ""}
                      <span
                        className="text-gray-500 dark:text-gray-400"
                        hidden={formatDuration(student.time_spent).minute <= 0}
                      >
                        {" "}
                        min
                      </span>
                    </span> */}
                        -
                      </Table.Cell>
                      <Table.Cell>
                        <ToggleSwitch
                          theme={{
                            toggle: {
                              base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                            },
                          }}
                          checked={blockSwitch[student.id] || false}
                          onChange={() =>
                            setOpenModal({
                              id: student.id,
                              type: "block",
                              open: true,
                            })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex w-fit gap-x-2">
                          <div
                            onClick={() =>
                              setOpenModal({
                                id: student.id,
                                type: "view",
                                open: true,
                              })
                            }
                            className="cursor-pointer rounded-s bg-blue-100 p-2 dark:bg-blue-500 dark:bg-opacity-20"
                          >
                            <FaEye className="text-blue-600 dark:text-blue-500" />
                          </div>
                          <div
                            className="cursor-pointer rounded-s bg-green-100 p-2 dark:bg-green-500 dark:bg-opacity-20"
                            onClick={() =>
                              onOpenEditModal({
                                id: student.id,
                                type: "edit",
                                open: true,
                              })
                            }
                          >
                            <FaPen className="text-green-600 dark:text-green-500" />
                          </div>
                          <div
                            className="cursor-pointer rounded-s bg-red-100 p-2 dark:bg-red-500 dark:bg-opacity-20"
                            onClick={() =>
                              setOpenModal({
                                id: student.id,
                                type: "delete",
                                open: true,
                              })
                            }
                          >
                            <FaTrash className="text-red-600 dark:text-red-500" />
                          </div>
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
            {t("records-number")}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {getStudentsQuery.data?.data.from}-
              {getStudentsQuery.data?.data.to}
            </span>{" "}
            {t("total-records")}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {getStudentsQuery.data?.data.total}
            </span>
          </span>
          <div className="flex items-center gap-x-4">
            <RSelect
              id="row-num"
              name="row-num"
              onChange={handlePerPage}
              custom-style={{ inputStyle: "!py-2" }}
              defaultValue={getStudentsQuery.data?.data.per_page}
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
                !getStudentsQuery.isPlaceholderData && setPage(page)
              }
              totalPages={getStudentsQuery.data?.data.last_page ?? 1}
              nextLabel={minSm ? t("next") : ""}
              previousLabel={minSm ? t("previous") : ""}
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
