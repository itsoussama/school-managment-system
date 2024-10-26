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
import {
  alertDuration,
  alertIntialState,
  Alert as AlertType,
} from "@src/admin/utils/alert";
import Alert from "@src/components/alert";
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

interface Teacher {
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
  subject: string;
  gradelevel: string;
}

const SERVER_STORAGE = import.meta.env.VITE_SERVER_STORAGE;

export function ViewTeachers() {
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
  const [checks, setChecks] = useState<Array<Check>>([]);
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

  const getAllTeachersQuery = useQuery({
    queryKey: ["getAllTeachers"],
    queryFn: () => getTeachers(1, -1, undefined, undefined, 1),
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

  const getSubjectsQuery = useQuery({
    queryKey: ["getSubjects"],
    queryFn: getSubjects,
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

      setData({
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
      queryClient.invalidateQueries({ queryKey: ["getTeachers"] });
      // setOpenDeleteModal(undefined);
      setData({
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
    setData((prev) => ({
      ...(prev as Data),
      [event.target.id]: (event.target as HTMLInputElement).value,
    }));
    // console.log((event.target as HTMLInputElement).value);
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

    teacherMutation.mutate(form);

    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));

    setPreviewImg(undefined);
  };

  const onCloseModal = () => {
    teacherMutation.reset();
    setOpenModal((prev) => ({
      id: prev?.id as number,
      open: false,
    }));

    setData({
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

    if (input.verfication.value !== getTeacherQuery.data?.data.name) {
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

  const countCheckedRow = (data: Check[]) => {
    let totalChecked = 0;
    data.forEach((value) => {
      if (value.status) {
        totalChecked = totalChecked + 1;
      }
    });
    if (totalChecked == data.length) {
      (firstCheckboxRef.current as HTMLInputElement).checked = true;
    }
    return totalChecked;
  };

  useEffect(() => {
    console.log("checks");

    checks?.map((item) => {
      const checkboxElem = document.getElementById(
        item.id?.toString() as string,
      ) as HTMLInputElement;

      if (checkboxElem) {
        if (item.status) {
          checkboxElem.checked = true;
        } else {
          checkboxElem.checked = false;
        }
      }
    });
  }, [page, perPage, checks]);

  useEffect(() => {
    if (getTeachersQuery.isFetched) {
      let data = {};
      getTeachersQuery.data?.data.data.map((teacher: Teacher) => {
        data = { ...data, [teacher.id]: !!teacher.blocked };
      });
      setBlockSwitch(data);
    }
  }, [getTeachersQuery.data, getTeachersQuery.isFetched]);

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
        <Link
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          to="/"
        >
          <Breadcrumb.Item icon={FaHome}>
            {minSm ? t("home") : ""}
          </Breadcrumb.Item>
        </Link>
        {minSm ? (
          <Breadcrumb.Item>
            <span className="text-gray-600 dark:text-gray-300">
              {t("teachers")}
            </span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>...</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{t("view-teachers")}</Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        show={openModal?.type === "view" ? openModal?.open : false}
        // size={"md"}
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
          {t("teacher-id")}:<b> {openModal?.id}</b>
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
                  {t("active-deactivate")}
                </span>
                <ToggleSwitch
                  theme={{
                    toggle: {
                      base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                    },
                  }}
                  checked={blockSwitch[getTeacherQuery.data?.data.id] || false}
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
                  {t("personal-information")}
                </h1>
                <SkeletonContent isLoaded={getTeacherQuery.isFetched}>
                  <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-x-11 gap-y-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("first-name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getTeacherQuery.data?.data.name).firstName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("last-name")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getUserName(getTeacherQuery.data?.data.name).lastName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("email")}:
                      </span>
                      <span className="flex-1 break-words text-base text-gray-900 dark:text-white">
                        {getTeacherQuery.data?.data.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-400">
                        {fieldTrans("phone-number")}:
                      </span>
                      <span className="text-base text-gray-900 dark:text-white">
                        {getTeacherQuery.data?.data.phone}
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
                      {fieldTrans("subjects")}:
                    </span>
                    <div className="flex w-max max-w-36 flex-wrap">
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
                      {fieldTrans("grade-levels")}:
                    </span>
                    <div className="flex w-max max-w-36 flex-wrap">
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
                      {fieldTrans("start-date")}:
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
            {t("teacher-id")}:<b> {openModal?.id}</b>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-8 sm:flex-row">
              <div className="flex min-w-fit flex-col items-center gap-y-2 rounded-s bg-gray-200 p-4 dark:bg-gray-800">
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
                      disabled={getTeacherQuery.isFetching && true}
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
                      disabled={getTeacherQuery.isFetching && true}
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
                      disabled={getTeacherQuery.isFetching && true}
                      value={data?.phone}
                      onChange={onChange}
                    />

                    <Input
                      type="email"
                      id="email"
                      name="email"
                      label={fieldTrans("email")}
                      placeholder={fieldTrans("email-placeholder")}
                      custom-style={{ inputStyle: "disabled:opacity-50" }}
                      disabled={getTeacherQuery.isFetching && true}
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
                <b>{getTeacherQuery.data?.data.name}</b>
              </p>
              <div className="mb-3 flex items-center space-x-4 rounded-s bg-red-600 px-4 py-2">
                <FaExclamationTriangle className="text-white" size={53} />
                <p className="text-white">{t("delete-modal-message")}</p>
              </div>
              <p className="text-gray-900 dark:text-white">
                {t("delete-modal-label")}{" "}
                <b>{getTeacherQuery.data?.data.name}</b>
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
                <b>{getTeacherQuery.data?.data.name}</b>
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
              {getTeacherQuery.data?.data.blocked == 0
                ? t("block-modal-block-btn")
                : t("block-modal-unblock-btn")}
            </button>
            <button className="btn-outline !w-auto" onClick={onCloseModal}>
              {t("block-modal-cancel-btn")}
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="flex w-full flex-col rounded-m bg-light-primary dark:bg-dark-primary">
        {checks.find((val) => val.status === true) ? (
          <div className="flex w-full justify-between px-5 py-4">
            <div className="flex items-center gap-x-4">
              {/* <CheckboxDropdown /> */}

              <button className="btn-danger !m-0 flex w-max items-center">
                <FaTrash className="mr-2 text-white" />
                {t("delete-records")}
                <span className="ml-2 rounded-lg bg-red-800 pb-1 pl-1.5 pr-2 pt-0.5 text-xs">{`${countCheckedRow(checks)}`}</span>
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
              <Table.HeadCell>{t("teacher-id")}</Table.HeadCell>
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
              <Table.HeadCell>{fieldTrans("subjects")}</Table.HeadCell>
              <Table.HeadCell>{fieldTrans("grade-levels")}</Table.HeadCell>
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
              {getTeachersQuery.isFetching &&
                (getTeachersQuery.isRefetching || perPage) && (
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
                    value={filter.name}
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
                  <RSelect
                    id="subject"
                    name="subject"
                    icon={
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
                      selected={filter.subject == "" ? true : false}
                      disabled
                    >
                      {fieldTrans("filter-all")}
                    </option>
                    {getSubjectsQuery.data?.data.data.map(
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
                <Table.Cell className="p-2"></Table.Cell>
              </Table.Row>
              {getTeachersQuery.isFetching &&
              !(getTeachersQuery.isRefetching || perPage) ? (
                <SkeletonTable cols={8} />
              ) : (
                getTeachersQuery.data?.data.data.map(
                  (teacher: Teacher, key: number) => (
                    <Table.Row
                      key={key}
                      className="w-max !border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="sticky left-0 p-4 group-odd:bg-white group-even:bg-gray-50 dark:group-odd:bg-gray-800 dark:group-even:bg-gray-700">
                        <Checkbox
                          id={teacher.id.toString()}
                          name="checkbox"
                          onChange={(ev) =>
                            handleCheck(parseInt(ev.currentTarget.id))
                          }
                          data-id={key}
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
                          theme={{
                            toggle: {
                              base: "relative rounded-lg border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
                            },
                          }}
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
            {t("records-number")}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {getTeachersQuery.data?.data.from}-
              {getTeachersQuery.data?.data.to}
            </span>{" "}
            {t("total-records")}{" "}
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
